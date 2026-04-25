const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating Dana Antrikot...");
  await prisma.meatGuide.updateMany({
    where: { slug: 'dana-antrikot' },
    data: {
      content: `Antrikot kelimesi, Fransızca "entrecôte" (kaburga arası) sözcüğünden gelmektedir. 19. yüzyıl Avrupa gastronomisinde "bifteklerin kralı" unvanını almış ve Paris'in köklü steakhouse geleneğiyle tüm dünyaya yayılmıştır.\n\nAnatomik Yapı: Dananın sırt kısmında, boyun ile kontrfile arasında (Ribeye) yer alır. Bu bölgedeki kaslar hayvan tarafından çok az kullanıldığı için et oldukça yumuşaktır. En belirgin özelliği olan "Mermerleşme" (Marbling), etin kas lifleri arasına işleyen ince yağ damarlarıdır. Antrikot ızgarada pişerken bu yağ damarları eriyerek ete müthiş bir rayiha (aroma) ve sululuk kazandırır. Gastronomi dünyasında etin kalitesi, bu mermerleşmenin yoğunluğuna (Kobe/Wagyu standartlarında olduğu gibi) göre derecelendirilir.`,
      usageTips: `Izgara, döküm tava ve mangal ateşinin şüphesiz en asil eşlikçisidir. Etin içindeki mermerimsi yağların eriyip karamelize olması için yüksek ateşte mühürlenmesi (Maillard Reaksiyonu) şarttır.\n\nTavsiye Edilen Pişirme Tekniği:\nİçi mutlaka orta-az (Medium Rare) veya orta (Medium) bırakılmalıdır. Çok pişirildiğinde (Well-done) içindeki değerli yağlar tamamen akar ve et karakterini yitirir. Döküm tavada pişirilirken son 1 dakikada taze kekik, ezilmiş sarımsak ve kaliteli tereyağı eklenerek "Basting" (yağda yıkama) tekniği uygulanırsa lezzeti zirveye ulaşır.`
    }
  });

  console.log("Updating Kuzu İncik...");
  await prisma.meatGuide.updateMany({
    where: { slug: 'kuzu-incik' },
    data: {
      content: `Kuzu incik, Anadolu ve Mezopotamya yemek kültürünün en köklü ve ritüelistik etlerinden biridir. Osmanlı Saray Mutfağı kayıtlarında, padişahlar için kurulan ziyafet sofralarında (özellikle Şah İsmail gibi elçi kabullerinde) ağır ağır pişirilmiş incik yemeklerinin özel bir yeri olduğu bilinmektedir. Göçebe Türklerin toprağa kazılan tandır kuyularında saatlerce et pişirme geleneğinin en lezzetli mirasçısıdır.\n\nAnatomik Yapı: Kuzunun diz eklemi ile paça bölgesi arasındaki kısımdır. Hayvan sürekli ayakları üzerinde durup hareket ettiği için bu bölgedeki bağ dokusu (tendonlar) çok güçlü ve serttir. Ancak bu sert yapı, ilik ve kolajen açısından bir doğa mucizesidir. Çiğken sert olan bu et, düşük ısıda uzun süreli (slow-cooking) pişirime girdiğinde içindeki tüm kolajen eriyerek jelatinleşir ve eti kemikten kendiliğinden düşecek kadar lokum kıvamına getirir.`,
      usageTips: `Sabır isteyen bir ettir, asla hızlı ve yüksek ateşte pişirilmemelidir. Fırında düşük ısıda (140-160°C) ağır pişirme, güveçte kapalı veya sous-vide tekniğiyle hazırlanması idealdir.\n\nTavsiye Edilen Pişirme Tekniği:\nÖnce yüksek ateşte dışı hızlıca mühürlenip rengi karamelize edilir. Ardından kök sebzeler (havuç, kereviz sapı, soğan), taze biberiye ve kaliteli bir kemik suyu ile fırın poşetinde (veya kapağı kapalı döküm tencerede) en az 3-4 saat fırınlanması önerilir. Pişme suyu süzülüp hafifçe çektirilerek eti tamamlayan muazzam bir "Demi-Glace" sos elde edilebilir.`
    }
  });

  console.log("Updating Dana Bonfile...");
  await prisma.meatGuide.updateMany({
    where: { slug: 'dana-bonfile' },
    data: {
      content: `Bonfile, sofra kültürünün ebedi asalet sembolüdür. Adını Fransızca "bon filet" (iyi/güzel fileto) kelimesinden alır. Tarih boyunca Avrupa aristokrasisinin sofralarını süslemiş, özellikle İngiliz Dükü Wellington onuruna yaratıldığı rivayet edilen milföy hamuruna sarılı "Beef Wellington" gibi tarihi reçetelerle gastronomi efsanesi olmuştur.\n\nAnatomik Yapı: Hayvanın anatomisinde bel omurgasının iki yanında, böbrek yatağına paralel olarak uzanan Psoas Major kasıdır. Bu kas hayvan yürüdüğünde veya hareket ettiğinde hiçbir şekilde yük taşımaz. Çalışmayan kasların bağ dokusu gelişmediğinden ötürü, bonfile hayvanın tartışmasız EN YUMUŞAK, en narin ve sinirsiz (tamamen lop) etidir. Yağ oranı antrikota göre çok düşüktür; lezzeti yoğun bir yağdan değil etin pamuksu saf dokusundan ve özsuyundan gelir. 500-600 kg'lık dev bir danadan sadece 1.5 - 2 kg civarında bonfile çıkar, bu sebeple en nadide ve kıymetli bölümdür.`,
      usageTips: `Genellikle Thick-cut (kalın madalyon) veya Château şeklinde kesilip şekil verilerek tüketilir. Çok yumuşak ve tamamen yağsız kuruyan bir et olduğu için kesinlikle uzun süre pişirilmemelidir.\n\nTavsiye Edilen Pişirme Tekniği:\nYüksek ısıda (tavada veya ızgarada) sadece dışı hızlıca mühürlenip (kabuklaştırma), içi kesinlikle Rare veya en fazla Medium-Rare (Az-Orta) bırakılmalıdır. Bonfilenin ince lifli ve sade lezzeti soslarla mükemmel uyum sağlar. Mühürlemenin ardından Fransız usulü zengin soslarla servis etmek klasiktir; Cafe de Paris sosu, Trüf Mantarı sosu, Rokfor (Blue Cheese) veya Tane Karabiber sosu bonfileyle muazzam bir uyum yakalar. Etin pamuk gibi dokusunu kaybetmemek için kesmeden önce 5-8 dakika tahtada dinlendirmek şarttır.`
    }
  });

  console.log("Veritabanı blog/rehber güncellemeleri tamamlandı!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
