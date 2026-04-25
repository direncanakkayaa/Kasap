const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PRODUCTS = [
  // 🥩 KIRMIZI ET (REHBERLE İLİŞKİLİ)
  {
    name: "Premium Dana Antrikot",
    description: "Angus ve Simental ırklarından seçilmiş, mermerleşme oranı yüksek antrikot.",
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
    cookingTips: ["Tereyağı ile banyo yaptırın", "Hızlı mühürleme"],
    isCookable: true,
    cookingPrice: 95,
    meatGuideSlug: "dana-bonfile",
    unit: "KG"
  },
  {
    name: "Dana Kuşbaşı (Gerdan/But Mişi)",
    description: "Sulu yemekler ve güveçler için ideal yağsız kuşbaşı.",
    price: 420,
    category: "kirmizi-et",
    imageUrl: "/generated/yerlikara.png",
    cookingTips: ["Kısık ateşte kendi suyunda"],
    isCookable: false,
    meatGuideSlug: "dana-gerdan",
    unit: "KG"
  },
  {
    name: "Dana Kıyma (%20 Yağlı)",
    description: "Köfte ve yemekler için ideal yağ dengesi.",
    price: 380,
    category: "kirmizi-et",
    imageUrl: "/generated/yerlikara.png",
    cookingTips: ["Fazla kurutmadan pişirin"],
    isCookable: false,
    meatGuideSlug: "dana-dosh",
    unit: "KG"
  },
  // 🍖 KUZU ETİ
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
  },
  // 🌭 ŞARKÜTERİ
  {
    name: "Ev Yapımı Kasap Sucuğu",
    description: "Doğal bağırsakta, 0 katkı maddeli, özel baharatlı sucuk.",
    price: 550,
    category: "sarkuteri",
    imageUrl: "/generated/story_modern.png",
    cookingTips: ["Kendi yağında kısık ateşte"],
    isCookable: false,
    unit: "KG"
  },
  {
    name: "Antrikot Pastırma",
    description: "Çemenli, geleneksel yöntemlerle kurutulmuş antrikot pastırma.",
    price: 1200,
    category: "sarkuteri",
    imageUrl: "/generated/story_quality.png",
    cookingTips: ["Çiğ tüketim önerilir"],
    isCookable: false,
    unit: "KG"
  },
  // 🍔 KÖFTELER
  {
    name: "Özel Kasap Köftesi",
    description: "Anne eli değmiş gibi, ızgaralık özel harçlı köfte.",
    price: 450,
    category: "kofteler",
    imageUrl: "/generated/story_modern.png",
    cookingTips: ["Izgara veya tavada"],
    isCookable: true,
    cookingPrice: 40,
    unit: "KG"
  }
];

const ADDITIONS = [
  {
    name: "Trüflü Mayonez",
    description: "Etlerinizin yanına gurme bir dokunuş.",
    price: 65,
    category: "sos",
    imageUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"
  },
  {
    name: "Közlenmiş Patates Püresi",
    description: "Tereyağlı ve sütlü, pürüzsüz kıvam.",
    price: 85,
    category: "garnitur",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"
  },
  {
    name: "Acılı Kasap Sosu",
    description: "Kendi yapımımız taze acı sos.",
    price: 45,
    category: "sos",
    imageUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"
  }
];

async function main() {
  console.log("🛍 ÜRÜN VE YAN ÜRÜN SENKRONİZASYONU BAŞLADI...");
  
  await prisma.product.deleteMany();
  await prisma.addition.deleteMany();
  console.log("Mevcut ürün verileri temizlendi.");

  for (const product of PRODUCTS) {
    await prisma.product.create({ data: product });
    console.log(`  ✓ Ürün eklendi: ${product.name}`);
  }

  for (const addition of ADDITIONS) {
    await prisma.addition.create({ data: addition });
    console.log(`  ✓ Yan ürün eklendi: ${addition.name}`);
  }

  console.log("\n🎉 Tüm ürünler başarıyla veritabanına işlendi.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
