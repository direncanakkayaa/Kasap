import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const maskedUrl = dbUrl.replace(/:.*@/, ":****@");
  console.log("[Setup Debug] Connecting to:", maskedUrl);
  
  try {
    // 1. Et Rehberi Verilerini Ekle
    const guidesCount = await prisma.meatGuide.count();
    if (guidesCount === 0) {
      await prisma.meatGuide.createMany({
        data: [
          {
            title: "Dana Antrikot",
            slug: "dana-antrikot",
            animalType: "BUYUKBAS",
            shortDesc: "Sırt kısmından elde edilen, mermerleşme oranı yüksek premium et.",
            content: "Antrikot, dananın sırt kısmından elde edilen ve içindeki yağ damarları (mermerleşme) sayesinde çok lezzetli olan bir bölümdür.",
            usageTips: "Izgara veya döküm tavada mühürleyerek pişirilmesi önerilir.",
            chefTip: "Pişirmeden önce oda sıcaklığında 30 dakika bekletin ve sadece deniz tuzu kullanın.",
            imageUrl: "/generated/angus.png",
          },
          {
            title: "Kuzu Pirzola",
            slug: "kuzu-pirzola",
            animalType: "KUCUKBAS",
            shortDesc: "Kuzunun sırtından elde edilen en narin parçalardan biri.",
            content: "Kuzu pirzola, hayvanın sırt kısmındaki kaburgalarından elde edilir. Süt kuzusu tercih edildiğinde kokusuz ve lokum kıvamında olur.",
            usageTips: "Mangalda veya döküm tavada yüksek ateşte hızlıca pişirilmelidir.",
            chefTip: "Taze kekik ve zeytinyağı ile marine ederseniz aroması zirveye çıkar.",
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
