const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const exoticGuides = [
    {
      slug: "dana-tomahawk",
      title: "Tomahawk Steak",
      animalType: "BUYUKBAS",
      shortDesc: "Devasa kemiğiyle görsel bir şölen sunan, dünyanın en gösterişli antrikot kesimi.",
      content: "Tomahawk, adını Amerikan yerlilerinin oymalı baltasından alan, uzun bütün bir kaburga kemiği üzerinde bırakılmış son derece kalın bir dana antrikottur. Genellikle 1-1.5 kg civarında gelir. Bu devasa kemik parçası, pişirme sırasında eti korumanın yanı sıra ilik tadının ete geçmesini sağlayarak ekstra bir lezzet ve inanılmaz bir görsel şölen katar. Etin içindeki yoğun ve dengeli yağ dokusu (mermerlenme), her lokmada ağızda dağılan, patlayan bir sululuk sağlar. Türkiye'de lüks steakhouse (et restoranı) kültürünün zirvesi ve en prestijli sunumu kabul edilir.",
      usageTips: "Kalın olduğu için sadece dıştan pişirmek yetmez. Izgara veya döküm tavada yüksek ateşte mühürledikten (crust) sonra, düşük sıcaklıkta fırınlayarak içini pişirmek (Reverse Sear tekniği) en ideal ve profesyonel yoldur. Kesinlikle well-done (çok iyi) pişirilmemelidir; içi sulu (Medium Rare) kalmalıdır.",
      imageUrl: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=800",
      coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000",
      relatedSlugs: ["dana-antrikot", "dana-wagyu"],
    },
    {
      slug: "dana-wagyu",
      title: "Wagyu A5 (Kobe Türü)",
      animalType: "BUYUKBAS",
      shortDesc: "Özel genetik mirasıyla 'Etlerin Havyarı' olarak bilinen dünyadaki en değerli aşırı mermer et.",
      content: "Wagyu, kelime anlamı olarak 'Japon Sığırı' demektir ve kendine has genetik özellikleri sayesinde dünyanın açık ara en pahalı ve lüks eti olarak tescillenmiştir. Etin içindeki devasa yağ damarları (Mermerlenme - BMS 12 Skorlarına kadar çıkar) diğer sığırlardan on kat daha yoğundur ve mucizevi bir şekilde bu yağların %80'i sağlıklı doymamış yağ asitlerinden (Oleik asit) oluşur. Bu yapı eti adeta oda sıcaklığında bile eriyen (melt-in-mouth) bir kar tanesi formuna dönüştürür. Türkiye'de nadir bulunan bu gurme lezzet, aşırı zenginliğinden dolayı porsiyonluk değil tadımlık (100-200 gram) tüketilir.",
      usageTips: "Izgarada harcanmaması gereken eşsiz bir parçadır. İnce ince dilimlenip kızgın sac (Teppan) veya döküm tava üzerinde sadece birkaç saniye dışarıdan mühürlenerek yenmelidir. Yoğun yağlı yapısından dolayı kesinlikle ağır baharatlı soslarla değil, sönük bir kaya tuzu eşliğinde tüketilmelidir.",
      imageUrl: "https://images.unsplash.com/photo-1628169282361-9c3db6f8099e?q=80&w=800",
      coverUrl: "https://images.unsplash.com/photo-1628169282361-9c3db6f8099e?q=80&w=2000",
      relatedSlugs: ["dana-bonfile", "dana-tomahawk"],
    },
    {
      slug: "dana-picanha",
      title: "Picanha (Sokum Kapağı)",
      animalType: "BUYUKBAS",
      shortDesc: "Brezilya'nın efsanevi barbekü yıldızı, üzerinde kalın şerit bir lezzet yağı tabakası taşıyan dış kesim.",
      content: "Picanha (Pikanya adıyla bilinir), hayvanın sırtının çok az hareket eden arka bölümünden (sokum/rump cap bölgesi) elde edilen benzersiz yumuşaklıkta bir parçadır. Parçanın üstünü kalın ve tek parça halinde kaplayan devasa bir lezzet yağı tabakası vardır. Türkiye'deki klasik kasaplık formatında genellikle bu değerli yağlar temizlenerek tranç veya sokum adıyla kıymalık/kuşbaşılık için karıştırılır. Ancak Brezilya ve Arjantin usulü özel 'Picanha' kesimde bu yağ özellikle üzerinde bırakılır, çünkü ızgarada o yağ eriyip sızarak kırmızı eti adeta kendi yağıyla ziyafet şölenine çevirir.",
      usageTips: "Güney Amerika usulü 'Churrasco' yani iri deniz tuzu parçalarıyla ovularak, el değmeden C harfi şeklinde şişlere dizilmesi meşhurdur. Bu şekilde kömür ateşinde sık sık çevrilerek kendi yağında yavaşça kavrularak servise odaklı pişirilir.",
      imageUrl: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?q=80&w=800",
      coverUrl: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?q=80&w=2000",
      relatedSlugs: ["dana-tranc", "dana-antrikot"],
    },
    {
      slug: "kuzu-uykuluk",
      title: "Kuzu Uykuluk",
      animalType: "KUCUKBAS",
      shortDesc: "Süt kuzusunun boğazından çıkan, sokak lezzetlerinden üst düzey restoranlara (fine-dining) dek uzanan pamuk sakatat.",
      content: "Uykuluk, tıp dilinde timüs bezi (thymus) veya pankreas olarak geçen, sığır ve koyunların boyun ve kalp bölgesinde bulunan eşsiz bir sakatattır (Avrupa'da Sweetbread olarak bilinir). Özellikleri en yüksek seviyesinde olduğu dönemler sütle beslenen kuzu yavrusu dönemidir, zira hayvan ot yemeye başladıkça bu doku zamanla küçülerek kaybolur. İçerisinde kas tendonu bulunmadığı için pamuk şekeri benzeri lifsiz yapıdadır ve damağınızı kaplayan kremsi sütlü bir tat bırakır. Ülkemizde Sütlüce'deki kokoreççilerle efsaneleşmiş samimi bir lezzet olan uykuluk kemiksiz eti, aynı zamanda Fransa gibi Avrupa ülkelerinde Michelin yıldızlı şeflerin imza menülerinde çok lüks bir ana yemektir.",
      usageTips: "Pişirmeden önceki asıl kritik püf nokta; parçanın sirkeli / tuzlu buzlu suda bekletilip üzerindeki o şeffaf sert dış zarının mutlaka soyulmasıdır (Blanching tekniği). Sonrasında tavada dışı hafif çıtırımsı bir kıvama gelene dek yüksek ateşte bol tereyağı ile sotelemek narin dokusunu şaha kaldıran yöntemdir.",
      imageUrl: "https://images.unsplash.com/photo-1603504101977-94a0d922ba14?q=80&w=800", // Grilled placeholder
      coverUrl: "https://images.unsplash.com/photo-1603504101977-94a0d922ba14?q=80&w=2000",
      relatedSlugs: ["kuzu-incik", "dana-dil"],
    },
    {
      slug: "dana-dil",
      title: "Dana Dil",
      animalType: "BUYUKBAS",
      shortDesc: "Uzun saatler boyunca hasretle haşlanıp adeta et şölenine dönüşen, meze ve sandviç kültürünün kraliçesi.",
      content: "Dana Dil, boyutunun bir dezavantajı olarak çok kalın zarlı ve kaslı (sert) görünse de, uzun saatler süren hassas ve sevgi dolu bir haşlama serüveni ile lokum sınırlarını aşabilen enteresan derecede şaşırtıcı bir sakatat çeşididir. Çok zengin yağlara sahiptir ve derinden gelen kalıcı aromatik bir tadı vardır. Tüm dünyada şarküteri menülerinde vazgeçilmezdir; örneğin Meksikalılar Tacos de Lengua adında dillere destan meksika dürümü yaparken, New York kasapları bunu özel yahudi füme pastırmasına çevirirler. Ülkemizde ise hem bol yağlı bir kışlık şifa çorbası hem de meze masasında mükemmel bir soğuk söğüş yemeğidir.",
      usageTips: "Düdüklü tencere olmazsa olmazıdır. Defne yaprağı, bol karabiber ve bir baş sarımsak ile ağır ateşte yavaşça en az 2 saat haşlayın. Et sıcaklığını tamamen kaybetmeden, bıçak yardımıyla o kalın ve sert beyazımsı dış zarını derisinden soymanız gereklidir. Geriye kalan enfes yumuşak iç eti ince ince kesebilir, veya bol tereyağında 3-4 dakika kızartıp dev bir sandviç hazırlayabilirsiniz.",
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800",
      coverUrl: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2000",
      relatedSlugs: ["kuzu-uykuluk", "dana-dosh"],
    }
  ];

  for (const item of exoticGuides) {
    await prisma.meatGuide.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  
  console.log("Yeni sakatatlar ve Egzotik Dünya etleri veritabanına başarıyla yüklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
