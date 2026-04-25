"use server";

import { prisma } from "@/lib/prisma";

// Hisse için ödeme kaydı oluştur (müşteri rezervasyon sonrası)
export async function createSharePayment(
  shareId: string,
  data: {
    amount: number;
    method: "NAKIT" | "HAVALE" | "KART";
    receiptUrl?: string;
    notes?: string;
    address?: {
      city: string;
      district: string;
      street: string;
      fullName: string;
      phone: string;
    };
  }
) {
  try {
    // Hisse var mı ve REZERVE durumda mı?
    const share = await prisma.share.findUnique({ where: { id: shareId } });
    if (!share) return { success: false, error: "Hisse bulunamadı." };
    if (share.status !== "REZERVE") {
      return { success: false, error: "Ödeme sadece rezerve hisseler için oluşturulabilir." };
    }

    // Zaten bekleyen ödeme var mı?
    const existing = await prisma.sharePayment.findUnique({ where: { shareId } });
    if (existing) return { success: false, error: "Bu hisse için zaten bir ödeme kaydı mevcut." };

    // Eğer adres bilgisi varsa adres oluştur ve share'e bağla
    let addressId = null;
    if (data.address) {
      const addr = await prisma.address.create({
        data: {
          city: data.address.city,
          district: data.address.district,
          street: data.address.street,
          fullName: data.address.fullName,
          phone: data.address.phone,
          label: "Teslimat Adresi",
        },
      });
      addressId = addr.id;
      
      // Share'i de güncelleyelim
      await prisma.share.update({
        where: { id: shareId },
        data: { addressId },
      });
    }

    const payment = await prisma.sharePayment.create({
      data: {
        shareId,
        amount: data.amount,
        method: data.method,
        status: "BEKLEMEDE",
        receiptUrl: data.receiptUrl ?? null,
        notes: data.notes ?? null,
      },
    });

    return { success: true, data: payment };
  } catch (error) {
    console.error("createSharePayment error:", error);
    return { success: false, error: "Ödeme kaydı oluşturulamadı." };
  }
}

// Admin: Ödemeyi onayla → Share SATILDI olur
export async function confirmSharePayment(paymentId: string) {
  try {
    const payment = await prisma.sharePayment.findUnique({
      where: { id: paymentId },
      include: { share: true },
    });
    if (!payment) return { success: false, error: "Ödeme kaydı bulunamadı." };
    if (payment.status === "ONAYLANDI") {
      return { success: false, error: "Bu ödeme zaten onaylanmış." };
    }

    // Transaction: ödemeyi onayla + hisseyi SATILDI yap
    const [updatedPayment] = await prisma.$transaction([
      prisma.sharePayment.update({
        where: { id: paymentId },
        data: { status: "ONAYLANDI", paidAt: new Date() },
      }),
      prisma.share.update({
        where: { id: payment.shareId },
        data: { status: "SATILDI" },
      }),
    ]);

    return { success: true, data: updatedPayment };
  } catch (error) {
    console.error("confirmSharePayment error:", error);
    return { success: false, error: "Ödeme onaylanamadı." };
  }
}

// Admin: Ödemeyi iade et → Share MUSAIT olur
export async function refundSharePayment(paymentId: string) {
  try {
    const payment = await prisma.sharePayment.findUnique({ where: { id: paymentId } });
    if (!payment) return { success: false, error: "Ödeme kaydı bulunamadı." };

    await prisma.$transaction([
      prisma.sharePayment.update({
        where: { id: paymentId },
        data: { status: "IADE" },
      }),
      prisma.share.update({
        where: { id: payment.shareId },
        data: {
          status: "MUSAIT",
          customerName: null,
          customerPhone: null,
          customerEmail: null,
          userId: null,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("refundSharePayment error:", error);
    return { success: false, error: "İade işlemi başarısız." };
  }
}

// Dekont URL güncelle (müşteri dekont yüklediğinde)
export async function uploadReceipt(paymentId: string, receiptUrl: string) {
  try {
    const payment = await prisma.sharePayment.update({
      where: { id: paymentId },
      data: { receiptUrl },
    });
    return { success: true, data: payment };
  } catch (error) {
    console.error("uploadReceipt error:", error);
    return { success: false, error: "Dekont güncellenemedi." };
  }
}
