export {};
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const guides = [
  {
    slug: "dana-antrikot",
    title: "Dana Antrikot",
    animalType: "BUYUKBAS",
    shortDesc: "Sırtın üst kısmından çıkan, yoğun mermerleşmesiyle ızgara ve steaklerin kralı.",
    content: `Antrikot, sığırın sırt bölgesinin üst kısmından (Longissimus dorsi) elde edilir. Kas içi yağ dağılımı (mermerleşme) en yoğun olan kesimlerden biridir.\n\nBu yağ dokusu pişirme sırasında eriyerek etin içinde kalır ve eşsiz bir yumuşaklık ile lezzet sağlar. Kalın kesim antrikotlar özellikle yüksek ateşte mühürlendikten sonra düşük ateşte dinlendirilerek pişirilmelidir.`,
    usageTips: "Izgara (en ideal), Pan-Sear (tava), Dry-Age sonrası steak, Fırında düşük ısıda yavaş pişirme. Orta-az (medium-rare) pişirmek lezzeti en üst seviyeye taşır.",
    chefTip: "Antrikotu pişirmeden 45 dakika önce buzdolabından çıkarın. Tuz serpip oda sıcaklığına gelmesini bekleyin — bu adım etin homojen pişmesini sağlar. Kesinlikle çatalla batırmayın.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    coverUrl: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=1600",
    relatedSlugs: ["dana-bonfile", "dana-tbone", "dana-kontrfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Angus'un doğal mermerleşmesi antrikotta zirve yapar. Kas içi yağ dağılımı sayesinde ızgarada eriyerek eşsiz bir tereyağımsı lezzet oluşturur.", bestCooking: ["Izgara", "Dry-Age Steak"], avoid: "Haşlama — yağ dokusu dağılır, lezzet suya karışır." },
      simental: { rating: 3, why: "Simental'in daha yağsız yapısı antrikotta orta düzey bir lezzet sunar. Daha sıkı tekstürlü ve hafif bir deneyim.", bestCooking: ["Tava (Pan-Sear)", "Fırın"], avoid: "Uzun ızgara — kuruma riski yüksek." },
      yerlikara: { rating: 3, why: "Yerli Kara'nın ince ama lezzetli kas yapısı küçük porsiyonlarda iyi sonuç verir. Doğal otlak aroması hissedilir.", bestCooking: ["Mangal", "Kavurma"], avoid: "Kalın kesim steak — yağ oranı yetersiz kalır." },
      limuzin: { rating: 4, why: "Limuzin'in güçlü kas yapısı ve düşük dış yağ oranı sayesinde antrikotta temiz, yoğun et lezzeti alınır.", bestCooking: ["Izgara", "Sous Vide"], avoid: "Çok yüksek ateşte direkt pişirme — dışı yanar, içi çiğ kalır." }
    }
  },
  {
    slug: "dana-bonfile",
    title: "Dana Bonfile",
    animalType: "BUYUKBAS",
    shortDesc: "Hayvanın en az çalışan kası — en yumuşak ve en değerli kesim.",
    content: `Bonfile (Tenderloin / Psoas major), sığırın bel bölgesinde, omurganın iç kısmında bulunan ve neredeyse hiç hareket etmeyen bir kastır.\n\nBu nedenle en yumuşak et kesimi olarak bilinir. Yağ oranı düşüktür ancak dokusu ipek gibidir. Tournedos, Chateaubriand ve Beef Wellington gibi klasik tariflerin ana malzemesidir.`,
    usageTips: "Pan-Sear + fırın (en klasik), Beef Wellington, Tournedos, Tartare (çiğ tüketim). Medium-rare veya rare pişirmek şarttır — iyi pişmiş bonfile lezzetini kaybeder.",
    chefTip: "Bonfile asla 63°C üzerinde iç sıcaklığa çıkmamalıdır. Et termometresi kullanmanızı şiddetle tavsiye ederiz. Pişirdikten sonra 5 dakika dinlendirin.",
    imageUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-tbone", "dana-kontrfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Angus bonfilesi zaten yumuşak olan bu kesimi bir üst seviyeye taşır. Hafif mermerleşme ile tereyağımsı bir doku kazanır.", bestCooking: ["Pan-Sear", "Beef Wellington"], avoid: "Marinasyon — doğal lezzeti bastırır." },
      simental: { rating: 4, why: "Simental'in temiz kas yapısı bonfilede çok iyi sonuç verir. Yağsız ama lezzetli, sağlıklı bir alternatif.", bestCooking: ["Sous Vide", "Pan-Sear"], avoid: "Uzun süreli fırın — kuruyabilir." },
      yerlikara: { rating: 3, why: "Yerli Kara'nın bonfilesi küçük boyutlu olsa da otlak beslemeden gelen doğal aroma farkı hissedilir.", bestCooking: ["Izgara", "Tava"], avoid: "Çok kalın kesim — pişirme kontrolü zorlaşır." },
      limuzin: { rating: 5, why: "Limuzin, kas/yağ oranıyla bonfilede mükemmel performans gösterir. İri porsiyon verimi ve temiz et lezzeti sunar.", bestCooking: ["Chateaubriand", "Pan-Sear"], avoid: "Kıyma — bu kesimin israfıdır." }
    }
  },
  {
    slug: "dana-tbone",
    title: "Dana T-Bone",
    animalType: "BUYUKBAS",
    shortDesc: "T şeklindeki kemiğin iki yanında antrikot ve bonfile — iki lezzet bir arada.",
    content: `T-Bone steak, sığırın kısa bel bölgesinden çıkar ve T şeklindeki kemiğin bir tarafında Bonfile (küçük taraf), diğer tarafında Striploin/Kontrfile (büyük taraf) bulunur.\n\nKemiğin pişirme sırasında ete verdiği mineralimsi aroma, bu kesimi özel kılar. Porterhouse, T-Bone'un daha kalın ve bonfile tarafı daha geniş olan versiyonudur.`,
    usageTips: "Mangal veya ızgara (en ideal), Cast-iron tava, Fırında yüksek ısı. Kemiğin yanındaki et daha yavaş pişer — dikkat edilmelidir.",
    chefTip: "T-Bone'u pişirirken bonfile tarafını ateşten biraz uzak tutun çünkü daha çabuk pişer. Kemiği tutarak dikey konumda kenarları da mühürleyebilirsiniz.",
    imageUrl: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-bonfile", "dana-kontrfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Angus T-Bone'u hem antrikot hem bonfile tarafında zengin mermerleşme sunar. Mangal şovu için en ideal ırk.", bestCooking: ["Mangal", "Izgara"], avoid: "İnce kesim — kemiğe yapışan eti hissettirmez." },
      simental: { rating: 3, why: "İri kas yapısı güzel porsiyon verir ancak yağ oranı düşük olduğundan mühürleme kritik.", bestCooking: ["Cast-iron Tava", "Fırın"], avoid: "Yüksek ateşte uzun pişirme — kurur." },
      yerlikara: { rating: 2, why: "Yerli Kara'nın küçük gövde yapısı T-Bone için yeterli kalınlık sağlamakta zorlanır.", bestCooking: ["Mangal"], avoid: "Bu kesim yerine kuşbaşı veya kavurma tercih edilmelidir." },
      limuzin: { rating: 4, why: "Limuzin'in iri kas hacmi T-Bone'da etkileyici porsiyon boyutu ve temiz et lezzeti sunar.", bestCooking: ["Mangal", "Izgara"], avoid: "Çok ince kesim — kemiğe oranla et azalır." }
    }
  },
  {
    slug: "dana-kontrfile",
    title: "Dana Kontrfile (Striploin)",
    animalType: "BUYUKBAS",
    shortDesc: "Antrikotun hemen altından çıkan, dengeli yağ oranıyla steakhouse favorisi.",
    content: `Kontrfile (Striploin / New York Strip), sığırın sırt bölgesinin alt kısmından elde edilir. Antrikota göre biraz daha az mermerleşme gösterir ancak daha sıkı ve dolgun bir dokuya sahiptir.\n\nBu denge, onu hem steak severler hem de daha hafif bir et isteyenler için ideal kılar. Kenar yağı (cap fat) pişirme sırasında muhteşem bir kabuk oluşturur.`,
    usageTips: "Steak (tava veya ızgara), Roast Beef, Teriyaki strips. Kenar yağını kesmeden pişirin, sonra isterseniz ayırın.",
    chefTip: "Kontrfilenin kenar yağını mutlaka bırakın — pişirme sırasında bu yağ eriyerek ete nüfuz eder ve kabuğu altın sarısı yapar.",
    imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800",
    coverUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=1600",
    relatedSlugs: ["dana-antrikot", "dana-tbone", "dana-bonfile"],
    breedRecommendations: {
      angus: { rating: 5, why: "Angus kontrfilesi mükemmel kenar yağı ve dengeli mermerleşme sunar. Steakhouse kalitesi.", bestCooking: ["Steak", "Pan-Sear"], avoid: "Haşlama — bu kesimdeki yağ dengesi kaybolur." },
      simental: { rating: 4, why: "Simental'in düşük yağ oranı kontrfilede temiz bir et tadı sunar. Sağlık bilinci olanlar için ideal.", bestCooking: ["Izgara", "Roast Beef"], avoid: "Çok ince dilim — eti kurumaya zorlar." },
      yerlikara: { rating: 3, why: "Yerli Kara kontrfilesi kompakt boyutuyla porsiyon olarak küçük kalsa da aroması yoğundur.", bestCooking: ["Kavurma", "Tava"], avoid: "Kalın steak kesim — homojen pişirmek zor." },
      limuzin: { rating: 4, why: "Limuzin'in iri ve yağsız kontrfilesi hem boy hem lezzet açısından tatmin edicidir.", bestCooking: ["Steak", "Fırın"], avoid: "Çiğ tüketim — bonfile kadar yumuşak değildir." }
    }
  },
  {
    slug: "dana-kusbasi",
    title: "Dana Kuşbaşı",
    animalType: "BUYUKBAS",
    shortDesc: "But ve kol bölgesinden küp doğranmış, sulu yemeklerin ve kavurmaların baş aktörü.",
    content: `Kuşbaşı, genellikle sığırın but, kol veya kürek bölgelerinden elde edilen etlerin 2-3 cm küpler halinde doğranmasıyla hazırlanır.\n\nBu bölgeler hareket eden kaslara sahiptir, bu nedenle uzun pişirmeyle yumuşayan bağ dokuları içerir. Doğru pişirildiğinde son derece lezzetli ve doyurucu bir sonuç verir.`,
    usageTips: "Kavurma, Güveç, Türlü, Çorba, Fırın Tava, Sote. Yavaş ve uzun pişirmek bağ dokusunu eritir, eti yumuşatır.",
    chefTip: "Kuşbaşı pişirirken tencereyi aşırı doldurmayın — et buğulanır, mühürlenmez. Küçük partiler halinde yüksek ateşte mühürleyip sonra sıvı ekleyin.",
    imageUrl: "https://images.unsplash.com/photo-1607116667981-ff71c3841d8a?w=800",
    coverUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600",
    relatedSlugs: ["dana-kiyma", "dana-kaburga", "kuzu-incik"],
    breedRecommendations: {
      angus: { rating: 4, why: "Angus kuşbaşısı mermerleşme sayesinde kavurmada bile yumuşak kalır. Premium güveç ve sote için ideal.", bestCooking: ["Kavurma", "Güveç"], avoid: "Çok kısa pişirme — bağ dokusu erimeden sert kalır." },
      simental: { rating: 4, why: "Simental'in dolgun kas yapısı kuşbaşıda doyurucu, sağlam parçalar verir. Uzun pişirmede harika yumuşar.", bestCooking: ["Güveç", "Fırın Tava"], avoid: "Çiğ veya az pişmiş tüketim — bu bölge yumuşamaz." },
      yerlikara: { rating: 5, why: "Yerli Kara'nın doğal otlak beslemesi kuşbaşıda en iyi sonucu verir. Yoğun et aroması ve ideal bağ doku oranı.", bestCooking: ["Kavurma", "Türlü", "Çorba"], avoid: "Steak gibi pişirme — bu bölgeler uzun pişirme ister." },
      limuzin: { rating: 4, why: "Limuzin'in iri kas yapısı büyük ve düzgün kuşbaşı parçaları verir. Yemeklerde göz dolduran porsiyonlar.", bestCooking: ["Sote", "Güveç"], avoid: "Kuru pişirme — sıvı ile desteklenmeli." }
    }
  },
  {
    slug: "dana-kiyma",
    title: "Dana Kıyma",
    animalType: "BUYUKBAS",
    shortDesc: "Türk mutfağının olmazsa olmazı — köfte, lahmacun ve daha fazlası için temel malzeme.",
    content: `Kıyma, sığırın çeşitli bölgelerinden (but, kol, boyun, göğüs) elde edilen etlerin kıyma makinesinden geçirilmesiyle elde edilir.\n\nKaliteli kıymanın sırrı yağ oranındadır: %15-20 yağ oranı köfte için ideal iken, %10 altı yağsız kıyma lahmacun ve pide için tercih edilir. Kasabınızdan istediğiniz yağ oranını belirtmeniz büyük fark yaratır.`,
    usageTips: "Köfte, Lahmacun, Pide, Kıymalı Börek, Bolognese, Kıymalı Makarna, Sucuklu Yumurta hazırlığı. Her yemekte farklı yağ oranı tercih edin.",
    chefTip: "Köfte için kıymayı çok yoğurmayın — glüten gelişir ve sert olur. Hafifçe karıştırıp soğukta 30 dakika dinlendirin.",
    imageUrl: "https://images.unsplash.com/photo-1529042410-1a90a4e0c2c1?w=800",
    coverUrl: "https://images.unsplash.com/photo-1529042410-1a90a4e0c2c1?w=1600",
    relatedSlugs: ["dana-kusbasi", "kuzu-kiyma"],
    breedRecommendations: {
      angus: { rating: 4, why: "Angus kıyması doğal yağ dengesi sayesinde ekstra yağ eklemeden mükemmel köfte verir.", bestCooking: ["Köfte", "Hamburger Patty"], avoid: "Çok yağsız çekilmesi — Angus'un avantajını ortadan kaldırır." },
      simental: { rating: 4, why: "Simental kıyması düşük yağ oranıyla lahmacun ve pide için ideal. Temiz et tadı.", bestCooking: ["Lahmacun", "Pide", "Börek"], avoid: "Yüksek yağ oranlı köfte — ırkın doğası gereği zaten yağsızdır." },
      yerlikara: { rating: 5, why: "Yerli Kara'nın aromalı eti kıymada en otantik Türk lezzeti verir. Geleneksel köfte ve lahmacun için rakipsiz.", bestCooking: ["Geleneksel Köfte", "Lahmacun", "Kıymalı Pide"], avoid: "Hamburger patty — aromayı bastırır." },
      limuzin: { rating: 3, why: "Limuzin kıyması kalitelidir ancak bu ırkı kıymaya çekmek maliyet açısından mantıklı değildir.", bestCooking: ["Premium Köfte", "Bolognese"], avoid: "Sıradan yemekler — bu ırk steak kesimlerinde daha değerli." }
    }
  },
  {
    slug: "dana-kaburga",
    title: "Dana Kaburga",
    animalType: "BUYUKBAS",
    shortDesc: "Kemikli etin sultanı — yavaş pişirmede dağılan lifler ve derin lezzet.",
    content: `Dana kaburga, göğüs kafesinin alt bölgesinden elde edilir. Kemik, bağ dokusu ve kas dokusunun mükemmel dengesi sayesinde uzun pişirmelerde eşsiz bir lezzet ortaya çıkar.\n\nKollajen bakımından zengin yapısı, düşük ısıda yavaş pişirildiğinde jelatin formuna dönüşerek etin ağızda dağılmasını sağlar. BBQ kültürünün dünya çapında en sevilen kesimlerinden biridir.`,
    usageTips: "Fırında yavaş pişirme (4-6 saat), BBQ/Smoker, Güveç, Kemik suyu. Düşük ısı + uzun süre = mükemmel sonuç.",
    chefTip: "Kaburgayı alüminyum folyo ile sararak 150°C fırında 4 saat pişirin. Son 30 dakikada folyoyu açıp sos sürün — karamelize kabuk oluşur.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    coverUrl: "https://images.unsplash.com/photo-1558030137-a56c7b34b251?w=1600",
    relatedSlugs: ["dana-kusbasi", "kuzu-incik", "dana-antrikot"],
    breedRecommendations: {
      angus: { rating: 4, why: "Angus kaburgasında mermerleşme yavaş pişirmede muhteşem bir jelatin dönüşümü sağlar.", bestCooking: ["BBQ/Smoker", "Fırında Yavaş Pişirme"], avoid: "Hızlı pişirme — kollajen erimez, sert kalır." },
      simental: { rating: 4, why: "Simental'in iri kemik yapısı ve dolgun etleri kaburga porsiyon boyutlarında avantaj sağlar.", bestCooking: ["Güveç", "Fırın"], avoid: "Izgara — kemikli etler ızgarada kontrol zordur." },
      yerlikara: { rating: 4, why: "Yerli Kara kaburgası küçük ama aromalıdır. Kemik suyu ve güveç için mükemmel doğal lezzet.", bestCooking: ["Kemik Suyu", "Güveç"], avoid: "Tek başına servis — porsiyon küçük kalır." },
      limuzin: { rating: 5, why: "Limuzin'in güçlü kemik yapısı ve kalın kas dokusu kaburgada en büyük ve en doyurucu porsiyonları verir.", bestCooking: ["BBQ", "Fırında Yavaş Pişirme"], avoid: "Kısa süreli pişirme — bağ dokusu çözmek için zaman gerekir." }
    }
  },
  {
    slug: "kuzu-incik",
    title: "Kuzu İncik",
    animalType: "KUCUKBAS",
    shortDesc: "Kuzunun arka bacağından çıkan, yavaş pişirmede ağızda dağılan lezzet bombası.",
    content: `Kuzu incik, kuzunun arka bacağının alt kısmından (baldır bölgesi) elde edilir. Yoğun bağ dokusu ve kollajen içerir.\n\nBu yapı sayesinde düşük ısıda uzun süre pişirildiğinde et kemikten ayrılacak kadar yumuşar. Osmanlı mutfağından modern fine-dining'e kadar geniş bir yelpazede kullanılan prestijli bir kesimdir.`,
    usageTips: "Fırında yavaş pişirme (3-4 saat), Güveç, Tandır. Pişirme sıvısına kırmızı şarap, domates ve aromatikler eklemek lezzeti katlar.",
    chefTip: "İnciği zeytinyağı ve sarımsakla marine edip gece boyunca buzdolabında bekletin. Sabah fırına koyup akşam yemeğine mükemmel bir sonuç alın.",
    imageUrl: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544215814-c0ad846feefc?w=1600",
    relatedSlugs: ["kuzu-pirzola", "kuzu-but", "kuzu-gerdan"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "Kıvırcık kuzusunun ince mermerleşmesi sayesinde kendi yağıyla mükemmel bir lokum kıvamına gelir.", bestCooking: ["Fırında Yavaş Pişirme", "Tandır"], avoid: "Aşırı soslama — doğal lezzeti örtmemelidir." },
      karaman: { rating: 4, why: "Yoğun aroması yöresel güveç yemeklerine o beklenen geleneksel dokunuşu katar.", bestCooking: ["Güveç", "Haşlama"], avoid: "Hızlı ateşte pişirme." },
      merinos: { rating: 4, why: "İri kas yapısı sayesinde tek bir incikle çok daha doyurucu porsiyonlar elde edilir.", bestCooking: ["Fırın", "Tandır"], avoid: "" },
      angus: { rating: 0, why: "Büyükbaş ırkı.", bestCooking: [], avoid: "" }
    }
  },
  {
    slug: "kuzu-pirzola",
    title: "Kuzu Pirzola",
    animalType: "KUCUKBAS",
    shortDesc: "Kuzunun kaburga bölgesinden tek tek ayrılan, zarif sunumlu narin kesim.",
    content: `Kuzu pirzola, kuzunun sırt ve kaburga bölgesinden elde edilir. Her bir pirzola parçası kemiğe bağlı küçük bir kas bloğundan oluşur.\n\nEt/kemik oranı ve narin dokusuyla özellikle hızlı pişirme yöntemlerinde parlayan bir kesimdir. Frenched (kemik ucu temizlenmiş) sunum, fine-dining restoranların vazgeçilmezidir.`,
    usageTips: "Izgara (2-3 dk/taraf), Pan-Sear, Mangal. Medium-rare pişirmek en ideal sonucu verir. Kaburga kemikleri sunum için temizlenebilir.",
    chefTip: "Pirzolayı pişirmeden önce kemik tarafını 1 dk ateşe tutun, sonra et tarafını 2 dk mühürleyin. Biberiye ve sarımsak tereyağıyla bastıng yapın.",
    imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800",
    coverUrl: "https://images.unsplash.com/photo-1544215814-c0ad846feefc?w=1600",
    relatedSlugs: ["kuzu-incik", "kuzu-but", "kuzu-gerdan"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "Kokusu yok denecek kadar azdır, lif aralarındaki ince yağlar ızgarada mükemmel karamelize olur.", bestCooking: ["Mühürleme (Pan-Sear)", "Izgara"], avoid: "Çok pişirmek (Well-done) — sululuğunu kaybeder." },
      karaman: { rating: 3, why: "Kuyruk bölgesine yakın olan kısımları daha yoğun yağlıdır, klasik damak tadı arayanlar için iyidir.", bestCooking: ["Mangal"], avoid: "Tavada pişirme — yağı hızlı yanabilir." },
      merinos: { rating: 4, why: "Göz çapı geniş olduğu için pirzolası etli ve kalındır, porsiyon tatmini çok yüksektir.", bestCooking: ["Kömür Izgara", "Döküm Tava"], avoid: "" },
      angus: { rating: 0, why: "Büyükbaş ırkı.", bestCooking: [], avoid: "" }
    }
  },
  {
    slug: "kuzu-but",
    title: "Kuzu But",
    animalType: "KUCUKBAS",
    shortDesc: "Kuzunun en büyük ve en doyurucu kesimi — kalabalık sofralar için biçilmiş kaftan.",
    content: `Kuzu but, kuzunun arka bacağının üst kısmından (kalça ve üst baldır) elde edilir. En büyük tek parça kuzu kesimidir.\n\nBütün halde fırında pişirildiğinde dışı çıtır, içi pembe ve sulu kalır. Bayram sofralarının ve özel davetlerin geleneksel yıldızıdır.`,
    usageTips: "Bütün fırında (en klasik), Tandır, Kuyu kebabı, Dilimlenip ızgara. Kemikli veya kemiksiz hazırlanabilir.",
    chefTip: "Butu bıçakla 10-12 yerden deşip sarımsak dilimleri ve biberiye dalları yerleştirin. 160°C'de kg başına 45 dk pişirin. En az 20 dk dinlendirin.",
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800",
    coverUrl: "https://images.unsplash.com/photo-1606850780554-b55ea40f0746?w=1600",
    relatedSlugs: ["kuzu-incik", "kuzu-pirzola", "kuzu-gerdan"],
    breedRecommendations: {
      kivircik: { rating: 5, why: "But rosto için ince ve dengeli yağ yapısı sayesinde kurumadan nar gibi kızarır.", bestCooking: ["Fırın Rosto", "Bütün Pişirme"], avoid: "Hızlı ateşte parçalamadan pişirme." },
      karaman: { rating: 4, why: "Anadolu tandır geleneğinin efsanesidir. Kemer kemik etrafındaki etler dökülene kadar pişirilir.", bestCooking: ["Tandır", "Kuyu Kebabı"], avoid: "Kısa fırınlama." },
      merinos: { rating: 5, why: "Devasa kas kütlesi sayesinde kalabalık sofralar için alınan bütün bir but çok bereketlidir.", bestCooking: ["Şiş", "Fırın"], avoid: "" },
      angus: { rating: 0, why: "Büyükbaş ırkı.", bestCooking: [], avoid: "" }
    }
  },
  {
    slug: "kuzu-gerdan",
    title: "Kuzu Gerdan",
    animalType: "KUCUKBAS",
    shortDesc: "Boyun bölgesinin lezzetli ve ekonomik kesimi — yavaş pişirmede şahane sonuçlar.",
    content: `Kuzu gerdan, kuzunun boyun bölgesinden elde edilir. Bağ dokusu bakımından zengindir ve bu nedenle uzun, yavaş pişirme yöntemlerinde en iyi sonucu verir.\n\nEkonomik bir kesim olmasına rağmen doğru pişirildiğinde premium kesimlere yakın bir lezzet sunar. Özellikle güveç ve tandır yemeklerinde tercih edilir.`,
    usageTips: "Tandır, Güveç, Fırında yavaş pişirme, Kuyu kebabı. Düşük ısı + uzun süre kuralı burada da geçerlidir.",
    chefTip: "Gerdanı tuz ve baharat ile ovup streç filme sarın, 2 saat oda sıcaklığında bekletin. Sonra düşük ısıda 3 saat fırınlayın.",
    imageUrl: "https://images.unsplash.com/photo-1607116667981-ff71c3841d8a?w=800",
    coverUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=1600",
    relatedSlugs: ["kuzu-incik", "kuzu-but", "kuzu-pirzola"],
    breedRecommendations: {
      kivircik: { rating: 4, why: "Gerdan sote ve haşlamalarda yumuşacık ve açık renkli, berrak bir et suyu bırakır.", bestCooking: ["Haşlama", "Sote"], avoid: "Izgara — sert kalır." },
      karaman: { rating: 5, why: "Anadolu çorbaları (gerdan çorbası) ve sulu yemekler için en yoğun lezzet profiline sahiptir.", bestCooking: ["Çorba", "Uzun Haşlama"], avoid: "Kuru pişirme yöntemleri." },
      merinos: { rating: 4, why: "Gerdan boyutu diğer ırklara göre büyük olduğu için kemik etrafındaki et verimi çok yüksektir.", bestCooking: ["Fırında Sebzeli", "Haşlama"], avoid: "" },
      angus: { rating: 0, why: "Büyükbaş ırkı.", bestCooking: [], avoid: "" }
    }
  },
  {
    slug: "sigir-dili",
    title: "Sığır Dili",
    animalType: "BUYUKBAS",
    shortDesc: "Geleneksel Türk mutfağının gizli hazinesi — doğru hazırlandığında ipek gibi yumuşak.",
    content: `Sığır dili, saf kas dokusundan oluşan, yağsız ama son derece lezzetli bir kesimdir. Haşlandıktan sonra dış zarı soyulur ve dilimlenip servis edilir.\n\nTürkiye'de özellikle söğüş olarak, turşu ile birlikte veya salata eşliğinde tüketilir. Modern mutfakta ise taco, pastrami ve fine-dining uygulamalarında da kullanılmaktadır.`,
    usageTips: "Haşlama (en klasik, 3-4 saat), Söğüş, Dil Pastrami, Taco, Terrine. Pişirdikten sonra buz suyuna atıp zarını kolayca soyun.",
    chefTip: "Dili haşlarken suya defne yaprağı, tane karabiber, havuç ve soğan ekleyin. 3 saat kaynatın, soğumaya başlayınca zarı soyun — kolayca çıkar.",
    imageUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800",
    coverUrl: "https://images.unsplash.com/photo-1529042410-1a90a4e0c2c1?w=1600",
    relatedSlugs: ["dana-kaburga", "dana-kusbasi"],
    breedRecommendations: {
      angus: { rating: 3, why: "Angus dili kaliteli olmakla birlikte, bu kesimde ırk farkı en az hissedilen alandır.", bestCooking: ["Haşlama", "Söğüş"], avoid: "Izgara — çiğ dil ızgaraya uygun değildir, önce haşlanmalıdır." },
      simental: { rating: 3, why: "Simental dili boyut olarak yeterlidir. Lezzet farkı minimaldir.", bestCooking: ["Haşlama", "Söğüş"], avoid: "Direkt fırın — önce haşlama şarttır." },
      yerlikara: { rating: 4, why: "Yerli Kara'nın dili küçük ama aromalıdır. Otlak beslenme dile bile yansır.", bestCooking: ["Geleneksel Söğüş", "Haşlama"], avoid: "Porsiyon beklentisi düşük tutulmalı." },
      limuzin: { rating: 4, why: "Limuzin dili büyük boyutu ve temiz dokusuyla pastrami ve modern uygulamalar için idealdir.", bestCooking: ["Pastrami", "Haşlama"], avoid: "Kısa süreli pişirme — en az 3 saat haşlama gerekir." }
    }
  }
];

async function main() {
  console.log("Seeding Et Rehberi...");

  // Mevcut rehberleri temizle
  await prisma.meatGuide.deleteMany();
  console.log("Mevcut rehber verileri temizlendi.");

  for (const g of guides) {
    await prisma.meatGuide.create({ data: g });
    console.log(`  ✓ ${g.title} (${g.animalType})`);
  }

  console.log(`\n${guides.length} rehber oluşturuldu.`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
