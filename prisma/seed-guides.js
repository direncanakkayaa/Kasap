/**
 * MASTER ET REHBERİ & IRK SENKRONİZASYON SEED SCRIPT (FULL VERSION)
 * 23+ Premium Ürün & Lokasyon Bazlı Irk Eşleştirmesi
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const GUIDES = [
  // ═══════════════ BÜYÜKBAŞ (DANA) ═══════════════
  {
    slug: "dana-antrikot",
    title: "Dana Antrikot",
    animalType: "BUYUKBAS",
    shortDesc: "Mermerimsi yağ dokusuna sahip en lezzetli steak eti.",
    content: "Antrikot, dananın sırt kısmından çıkarılır. Ortasındaki yağ dokusu (mermerleşme) sayesinde piştiğinde kendi yağıyla lezzetlenir.",
    usageTips: "Izgara, döküm tava ve mangal için idealdir.",
    chefTip: "Antrikotun içindeki mermer yağların erimesi için oda sıcaklığına getirmeyi unutmayın.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    coverUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=1600",
    relatedSlugs: ["dana-bonfile", "dana-tbone", "dana-kontrfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Mükemmel mermerleşme ile tereyağımsı lezzet.", bestCooking: ["Izgara", "Dry-Age"], avoid: "Haşlama" },
      simental: { rating: 3, why: "Daha yağsız, sıkı tekstürlü.", bestCooking: ["Tava"], avoid: "Uzun Izgara" },
      limuzin: { rating: 4, why: "Yoğun ve temiz et lezzeti.", bestCooking: ["Izgara"], avoid: "Yüksek Ateş" }
    }
  },
  {
    slug: "dana-bonfile",
    title: "Dana Bonfile",
    animalType: "BUYUKBAS",
    shortDesc: "En yağsız ve en yumuşak, premium sinirsiz lop et.",
    content: "Bonfile, hayvanın sırt boşluğunda bulunur ve hiç hareket etmeyen bir kas grubudur. Pamuk gibi dokusuyla premium bir deneyim sunar.",
    usageTips: "Madalyon olarak mühürlenir. Kurumaya meyilli olduğundan orta-az pişirilmelidir.",
    chefTip: "Pişirdikten sonra 5 dakika dinlendirmek liflerin suyu geri emmesini sağlar.",
    imageUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-kontrfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Yumuşaklığı tereyağımsı dokuyla birleştirir.", bestCooking: ["Pan-Sear"], avoid: "Haşlama" },
      limuzin: { rating: 5, why: "İri ve sinirsiz kas yapısı en yüksek verimi verir.", bestCooking: ["Chateaubriand"], avoid: "Kıyma" }
    }
  },
  {
    slug: "dana-tbone",
    title: "Dana T-Bone",
    animalType: "BUYUKBAS",
    shortDesc: "T şeklindeki kemiğin iki yanında antrikot ve bonfile.",
    content: "Kemiğin pişirme sırasında ete verdiği mineralimsi aroma bu kesimi özel kılar.",
    usageTips: "Mangal veya ızgara için idealdir.",
    chefTip: "Bonfile tarafını ateşten biraz uzak tutun çünkü daha çabuk pişer.",
    imageUrl: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-kontrfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Hem antrikot hem bonfile tarafı zengin mermerleşme sunar.", bestCooking: ["Mangal"], avoid: "İnce Kesim" },
      limuzin: { rating: 4, why: "Etkileyici porsiyon boyutu ve temiz lezzet.", bestCooking: ["Izgara"], avoid: "Sulu Yemek" }
    }
  },
  {
    slug: "dana-tomahawk",
    title: "Tomahawk Steak",
    animalType: "BUYUKBAS",
    shortDesc: "Uzun kaburga kemiğiyle sunulan gösterişli steak.",
    content: "Kemiği temizlenmiş (French trim) uzun kaburga kemiğine bırakılmış kalın bir antrikot bifteğidir.",
    usageTips: "Reverse sear tekniği (Fırın + Tavada mühürleme) önerilir.",
    chefTip: "Kemiğin kenarı daha sulu kalır, servis ederken bu kısımları paylaşın.",
    imageUrl: "https://images.unsplash.com/photo-1628169282299-8255b46e80b2?w=800",
    coverUrl: "https://images.unsplash.com/photo-1628169282299-8255b46e80b2?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-wagyu"],
    breedRecommendations: {
      angus: { rating: 5, why: "Mermerleşme kemik ilik tadıyla harika bütünleşir.", bestCooking: ["Mangal"], avoid: "Haşlama" },
      limuzin: { rating: 4, why: "Devasa kas boyutu gerçek bir Tomahawk deneyimi yaşatır.", bestCooking: ["BBQ"], avoid: "Tava" }
    }
  },
  {
    slug: "dana-picanha",
    title: "Dana Picanha",
    animalType: "BUYUKBAS",
    shortDesc: "Brezilya barbekü kültürünün yıldızı, yağ şapkalı parça.",
    content: "Sokum bölgesinden çıkar. Üstündeki kalın yağ tabakası pişerken ete enfes bir lezzet verir.",
    usageTips: "Şişe dizilerek mangalda pişirilmesi (Churrasco) meşhurdur.",
    chefTip: "Yağ katmanına baklava deseni çizerek tuzun ete nüfuz etmesini sağlayın.",
    imageUrl: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=800",
    coverUrl: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=1600",
    relatedSlugs: ["dana-kontrfile", "dana-antrikot"],
    breedRecommendations: {
      angus: { rating: 5, why: "Kalın yağ tabakası ve kas içi mermerleşme uyumu.", bestCooking: ["Mangal"], avoid: "Haşlama" },
      limuzin: { rating: 4, why: "İri kas yapısıyla doyurucu dilimler verir.", bestCooking: ["Izgara"], avoid: "Tava" }
    }
  },
  {
    slug: "dana-kontrfile",
    title: "Dana Kontrfile",
    animalType: "BUYUKBAS",
    shortDesc: "Bonfile ile antrikotun arası, dengeli lezzet.",
    content: "Sırt bölgesinde yer alır. Kenarındaki yağ şeridi pişirildiğinde gevrek bir kabuk oluşturur.",
    usageTips: "New York Strip steak olarak pişirilir.",
    chefTip: "Kenar yağını kesmeyin, o lezzetin ana kaynağıdır.",
    imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800",
    coverUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-bonfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Hafif mermerleşme ile klasik steakhouse kalitesi.", bestCooking: ["Steak"], avoid: "Sulu Yemek" },
      simental: { rating: 4, why: "Temiz ve az yağlı et sevenler için ideal.", bestCooking: ["Izgara"], avoid: "Tava" }
    }
  },
  {
    slug: "dana-kiyma",
    title: "Dana Kıyma",
    animalType: "BUYUKBAS",
    shortDesc: "Her türlü yemek için ideal temel malzeme.",
    content: "Gerçek kıyma, farklı bölgelerin dengeli karışımıyla elde edilir.",
    usageTips: "Köfte, lahmacun ve yemekler için farklı yağ oranları.",
    chefTip: "Kasabınızdan ihtiyacınıza göre yağ oranını belirtmesini isteyin.",
    imageUrl: "https://images.unsplash.com/photo-1529042410-1a90a4e0c2c1?w=800",
    coverUrl: "https://images.unsplash.com/photo-1529042410-1a90a4e0c2c1?w=1600",
    relatedSlugs: ["dana-kusbasi", "kuzu-kiyma"],
    breedRecommendations: {
      yerlikara: { rating: 5, why: "Doğal aroması kıymada fark yaratır.", bestCooking: ["Geleneksel Köfte"], avoid: "Zayıf Mühürleme" },
      simental: { rating: 4, why: "Düşük yağ oranıyla pidesi hafif olur.", bestCooking: ["Pide"], avoid: "Zayıf Mühürleme" }
    }
  },
  {
    slug: "dana-kusbasi",
    title: "Dana Kuşbaşı",
    animalType: "BUYUKBAS",
    shortDesc: "Sulu yemekler ve kavurmanın vazgeçilmezi.",
    content: "But ve kol bölgelerinden hazırlanır.",
    usageTips: "Kavurma, güveç ve tencere yemekleri.",
    chefTip: "Kısık ateşte kendi suyunda pişirmek yumuşaklık sırrıdır.",
    imageUrl: "https://images.unsplash.com/photo-1607116667981-ff71c3841d8a?w=800",
    coverUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600",
    relatedSlugs: ["dana-kiyma", "dana-kaburga"],
    breedRecommendations: {
      yerlikara: { rating: 5, why: "Geleneksel kavurma lezzeti için 1 numara.", bestCooking: ["Kavurma"], avoid: "Hızlı Pişirme" },
      limuzin: { rating: 4, why: "Doyurucu ve iri parçalar verir.", bestCooking: ["Güveç"], avoid: "Hızlı Pişirme" }
    }
  },

  // ═══════════════ KÜÇÜKBAŞ (KUZU) ═══════════════
  {
    slug: "kuzu-pirzola",
    title: "Kuzu Pirzola",
    animalType: "KUCUKBAS",
    shortDesc: "Zarif, narin ve en prestijli kuzu eti.",
    content: "Kuzunun kaburga bölgesinden tek tek ayrılır.",
    usageTips: "Mangal ve hızlı ızgara için mükemmeldir.",
    chefTip: "Tuzlu suda bekletilmiş biberiye dalıyla mühürleyin.",
    imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544215814-c0ad846feefc?w=1600",
    relatedSlugs: ["kuzu-incik", "kuzu-but"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "Kokusuz, sütlü ve ipeksi doku.", bestCooking: ["Izgara"], avoid: "Haşlama" },
      merinos: { rating: 4, why: "Daha etli ve dolgun pirzola gözü.", bestCooking: ["Döküm Tava"], avoid: "Haşlama" },
      karaman: { rating: 3, why: "Kuyruk yağı aroması sevenler için ideal.", bestCooking: ["Mangal"], avoid: "Tava" }
    }
  },
  {
    slug: "kuzu-incik",
    title: "Kuzu İncik",
    animalType: "KUCUKBAS",
    shortDesc: "Tandır ve haşlamaların ağızda dağılan lezzeti.",
    content: "Bacak bölgesinden çıkar, yoğun kollajen içerir.",
    usageTips: "Düşük ısıda uzun süre (3-4 saat) pişirme.",
    chefTip: "Fırın poşetinde kendi buharıyla pişirmek lezzeti hapseder.",
    imageUrl: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544215814-c0ad846feefc?w=1600",
    relatedSlugs: ["kuzu-pirzola", "kuzu-gerdan"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "En nazik bağ dokusu Kıvırcık'tadır.", bestCooking: ["Tandır"], avoid: "Izgara" },
      karaman: { rating: 4, why: "Aroması güveç sularına derinlik katar.", bestCooking: ["Güveç"], avoid: "Izgara" }
    }
  },
  {
    slug: "kuzu-uykuluk",
    title: "Kuzu Uykuluk",
    animalType: "KUCUKBAS",
    shortDesc: "Süt kuzusunun çok değerli kremsi sakatatı.",
    content: "Üst düzey gastronominin vazgeçilmezi olan, lifsiz ve sütümsü bir yapıdadır.",
    usageTips: "Zarı soyulmalı, tereyağında sote edilmelidir.",
    chefTip: "Önce sirkeli suda haşlayıp sonra mühürlemeyi deneyin.",
    imageUrl: "https://images.unsplash.com/photo-1603504101977-94a0d922ba14?q=80&w=800",
    coverUrl: "https://images.unsplash.com/photo-1603504101977-94a0d922ba14?q=80&w=2000",
    relatedSlugs: ["kuzu-incik", "dana-dil"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "Saf süt proteini tadı sadece Kıvırcık'ta.", bestCooking: ["Tava"], avoid: "Izgara" }
    }
  },
  {
    slug: "kuzu-gerdan",
    title: "Kuzu Gerdan",
    animalType: "KUCUKBAS",
    shortDesc: "Boynun en lezzetli, yağlı ve yumuşak kısmı.",
    content: "Uzun haşlamalarda parçalanarak eşsiz bir doku verir.",
    usageTips: "Haşlama, çorba ve sebzeli güveç.",
    chefTip: "Haşlama suyuna limon ve yumurta sarısı ile meyaneli sos (terbiye) yapın.",
    imageUrl: "https://images.unsplash.com/photo-1607116667981-ff71c3841d8a?w=800",
    coverUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=1600",
    relatedSlugs: ["kuzu-incik", "kuzu-but"],
    breedRecommendations: {
      karaman: { rating: 5, why: "Geleneksel gerdan çorbası için vazgeçilmez.", bestCooking: ["Haşlama"], avoid: "Izgara" },
      kivircik: { rating: 4, why: "Hafif ve lezzetli kuzu haşlama isteyenler için.", bestCooking: ["Güveç"], avoid: "Izgara" }
    }
  },
  {
    slug: "dana-dil",
    title: "Dana Dil",
    animalType: "BUYUKBAS",
    shortDesc: "Söğüş ve meze sofralarının en yumuşak sakatatı.",
    content: "Haşlandığında pamuksu bir dokuya bürünen, lif yapısı ince ve lezzetli bir parçadır.",
    usageTips: "Önce bol suda haşlanmalı, ardından dış zarı soyulmalıdır.",
    chefTip: "Haşlama suyuna defne yaprağı ve tane karabiber eklemek rayihasını artırır.",
    imageUrl: "/generated/dana_dil.png",
    coverUrl: "https://images.unsplash.com/photo-1603504101977-94a0d922ba14?w=1600",
    relatedSlugs: ["dana-gerdan", "kuzu-uykuluk"],
    breedRecommendations: {
      angus: { rating: 5, why: "Yağ oranı ve et yumuşaklığı dengelidir.", bestCooking: ["Söğüş"], avoid: "Izgara" }
    }
  },
  {
    slug: "dana-gerdan",
    title: "Dana Gerdan",
    animalType: "BUYUKBAS",
    shortDesc: "Haşlama ve fırın yemekleri için ideal, lifli yapı.",
    content: "Hayvanın boyun kısmıdır. Hareketli bir bölge olduğu için lifli ve çok lezzetlidir.",
    usageTips: "Güveç, haşlama ve uzun süreli fırın pişirmeleri.",
    chefTip: "Kemikli olması yemeğin suyuna ekstra jelatin ve lezzet katar.",
    imageUrl: "/generated/dana_gerdan.png",
    coverUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=1600",
    relatedSlugs: ["dana-incik", "dana-kusbasi"],
    breedRecommendations: {
      yerlikara: { rating: 5, why: "Geleneksel Anadolu haşlaması için en yoğun aromayı verir.", bestCooking: ["Haşlama"], avoid: "Kısa Izgara" }
    }
  },
  {
    slug: "dana-incik",
    title: "Dana İncik",
    animalType: "BUYUKBAS",
    shortDesc: "Kollajen deposu, tandır lezzetinde but eti.",
    content: "Bacak kısmından çıkar. İçindeki sinir dokusu piştikçe jölemsi bir kıvam alarak eti yumuşatır.",
    usageTips: "Osso Buco tarzı veya klasik Türk tandırı.",
    chefTip: "Unlanarak tereyağında mühürlendikten sonra fırınlanması önerilir.",
    imageUrl: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=800",
    coverUrl: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=1600",
    relatedSlugs: ["dana-gerdan", "dana-kusbasi"],
    breedRecommendations: {
      limuzin: { rating: 5, why: "İri ve dolgun kas yapısıyla en iyi tandırlık parçaları verir.", bestCooking: ["Tandır"], avoid: "Tava" }
    }
  },
  {
    slug: "dana-dosh",
    title: "Dana Döş",
    animalType: "BUYUKBAS",
    shortDesc: "Yağ dengesi en yüksek, en lezzetli hamburger ve köfte eti.",
    content: "Dananın göğüs ve karın altı bölgesidir. Yağ ve etin birbiriyle en iyi kaynaştığı bölümdür.",
    usageTips: "Premium hamburger köftesi ve tencere yemekleri.",
    chefTip: "Zırh kıyması yapılarak kebaplarda kullanıldığında eşsiz sonuç verir.",
    imageUrl: "/generated/dana_dosh.png",
    coverUrl: "https://images.unsplash.com/photo-1529042410-1a90a4e0c2c1?w=1600",
    relatedSlugs: ["dana-kiyma", "dana-antrikot"],
    breedRecommendations: {
      angus: { rating: 5, why: "Kas arası yağı (marbling) köftede nemliliği korur.", bestCooking: ["Burger"], avoid: "Tava" }
    }
  },
  {
    slug: "kuzu-kol",
    title: "Kuzu Kol",
    animalType: "KUCUKBAS",
    shortDesc: "Fırında kuzu tandırın vazgeçilmez adresi.",
    content: "Kuzunun ön bacak bölgesidir. Buta göre daha yağlı ve daha aromatik bir yapıdadır.",
    usageTips: "Bütün olarak fırın sebzeleriyle uzun süre pişirilmelidir.",
    chefTip: "Sarımsak ve taze kekikle marine edilerek ağır ateşte pişiriniz.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
    relatedSlugs: ["kuzu-but", "kuzu-incik"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "Trakya Kıvırcığı'nın kolu en az koku ve en yüksek yumuşaklığı sunar.", bestCooking: ["Fırın"], avoid: "Tava" }
    }
  },
  {
    slug: "kuzu-but",
    title: "Kuzu But",
    animalType: "KUCUKBAS",
    shortDesc: "Doyurucu, az yağlı ve iri porsiyonlu kuzu parçası.",
    content: "Kuzunun arka bacak bölgesidir. En etli ve porsiyon verimi en yüksek kısımdır.",
    usageTips: "Külbastı, şiş kebap veya bütün fırın.",
    chefTip: "Külbastı yaparken çok ince değil, 1 parmak kalınlığında kestirin.",
    imageUrl: "https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?w=800",
    coverUrl: "https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?w=1600",
    relatedSlugs: ["kuzu-kol", "kuzu-pirzola"],
    breedRecommendations: {
      merinos: { rating: 5, why: "Melez Merinoslar büyük ve etli but yapısıyla doyurucudur.", bestCooking: ["Külbastı"], avoid: "Haşlama" }
    }
  }
];

async function main() {
  console.log("🥩 MASTER ET REHBERİ & IRK SENKRONİZASYONU BAŞLADI...");
  
  await prisma.meatGuide.deleteMany();
  console.log("Mevcut rehber verileri temizlendi.");

  for (const guide of GUIDES) {
    await prisma.meatGuide.create({ data: guide });
    console.log(`  ✓ Senkronize edildi: ${guide.title}`);
  }

  const finalCount = await prisma.meatGuide.count();
  console.log(`\n🎉 Toplam ${finalCount} ürün için ırk bazlı tavsiyeler veritabanına işlendi.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
