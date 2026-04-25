import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Et Rehberi Verilerini Ekle
    const guidesCount = await prisma.meatGuide.count();
    if (guidesCount === 0) {
      await prisma.meatGuide.createMany({
        data: [
          {
            title: "Dana Antrikot",
            slug: "dana-antrikot",
            content: "Sırt kısmından elde edilen, mermerleşme oranı yüksek premium et.",
            animalType: "DANA",
            fatLevel: "YUKSEK",
            cookingMethods: ["Izgara", "Döküm Tava"],
            imageUrl: "/generated/angus.png",
          },
          {
            title: "Kuzu Pirzola",
            slug: "kuzu-pirzola",
            content: "Kuzunun sırtından elde edilen en narin parçalardan biri.",
            animalType: "KUZU",
            fatLevel: "ORTA",
            cookingMethods: ["Izgara", "Mangal"],
            imageUrl: "/generated/kivircik.png",
          }
        ]
      });
    }

    // 2. Ürünleri Ekle
    const productsCount = await prisma.product.count();
    if (productsCount === 0) {
      await prisma.product.createMany({
        data: [
          {
            name: "Premium Dana Antrikot",
            description: "Angus ve Simental ırklarından seçilmiş.",
            price: 650,
            category: "kirmizi-et",
            imageUrl: "/generated/angus.png",
            cookingTips: ["Döküm tavada mühürleyin"],
            isCookable: true,
            cookingPrice: 85,
            meatGuideSlug: "dana-antrikot",
            unit: "KG"
          },
          {
            name: "Kuzu Pirzola (Trakya Kıvırcık)",
            description: "Kokusuz, süt kuzusu narinliğinde pirzola.",
            price: 780,
            category: "kirmizi-et",
            imageUrl: "/generated/kivircik.png",
            cookingTips: ["Mangal ateşinde hızlı pişirim"],
            isCookable: true,
            cookingPrice: 65,
            meatGuideSlug: "kuzu-pirzola",
            unit: "KG"
          }
        ]
      });
    }

    return NextResponse.json({ message: "Veritabanı başarıyla dolduruldu! (Seeded)" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
