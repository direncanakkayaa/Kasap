import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const maskedUrl = dbUrl.replace(/:.*@/, ":****@");
  console.log("[Setup Debug] Connecting to:", maskedUrl);

  try {
    // 0. Admin Kullanıcısı Ekle
    const adminPhone = "05555555555";
    const existingAdmin = await prisma.user.findUnique({
      where: { phone: adminPhone }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          name: "Erdoğan Usta",
          email: "admin@erdogankasap.com",
          phone: adminPhone,
          passwordHash: hashedPassword,
          role: "ADMIN"
        }
      });
      console.log("✓ Admin kullanıcısı oluşturuldu: 05555555555 / admin123");
    }

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
          // 🥩 KIRMIZI ET
          {
            name: "Premium Dana Antrikot",
            description: "Angus ve Simental ırklarından seçilmiş, mermerleşme oranı yüksek.",
            price: 650,
            category: "kirmizi-et",
            imageUrl: "/generated/angus.png",
            cookingTips: ["Döküm tavada mühürleyin", "Orta pişmiş önerilir"],
            isCookable: true,
            cookingPrice: 85,
            meatGuideSlug: "dana-antrikot",
            unit: "KG"
          },
          {
            name: "Dana Bonfile (Lop Et)",
            description: "Sıfır yağ, sıfır sinir. Pamuk gibi yumuşak doku.",
            price: 850,
            category: "kirmizi-et",
            imageUrl: "/generated/limuzin.png",
            cookingTips: ["Tereyağı ile banyo yaptırın"],
            isCookable: true,
            cookingPrice: 95,
            meatGuideSlug: "dana-bonfile",
            unit: "KG"
          },
          {
            name: "Dana Kıyma (%20 Yağlı)",
            description: "Yemeklik ve köftelik ideal yağ dengesi.",
            price: 380,
            category: "kirmizi-et",
            imageUrl: "/generated/yerlikara.png",
            unit: "KG"
          },
          {
            name: "Kuzu Pirzola (Trakya Kıvırcık)",
            description: "Kokusuz, süt kuzusu narinliğinde pirzola.",
            price: 780,
            category: "kirmizi-et",
            imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800",
            cookingTips: ["Mangal ateşinde hızlı pişirim"],
            isCookable: true,
            cookingPrice: 65,
            meatGuideSlug: "kuzu-pirzola",
            unit: "KG"
          },
          {
            name: "Kuzu İncik (Fırınlık)",
            description: "Uzun pişirimler için ideal, kemiğinden ayrılan eşsiz lezzet.",
            price: 520,
            category: "kirmizi-et",
            imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
            unit: "KG"
          },
          {
            name: "Dana Rosto (Nuarlı)",
            description: "Yağsız, sinirsiz, dilimlemeye uygun fırınlık et.",
            price: 490,
            category: "kirmizi-et",
            imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800",
            unit: "KG"
          },
          {
            name: "Dana Yaprak Ciğer",
            description: "Günlük taze, zarından ayıklanmış, yaprak kesim.",
            price: 350,
            category: "sarkuteri",
            imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6e9460272?w=800",
            unit: "KG"
          },
          {
            name: "Dana Antrikot Pastırma",
            description: "Çemenli, geleneksel yöntemlerle kurutulmuş, el kesimi.",
            price: 1350,
            category: "sarkuteri",
            imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800",
            unit: "KG"
          },
          {
            name: "Özel Kasap Köftesi",
            description: "Anne eli değmiş gibi, ızgaralık özel harçlı köfte.",
            price: 450,
            category: "kofteler",
            imageUrl: "https://images.unsplash.com/photo-1534127395081-e862e3d02711?w=800",
            isCookable: true,
            cookingPrice: 40,
            unit: "KG"
          },
          {
            name: "Gurme Burger Köftesi (200gr)",
            description: "%100 Dana eti, özel yağ dengesiyle sulu burger deneyimi.",
            price: 120,
            category: "kofteler",
            imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
            isCookable: true,
            cookingPrice: 35,
            unit: "ADET"
          },
          {
            name: "Satır Köfte",
            description: "Eti zırh ile çekilmiş, gerçek lezzet.",
            price: 480,
            category: "kofteler",
            imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6e9460272?w=800",
            isCookable: true,
            cookingPrice: 45,
            unit: "KG"
          }
        ]
      });
    }

    // 3. Yan Ürünler/Soslar Ekle
    const additionsCount = await prisma.addition.count();
    if (additionsCount === 0) {
      await prisma.addition.createMany({
        data: [
          {
            name: "Trüflü Mayonez",
            description: "Etlerinizin yanına gurme bir dokunuş.",
            price: 65,
            category: "sos",
            imageUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"
          },
          {
            name: "Acılı Kasap Sosu",
            description: "Kendi yapımımız taze acı sos.",
            price: 45,
            category: "sos",
            imageUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"
          }
        ]
      });
    }

    return NextResponse.json({ message: "Veritabanı zenginleştirilmiş ürünlerle başarıyla dolduruldu! (Seeded)" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
