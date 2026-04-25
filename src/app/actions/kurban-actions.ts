"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addSmsJob } from "@/lib/queue";

export async function getKurbanRooms() {
  try {
    const animals = await prisma.animal.findMany({
      where: { status: "BEKLEMEDE" },
      include: { shares: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: animals };
  } catch (error) {
    console.error("Failed to fetch Kurban rooms:", error);
    return { success: false, error: "Odalar yüklenemedi." };
  }
}

export async function getKurbanRoom(animalId: string) {
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: {
        shares: {
          orderBy: { shareNumber: "asc" },
          include: { payment: true },
        },
      },
    });
    if (!animal) return { success: false, error: "Oda bulunamadı." };
    return { success: true, data: animal };
  } catch (error) {
    console.error("Failed to fetch Kurban room:", error);
    return { success: false, error: "Oda yüklenemedi." };
  }
}

// Hisse rezervasyon — sadece REZERVE yapar, ödeme sonrası SATILDI olur
export async function joinShare(shareId: string, formData: FormData) {
  try {
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;

    if (!customerName || !customerPhone) {
      return { success: false, error: "İsim ve telefon zorunludur." };
    }

    // Atomik güncelleme — sadece hâlâ MUSAIT ise güncelle
    const updateResult = await prisma.share.updateMany({
      where: { id: shareId, status: "MUSAIT" },
      data: {
        customerName,
        customerPhone,
        status: "REZERVE",
        updatedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      return {
        success: false,
        error:
          "Bu hisse saniyeler önce başka bir kullanıcı tarafından rezerve edildi. Lütfen sayfayı yenileyip müsait olan başka bir hisse seçiniz.",
      };
    }

    const updatedShare = await prisma.share.findUnique({ 
      where: { id: shareId },
      include: { animal: true } 
    });

    if (updatedShare) {
      // Send SMS Confirmation
      try {
        await addSmsJob("KURBAN_JOIN", updatedShare.customerPhone!, {
          customerName: updatedShare.customerName,
          animalTag: updatedShare.animal.breed
        });
      } catch (smsError) {
        console.error("Failed to queue Kurban SMS:", smsError);
      }
      
      revalidatePath(`/kurban-havuzu/${updatedShare.animalId}`);
    }

    return { success: true, data: updatedShare };
  } catch (error) {
    console.error("Failed to join share:", error);
    return { success: false, error: "Hisseler güncellenemedi." };
  }
}

export async function updateAnimalStatus(animalId: string, newStatus: "BEKLEMEDE" | "KESILDI" | "PARCALANDI") {
  try {
    const animal = await prisma.animal.update({
      where: { id: animalId },
      data: { status: newStatus },
      include: {
        shares: {
          where: { status: "SATILDI" }
        }
      }
    });

    // If status is PARCALANDI (Distribution Ready), notify all shareholders
    if (newStatus === "PARCALANDI") {
      for (const share of animal.shares) {
        if (share.customerPhone) {
          try {
            await addSmsJob("KURBAN_DISTRIBUTION", share.customerPhone, {
              customerName: share.customerName,
              animalTag: animal.breed
            });
          } catch (smsError) {
            console.error(`Failed to queue distribution SMS for ${share.customerPhone}:`, smsError);
          }
        }
      }
    }

    revalidatePath(`/admin/kurban/${animalId}`);
    revalidatePath(`/kurban-havuzu/${animalId}`);
    
    return { success: true, data: animal };
  } catch (error) {
    console.error("Failed to update animal status:", error);
    return { success: false, error: "Durum güncellenemedi." };
  }
}
