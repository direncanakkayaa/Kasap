"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { addSmsJob } from "@/lib/queue";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import logger from "@/lib/logger";

interface OrderItem {
  productId: string;
  quantity: number;
  weightGr?: number;
  butcherNotes?: string;
  serviceType: "RAW" | "COOKED";
  unitPrice: number;
  additionsTotal: number;
}

interface CreateOrderInput {
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  addressId?: string;
  paymentMethod?: "NAKIT" | "HAVALE" | "KART";
}

export async function createOrder(input: CreateOrderInput) {
  try {
    // Rate Limiting: 10 dakikada en fazla 3 sipariş denemesi
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(`order:${ip}`, { limit: 3, window: 600 });

    if (!success) {
      logger.warn({ ip }, "Rate limit exceeded for createOrder");
      return {
        success: false,
        error: "Çok fazla sipariş denemesi yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.",
      };
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return {
        success: false,
        error: "Sipariş verebilmek için giriş yapmanız gerekmektedir.",
        requiresAuth: true,
      };
    }

    const user = session.user as any;

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Sepetiniz boş." };
    }

    // Validate all products exist
    const productIds = input.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return {
        success: false,
        error: "Bazı ürünler artık mevcut değil. Lütfen sepetinizi güncelleyin.",
      };
    }

    // Get user info from database for customer fields
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return { success: false, error: "Kullanıcı bulunamadı." };
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: dbUser.id,
          customerName: dbUser.name || "İsimsiz Müşteri",
          customerPhone: dbUser.phone || "",
          customerEmail: dbUser.email || undefined,
          addressId: input.addressId || undefined,
          totalAmount: input.totalAmount,
          paymentMethod: (input.paymentMethod as any) || "NAKIT",
          paymentStatus: input.paymentMethod === "KART" ? "BEKLEMEDE" : "BEKLEMEDE",
          notes: input.notes || null,
          status: "ONAYLANDI" as any, // For now we assume confirmed immediately for testing
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              weightGr: item.weightGr || null,
              butcherNotes: item.butcherNotes
                ? `[${item.serviceType === "COOKED" ? "PİŞMİŞ" : "ÇİĞ"}] ${item.butcherNotes}`
                : `[${item.serviceType === "COOKED" ? "PİŞMİŞ" : "ÇİĞ"}]`,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return newOrder;
    });

    // Send SMS Notification (via Queue)
    try {
      const hasCooked = input.items.some(item => item.serviceType === "COOKED");
      const hasRaw = input.items.some(item => item.serviceType === "RAW");
      
      let templateId: "ORDER_CONFIRM_ET" | "ORDER_CONFIRM_YEMEK" | "ORDER_CONFIRM_GENEL" = "ORDER_CONFIRM_GENEL";
      
      if (hasCooked && !hasRaw) templateId = "ORDER_CONFIRM_YEMEK";
      else if (hasRaw && !hasCooked) templateId = "ORDER_CONFIRM_ET";

      await addSmsJob(templateId, order.customerPhone, {
        customerName: order.customerName,
        orderId: order.id
      });
    } catch (queueError) {
      logger.error({ error: queueError }, "Failed to queue SMS");
    }

    logger.info({ orderId: order.id, customer: order.customerPhone }, "Sipariş başarıyla oluşturuldu");
    return { success: true, orderId: order.id, data: order };
  } catch (error) {
    logger.error({ error, input }, "createOrder error");
    return {
      success: false,
      error: "Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Yetkisiz erişim." };
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Bu işlem için yönetici yetkisi gereklidir." };
    }

    const validStatuses = ["ODEME_BEKLENIYOR", "ONAYLANDI", "HAZIRLANIYOR", "YOLDA", "TAMAMLANDI", "IPTAL"];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: "Geçersiz sipariş durumu." };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any },
    });

    // Send SMS Notification for Processing status
    if (newStatus === "HAZIRLANIYOR") {
      try {
        await addSmsJob("ORDER_PROCESSING", order.customerPhone, {
          customerName: order.customerName,
          orderId: order.id
        });
      } catch (smsError) {
        logger.error({ error: smsError, orderId }, "Failed to queue processing SMS");
      }
    }

    // Create log
    await (prisma as any).orderLog.create({
      data: {
        orderId,
        status: newStatus,
        message: `Sipariş durumu ${newStatus} olarak güncellendi.`,
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/live-orders");
    return { success: true, data: order };
  } catch (error) {
    logger.error({ error, orderId, newStatus }, "updateOrderStatus error");
    return { success: false, error: "Sipariş durumu güncellenemedi." };
  }
}

export async function getLiveOrders() {
  try {
    return await prisma.order.findMany({
      where: {
        status: {
          notIn: ["TAMAMLANDI", "IPTAL"] as any
        } as any
      },
      include: {
        items: {
          include: { product: true }
        },
        logs: {
          orderBy: { createdAt: "desc" }
        }
      } as any,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    logger.error({ error }, "getLiveOrders error");
    return [];
  }
}
