const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allRegions = [
    {
      slug: "dana-gerdan",
      title: "Dana Gerdan",
      animalType: "BUYUKBAS",
      shortDesc: "Hayvanın boyun bölgesinden elde edilen, lifli ve haşlamaya çok uygun yoğun et.",
      content: "Dananın başı ile gövdesini bağlayan boyun bölgesidir. Hayvan bu bölgeyi sürekli hareket ettirdiği için kas dokusu sert, lifli yapıdadır. Ancak yüksek oranda bağ dokusu içerdiğinden sıvı içerisinde ağır ateşte piştiğinde jelatinleşerek mükemmel bir suyu ve lezzeti olur.",
      usageTips: "Izgara veya tavaya uygun değildir. En iyi sonucu uzun saatler süren tencere yemeklerinde, fırın poşetinde yahni olarak veya efsanevi saray çorbalarında verir.",
      imageUrl: "/images/cuts/round.png", // Using a rich lean cut proxy for gerdan visual
      coverUrl: "/images/cuts/round.png",
      relatedSlugs: ["dana-dosh", "dana-on-incik"],
    },
    {
      slug: "dana-kontrfile",
      title: "Dana Kontrfile",
      animalType: "BUYUKBAS",
      shortDesc: "Bel bölgesinden çıkan, bonfileye komşu, az yağlı ama çok lezzetli biftek bölgesi.",
      content: "Antrikotun bitiminden başlayıp sokum bölgesine kadar uzanan, omurganın üstündeki değerli kas grubudur. Bonfile ile birlikte 'T-Bone' veya 'Porterhouse' steakleri oluşturur. Antrikota göre çok daha az yağlı, bonfileye göre biraz daha serttir ancak et aromasını doruklarda yaşatır.",
      usageTips: "İnce veya kalın dilimlenerek ızgarada veya sıcak döküm tavada pişirilmesi önerilir. Çok yağlı olmadığı için kurutmadan mühürlemek (az-orta kıvam) şarttır.",
      imageUrl: "/images/cuts/striploin.png",
      coverUrl: "/images/cuts/striploin.png",
      relatedSlugs: ["dana-bonfile", "dana-antrikot"],
    },
    {
      slug: "dana-tranc",
      title: "Dana Tranç",
      animalType: "BUYUKBAS",
      shortDesc: "But kısmının iç yüzeyinden elde edilen, yağsız ve sinirsiz yumuşak parça.",
      content: "Arka bacağın kasık kısmından (iç but) çıkan birinci kalite lop ettir. Yağ dokusu neredeyse hiç yoktur ama et lifleri yumuşaktır. Özellikle ince kuşbaşı, sote ve yağsız kavurma için Türkiye'deki en sevilen klasik kesimdir.",
      usageTips: "Yağsız olması sebebiyle kurutulmaması gerekir. Wok veya sac üzerinde hızlıca sotelemek, tas kebabı yapmak veya ince dövülmüş şinitzel hazırlamak için harikadır.",
      imageUrl: "/images/cuts/round.png",
      coverUrl: "/images/cuts/round.png",
      relatedSlugs: ["dana-picanha", "dana-nuar"],
    },
    {
      slug: "dana-dosh",
      title: "Dana Döş (Brisket)",
      animalType: "BUYUKBAS",
      shortDesc: "Göğüs kısmından elde edilen, barbekü kültürünün baş tacı olan yağlı ve kemikli et.",
      content: "Danadan alınan, ön göğüs kafesini çevreleyen ettir (Brisket). Yağ ve bağ dokusu açısından inanılmaz zengindir. Texas tipi efsanevi 'Füme Brisket' yemekleri bu parçadan çıkar. Türkiye'de en kaliteli %100 dana sucuğunun ve rüya gibi hamburger köftelerinin harmanına bu bölgenin yağı katılır.",
      usageTips: "Eğer parça olarak pişirilecekse 'Smoker' (tütsüleme fırını) içinde 12-14 saat çok düşük ısıda meşe odunuyla pişirilmelidir. Aksi halde kıyma/sucuk harcı olarak efsanedir.",
      imageUrl: "/images/cuts/brisket.png",
      coverUrl: "/images/cuts/brisket.png",
      relatedSlugs: ["dana-gerdan", "dana-on-incik"],
    },
    {
      slug: "dana-bosluk",
      title: "Dana Boşluk",
      animalType: "BUYUKBAS",
      shortDesc: "Döş ve but arasında kalan karın zarı bölgesi, Flank Steak'in vatanı.",
      content: "Hayvanın karın bölgesini (kaburgaların bittiği noktadan kasıklara kadar) sarar. Et lifleri çok net ve kalındır. Yağ oranı döş kadar yüksek değildir. Latin Amerika'da 'Flank Steak' veya 'Bavette' adıyla fajita ve dürümlerin içinde servis edilen o ünlü ince ve aromatik ettir.",
      usageTips: "Ya asidik bir marinasyonda bekletilip çok bütün halde ızgara yapılır ve liflere DİK kesilir, ya da zırhtan geçirilip Adana gibi kuyruk yağıyla karıştırılarak şişe saplanır.",
      imageUrl: "/images/cuts/flank.png",
      coverUrl: "/images/cuts/flank.png",
      relatedSlugs: ["dana-dosh", "dana-tranc"],
    },
    {
      slug: "dana-on-incik",
      title: "Dana Ön İncik / Kol",
      animalType: "BUYUKBAS",
      shortDesc: "Hayvanın ön kol yapısı. İlikli kemiğiyle birlikte Osso Buco efsanesinin kaynağı.",
      content: "Yere basan ağırlık merkezinin olduğu kol bölgesidir. İçeriğinde inanılmaz bir iliğe sahip dev tüp kemiği (Osso Buco) barındırır. Haşlandığında etin etrafındaki kolajen ağları doğal bir jelatine dönüşür.",
      usageTips: "İtalyanların ünlü 'Osso Buco' yemeği gibi şarap, kereviz, havuç ve domates soslu bir güveçte 3-4 saat ağır ağır kemiğiyle fırınlanıp iliğinin sosla bütünleşmesi sağlanır.",
      imageUrl: "/images/cuts/shank.png",
      coverUrl: "/images/cuts/shank.png",
      relatedSlugs: ["dana-incik", "dana-dosh"],
    },
    {
      slug: "dana-incik",
      title: "Dana Arka İncik",
      animalType: "BUYUKBAS",
      shortDesc: "Hayvanın arka bacak diz altı bölgesi, sulu yemeklerin ve haşlamaların efendisi.",
      content: "Tamamen kemikli, bol sinirli ve kolajenli bir löp et kütlesidir. Sadece kaynar suda saatlerce kaldığında teslim olan bu et, dünyanın en şifalı ve berrak kemik sularının elde edildiği kısımdır.",
      usageTips: "Tamamen kemik suyu elde etmek, paça çorbalarına et katmak veya düdüklü tencerede ağır haşlama Türk mutfağı (patates/havuçlu) için biçilmiş kaftandır.",
      imageUrl: "/images/cuts/shank.png",
      coverUrl: "/images/cuts/shank.png",
      relatedSlugs: ["dana-on-incik", "dana-tranc"],
    },
    {
      slug: "kuzu-gerdan",
      title: "Kuzu Gerdan",
      animalType: "KUCUKBAS",
      shortDesc: "Kuzunun boyun bölgesinden gelen harika jöleli ve bol kemikli çorbalık et.",
      content: "Kuzu gerdan, kemik ve kas yapısının karmaşık olduğu ama ağır ağır piştiğinde kemiklerden sıyrılıp kendi şifalı suyuna karışan eşsiz bir lokasyondur. Düğün çorbalarının ve etli pilavların üzerine tiftiklenir.",
      usageTips: "Gerdan kesinlikle ızgaraya uygun değildir. İçindeki ilik ve yapıştırıcı kolajenleri suya vermek için tencerede buharla veya güveçte susuz buğulama yöntemiyle pişirilmelidir.",
      imageUrl: "/images/cuts/lamb-neck.png",
      coverUrl: "/images/cuts/lamb-neck.png",
      relatedSlugs: ["kuzu-uykuluk", "kuzu-kol"],
    },
    {
      slug: "kuzu-pirzola",
      title: "Kuzu Pirzola / Kafes",
      animalType: "KUCUKBAS",
      shortDesc: "Kuzunun en popüler ve değerli 'Crown' kemikli yüzeyi.",
      content: "Kuzunun sırt (kaburga) kafesinden elde edilen, eti ve kemiği birbirine aşık olan en değerli mangallık kesimidir. French-trim (kemik uçlarının sıyrılması) yapıldığında taç şeklinde harika bir 'Rack of Lamb' elde edilir.",
      usageTips: "Asla tencereye atılmaz. Marinasyon (süt, soğan suyu, zeytinyağı, kekik) ile dinlendirildikten sonra ızgarada çok kurutmadan hafif pembe kalacak şekilde ateşle buluşturulmalıdır.",
      imageUrl: "/images/cuts/lamb-chops.png",
      coverUrl: "/images/cuts/lamb-chops.png",
      relatedSlugs: ["kuzu-kusleme", "kuzu-bel"],
    },
    {
      slug: "kuzu-kusleme",
      title: "Kuzu Küşleme",
      animalType: "KUCUKBAS",
      shortDesc: "Bir kuzudan sadece 150-200 gram çıkan, sinirsiz ve sapsade lokum.",
      content: "Kuzunun omurgasının tam altında, karın boşluğuna yakın yer alan psoas (bonfile) kasıdır. Hiç çalışmayan bir kas olduğu için kuzu anatomisinin en yumuşak, bir o kadar da nadir bölgesidir.",
      usageTips: "Kuzu eti kokusu almazsınız. Şişe saplanıp közde sadece tuz dökerek (marinasyonla lezzetini gizlemeden) çok kısa sürede pişirilmelidir.",
      imageUrl: "/images/cuts/lamb-chops.png", // Often served similarly raw
      coverUrl: "/images/cuts/lamb-chops.png",
      relatedSlugs: ["kuzu-pirzola", "kuzu-bel"],
    },
    {
      slug: "kuzu-but",
      title: "Kuzu But",
      animalType: "KUCUKBAS",
      shortDesc: "Rosto ve fırın ziyafetlerinin değişmez gösterişli parçası.",
      content: "Arka ayak ve kalçadan oluşan bol etli bölümdür. Pirzolaya göre biraz daha az yağlıdır ancak devasa fırın yemekleri, Kuzu Tandır ve Kuzu Kapama ritüelleri bu dev parçadan yapılır.",
      usageTips: "Bütün olarak fırına atıldığında dışına kesikler atıp içlerine sarımsak ve biberiye sokarak zeytinyağıyla ovalayın. Uzun süreli yavaş fırınlama en iyi sonucu verecektir.",
      imageUrl: "/images/cuts/lamb-leg.png",
      coverUrl: "/images/cuts/lamb-leg.png",
      relatedSlugs: ["kuzu-incik", "kuzu-kol"],
    },
    {
      slug: "kuzu-kol",
      title: "Kuzu Kol (Kürek)",
      animalType: "KUCUKBAS",
      shortDesc: "Kuzunun ön omuz bölgesinden gelen yumuşak ve jelatinli ziyafet eti.",
      content: "But kısmından farklı olarak ön ayak ve omuz (kürek) alanını kapsar. Hareket kabiliyetinden dolayı bolca jelatin barındırır. Bu yüzden fırınlandığında buttan çok daha sulu kalarak kelimenin tam anlamıyla lime lime dökülür.",
      usageTips: "Kuzu tandır yapımının asıl gizli kahramanıdır. Kuyuda veya fırında uzun süre kendi yağıyla ağır ağır piştiğinde kemikten dökülen efsane bir yapıya bürünür.",
      imageUrl: "/images/cuts/lamb-shoulder.png",
      coverUrl: "/images/cuts/lamb-shoulder.png",
      relatedSlugs: ["kuzu-gerdan", "kuzu-but"],
    },
    {
      slug: "kuzu-bosluk",
      title: "Kuzu Boşluk",
      animalType: "KUCUKBAS",
      shortDesc: "Göğüs kafesi bitiminden itibaren gelen en yağlı ve lezzetli sarma bölgesi.",
      content: "Döş kısmının bittiği, etin ince bir tabaka haline gelip yerini yüksek bir yağa bıraktığı kısımdır. Sade olarak tüktilmese de rulo (sarma) fırın yemekleri veya enfes Adana kebap yağları için temel hammaddedir.",
      usageTips: "Ya köftenin/kebabın içine katılmalıdır ya da içine iç pilav sarılarak fırında Kuzu Sarma (Kuzu Kafes Dolma) şeklinde muhteşem bir görsel ziyafete dönüştürülmelidir.",
      imageUrl: "/images/cuts/flank.png", // Lamb breast/flank looks like beef flank but smaller
      coverUrl: "/images/cuts/flank.png",
      relatedSlugs: ["kuzu-kol", "kuzu-pirzola"],
    }
  ];

  console.log("8K AI Görselleriyle 13 bölge güncelleniyor...");
  for (const item of allRegions) {
    await prisma.meatGuide.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log("TAMAMLANDI! Görseller veritabanına işlendi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
