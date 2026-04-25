import type { Metadata } from "next";
import { ArrowLeft, Check, ChevronRight, Award, ShieldCheck, Leaf, Star, Flame, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BreedGallery } from "@/components/hayvanlarimiz/BreedGallery";

export const metadata: Metadata = {
  title: "Hayvanlarımız & Kalite Standartları — Erdoğan Kasap",
  description: "Erdoğan Kasap'ın sunduğu premium büyükbaş ve küçükbaş ırklarını inceleyin. Angus, Simental ve daha fazlası.",
};

const breeds = [
  {
    id: "angus",
    name: "Black Angus",
    subtitle: "Dünyanın En Prestijli Et Irkı",
    description: "Mükemmel mermerleşme (yağ dağılımı) oranı sayesinde eşsiz bir yumuşaklığa ve aromaya sahiptir. Özel steakhouse menülerinin vazgeçilmezidir.",
    images: [
      "/generated/angus.png",
      "https://images.unsplash.com/photo-1485030056468-3820ff9e6e90?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "Üstün Derece (A+)" },
      { label: "Et Verimliliği", value: "%65 - %70" },
      { label: "Yetişme Ortamı", value: "Serbest Mera" },
      { label: "Lezzet Profili", value: "Yoğun, Tereyağsı" },
    ],
    features: ["Homojen yağ dağılımı", "Erken yaşta olgunlaşma", "Yüksek porsiyon verimi", "Kuru dinlendirmeye (Dry-Age) en uygun yapı"],
    accentColor: "text-amber-500",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
    glowColor: "shadow-amber-500/10"
  },
  {
    id: "simental",
    name: "Simental (Fleckvieh)",
    subtitle: "Asil ve Doyurucu",
    description: "Kökeni İsviçre olan bu ırk, hem etinin dolgunluğu hem de düşük dış yağ oranıyla bilinir. Dengeli ve hafif bir et deneyimi sunar.",
    images: [
      "/generated/simental.png",
      "https://images.unsplash.com/photo-1527153857715-3938af4229da?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "İyi Derece (A)" },
      { label: "Et Verimliliği", value: "%60 - %62" },
      { label: "Yetişme Ortamı", value: "Yarı Açık Ahır / Mera" },
      { label: "Lezzet Profili", value: "Hafif, Doğal" },
    ],
    features: ["Düşük dış kabuk yağı", "İri kas yapısı ve doyurucu lifler", "Kemikli etler için mükemmel yapı", "Dengeli beslenme profili"],
    accentColor: "text-sky-400",
    borderColor: "border-sky-400/20",
    bgColor: "bg-sky-400/5",
    glowColor: "shadow-sky-400/10"
  },
  {
    id: "yerlikara",
    name: "Yerli Kara",
    subtitle: "Anadolu'nun Otantik Lezzeti",
    description: "Anadolu'nun sert iklimine uyum sağlamış kadim ırk. Doğal otlak beslemesinden gelen yoğun et aroması ve geleneksel Türk yemekleri için benzersiz bir karakter sunar.",
    images: [
      "/generated/yerlikara.png",
      "https://images.unsplash.com/photo-1582845512747-e42001c95638?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "Orta Derece (B+)" },
      { label: "Et Verimliliği", value: "%52 - %56" },
      { label: "Yetişme Ortamı", value: "Doğal Otlak / Mera" },
      { label: "Lezzet Profili", value: "Yoğun, Otsu Aroma" },
    ],
    features: ["Doğal otlak aroması", "Güçlü bağışıklık ve dayanıklılık", "Geleneksel Türk mutfağı için ideal", "Düşük dış yağ, kompakt kas yapısı"],
    accentColor: "text-emerald-500",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    glowColor: "shadow-emerald-500/10"
  },
  {
    id: "limuzin",
    name: "Limuzin (Limousin)",
    subtitle: "Güç ve Verimlilik",
    description: "Fransa kökenli bu ırk, düşük dış yağ oranı ve yüksek kas kütlesiyle bilinir. İri porsiyon verimliliği ve temiz, yoğun et lezzetiyle profesyonel mutfakların favorisidir.",
    images: [
      "/generated/limuzin.png",
      "https://images.unsplash.com/photo-1546452286-4d0afad34cd1?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "İyi Derece (A-)" },
      { label: "Et Verimliliği", value: "%65 - %70" },
      { label: "Yetişme Ortamı", value: "Yarı Açık Ahır / Mera" },
      { label: "Lezzet Profili", value: "Temiz, Yoğun" },
    ],
    features: ["En yüksek et verimliliği sınıfı", "Düşük dış yağ oranı", "İri ve düzgün kas yapısı", "Kemikli kesimlerde üstün porsiyon"],
    accentColor: "text-purple-400",
    borderColor: "border-purple-400/20",
    bgColor: "bg-purple-400/5",
    glowColor: "shadow-purple-400/10"
  }
];

const kucukbasBreeds = [
  {
    id: "kivircik",
    name: "Kıvırcık Koyun",
    subtitle: "Trakya'nın Gururu, Eşsiz Mermerleşme",
    description: "Özellikle Marmara ve Trakya bölgesinde doğal bitki örtüsüyle otlayan Kıvırcık koyunları, etindeki mükemmel ince yağ dağılımı (mermerleşme) ile ünlüdür. Koku oranı piyasadaki en düşük ırktır.",
    images: [
      "/generated/kivircik.png",
      "https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "Üstün Derece (A+)" },
      { label: "Et Verimliliği", value: "%50 - %55" },
      { label: "Yetişme Ortamı", value: "Doğal Mera (Trakya)" },
      { label: "Lezzet Profili", value: "Yumuşak, Kokusuz" },
    ],
    features: ["Etin içinde dağılan homojen yağ", "Kokusuz ve son derece hafif tat", "Pirzola ve fırın rosto yemeklerinde 1 numara", "Hızlı pişirme yöntemlerine çok uygun"],
    accentColor: "text-rose-400",
    borderColor: "border-rose-400/20",
    bgColor: "bg-rose-400/5",
    glowColor: "shadow-rose-400/10"
  },
  {
    id: "karaman",
    name: "Akkaraman / Morkaraman",
    subtitle: "Geleneksel Kebabın Ham Maddesi",
    description: "Anadolu coğrafyasının en dayanıklı ve klasik küçükbaş ırkı. Kuyruk yağı bakımından oldukça zengindir ve etinin kendine has yöresel, yoğun bir karakteri (aroması) vardır.",
    images: [
      "/generated/karaman.png",
      "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "Normal Derece (B)" },
      { label: "Et Verimliliği", value: "%45 - %50" },
      { label: "Yetişme Ortamı", value: "İç / Doğu Anadolu" },
      { label: "Lezzet Profili", value: "Yoğun, Geleneksel" },
    ],
    features: ["Kebap yapımı için ideal doğal kuyruk yağı", "Uzun süre pişen yöresel sulu yemeklere uygunluk", "Güveç ve haşlamalarda yoğun Anadolu lezzeti", "Sert iklimin verdiği dayanıklı kas yapısı"],
    accentColor: "text-orange-500",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    glowColor: "shadow-orange-500/10"
  },
  {
    id: "merinos",
    name: "Merinos",
    subtitle: "Yüksek Verim ve İri Porsiyon",
    description: "Aslen yünüyle meşhur olsa da et yönünde çok başarılı melezlemelerle elde edilmiş bir ırktır. Kas dokusu iri ve kalındır. Doyurucu, temiz bir et profiline sahiptir.",
    images: [
      "/generated/merinos.png",
      "https://images.unsplash.com/photo-1618683508608-8e811c7eed46?w=800"
    ],
    stats: [
      { label: "Mermerleşme", value: "İyi Derece (B+)" },
      { label: "Et Verimliliği", value: "%55 - %60" },
      { label: "Yetişme Ortamı", value: "Yarı Açık Ahır" },
      { label: "Lezzet Profili", value: "Temiz, Doyurucu" },
    ],
    features: ["Büyük porsiyonlu but ve kollar", "Etli ve etrafı yağla kaplı kalın pirzolalar", "Hızlı gelişim ve körpe lifler", "Kalabalık sofralar için alınan bütün etlerin bereketliliği"],
    accentColor: "text-teal-400",
    borderColor: "border-teal-400/20",
    bgColor: "bg-teal-400/5",
    glowColor: "shadow-teal-400/10"
  }
];

// Irk ID'sinden breed key'e map
const breedKeyMap: Record<string, string> = {
  angus: "angus",
  simental: "simental",
  yerlikara: "yerlikara",
  limuzin: "limuzin",
  kivircik: "kivircik",
  karaman: "karaman",
  merinos: "merinos",
};

interface BreedRec {
  rating: number;
  why: string;
  bestCooking: string[];
  avoid: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "text-antique-gold fill-antique-gold" : "text-white/20"}
        />
      ))}
    </div>
  );
}

export default async function HayvanlarimizPage() {
  let guides: any[] = [];
  try {
    guides = await prisma.meatGuide.findMany({
      orderBy: { title: "asc" },
    });
  } catch {
    // DB bağlantısı yoksa boş dizi ile devam
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-charcoal-black" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: 'url("/images/breed_angus_1773877148555.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/80 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-antique-gold/10 text-antique-gold text-sm font-semibold mb-6 border border-antique-gold/20 backdrop-blur-md">
            <Award size={18} />
            Erdoğan Kasap Premium Seçimi
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-ivory mb-6 tracking-tight">
            Hayvanlarımız.
          </h1>
          <p className="text-lg md:text-xl text-ivory/70 leading-relaxed max-w-2xl mx-auto">
            Sadece kurban döneminde değil, yılın 365 günü en iyi şeflerin ve damak tadına düşkünlerin tercihi olan elit ırklarımızı yakından tanıyın. Kalite, ırkta başlar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-charcoal-black">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ivory mb-6">Özel Seçim Büyükbaş Irklarımız</h2>
            <p className="text-ivory/60 max-w-2xl mx-auto">Ustalarımız tarafından Türkiye'nin en iyi çiftliklerinden özenle seçilen büyükbaş hayvanlarımız, sofranıza sadece lezzet değil güven de getirir.</p>
          </div>

          <div className="space-y-32">
            {breeds.map((breed: any, index) => {
              // Bu ırk için önerilen etleri filtrele (rating >= 3)
              const breedKey = breedKeyMap[breed.id];
              const recommendedGuides = guides
                .filter((g: any) => {
                  const recs = g.breedRecommendations as Record<string, BreedRec> | null;
                  return recs && recs[breedKey] && recs[breedKey].rating >= 3;
                })
                .sort((a: any, b: any) => {
                  const aRec = (a.breedRecommendations as Record<string, BreedRec>)[breedKey];
                  const bRec = (b.breedRecommendations as Record<string, BreedRec>)[breedKey];
                  return bRec.rating - aRec.rating;
                })
                .slice(0, 4); // En iyi 4 et

              return (
                <div key={breed.id} className="space-y-12">
                  <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                      <BreedGallery images={breed.images} alt={breed.name} name={breed.name} />
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                      <p className="text-ivory/70 text-lg leading-relaxed">
                        {breed.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        {breed.stats.map((stat: any, i: number) => (
                          <div key={i} className={`${breed.bgColor} ${breed.borderColor} border p-4 rounded-2xl transition-all duration-500 hover:${breed.glowColor} hover:shadow-lg hover:shadow-current/5`}>
                            <div className="text-xs text-ivory/50 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className={`text-lg font-display font-semibold ${breed.accentColor}`}>{stat.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-sm font-semibold text-ivory mb-4 uppercase tracking-wider">Erdoğan Kasap Farkı</h4>
                        <ul className="space-y-3">
                          {breed.features.map((feature: any, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-ivory/80 group">
                              <Check className={`${breed.accentColor} shrink-0 mt-0.5 transition-all group-hover:scale-110`} size={18} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Irka Özel Et Önerileri */}
                  {recommendedGuides.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center gap-3 mb-6 font-display">
                        <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${breed.accentColor?.split('-')[1] || 'white'}-500/20 to-transparent`} />
                        <h4 className={`text-lg font-semibold ${breed.accentColor} whitespace-nowrap flex items-center gap-2`}>
                          <Flame size={18} />
                          {breed.name} İçin Önerilen Etlerimiz
                        </h4>
                        <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${breed.accentColor?.split('-')[1] || 'white'}-500/20 to-transparent`} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommendedGuides.map((guide: any) => {
                          const rec = (guide.breedRecommendations as Record<string, BreedRec>)[breedKey];
                          return (
                            <Link
                              key={guide.id}
                              href={`/rehber/${guide.slug}`}
                              className="group block bg-taupe-surface border border-white/5 rounded-2xl overflow-hidden hover:border-antique-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(197,160,89,0.12)]"
                            >
                              {/* Card Image */}
                              <div className="h-36 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={guide.imageUrl || "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400"}
                                  alt={guide.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 right-3 z-20">
                                  <StarRating rating={rec.rating} />
                                </div>
                                <div className="absolute bottom-3 left-3 z-20">
                                  <h5 className="text-white font-display font-semibold text-sm drop-shadow-lg">{guide.title}</h5>
                                </div>
                              </div>
                              {/* Card Body */}
                              <div className="p-4 space-y-3">
                                <p className="text-ivory/60 text-xs leading-relaxed line-clamp-2">{rec.why}</p>
                                {/* Best Cooking */}
                                <div className="flex flex-wrap gap-1.5">
                                  {rec.bestCooking.map((c: string, i: number) => (
                                    <span key={i} className="text-[10px] bg-antique-gold/10 text-antique-gold px-2 py-0.5 rounded-full border border-antique-gold/20">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                                {/* Avoid */}
                                {rec.avoid && (
                                  <div className="flex items-start gap-1.5 text-[10px] text-red-400/70">
                                    <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{rec.avoid}</span>
                                  </div>
                                )}
                                <div className="flex items-center text-antique-gold text-xs font-medium gap-1 pt-1">
                                  Detayları İncele <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-32 mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ivory mb-6">Özel Seçim Küçükbaş Irklarımız</h2>
            <p className="text-ivory/60 max-w-2xl mx-auto">Anadolu'nun ve Trakya'nın en verimli meralarından özenle seçtiğimiz koyun ve kuzu ırkları, geleneksel mutfak kültürümüzün vazgeçilmezidir.</p>
          </div>

          <div className="space-y-32">
            {kucukbasBreeds.map((breed: any, index) => {
              // Bu ırk için önerilen etleri filtrele (rating >= 3)
              const breedKey = breedKeyMap[breed.id];
              const recommendedGuides = guides
                .filter((g: any) => {
                  const recs = g.breedRecommendations as Record<string, BreedRec> | null;
                  return recs && recs[breedKey] && recs[breedKey].rating >= 3;
                })
                .sort((a: any, b: any) => {
                  const aRec = (a.breedRecommendations as Record<string, BreedRec>)[breedKey];
                  const bRec = (b.breedRecommendations as Record<string, BreedRec>)[breedKey];
                  return bRec.rating - aRec.rating;
                })
                .slice(0, 4); // En iyi 4 et

              return (
                <div key={breed.id} className="space-y-12">
                  <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                      <BreedGallery images={breed.images} alt={breed.name} name={breed.name} />
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                      <p className="text-ivory/70 text-lg leading-relaxed">
                        {breed.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        {breed.stats.map((stat: any, i: number) => (
                          <div key={i} className={`${breed.bgColor} ${breed.borderColor} border p-4 rounded-2xl transition-all duration-500 hover:${breed.glowColor} hover:shadow-lg hover:shadow-current/5`}>
                            <div className="text-xs text-ivory/50 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className={`text-lg font-display font-semibold ${breed.accentColor}`}>{stat.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-sm font-semibold text-ivory mb-4 uppercase tracking-wider">Erdoğan Kasap Farkı</h4>
                        <ul className="space-y-3">
                          {breed.features.map((feature: any, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-ivory/80 group">
                              <Check className={`${breed.accentColor} shrink-0 mt-0.5 transition-all group-hover:scale-110`} size={18} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Irka Özel Et Önerileri */}
                  {recommendedGuides.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center gap-3 mb-6 font-display">
                        <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${breed.accentColor?.split('-')[1] || 'white'}-500/20 to-transparent`} />
                        <h4 className={`text-lg font-semibold ${breed.accentColor} whitespace-nowrap flex items-center gap-2`}>
                          <Flame size={18} />
                          {breed.name} İçin Önerilen Kuzu Eti Kesimleri
                        </h4>
                        <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${breed.accentColor?.split('-')[1] || 'white'}-500/20 to-transparent`} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommendedGuides.map((guide: any) => {
                          const rec = (guide.breedRecommendations as Record<string, BreedRec>)[breedKey];
                          return (
                            <Link
                              key={guide.id}
                              href={`/rehber/${guide.slug}`}
                              className="group block bg-taupe-surface border border-white/5 rounded-2xl overflow-hidden hover:border-antique-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(197,160,89,0.12)]"
                            >
                              {/* Card Image */}
                              <div className="h-36 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={guide.imageUrl || "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400"}
                                  alt={guide.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 right-3 z-20">
                                  <StarRating rating={rec.rating} />
                                </div>
                                <div className="absolute bottom-3 left-3 z-20">
                                  <h5 className="text-white font-display font-semibold text-sm drop-shadow-lg">{guide.title}</h5>
                                </div>
                              </div>
                              {/* Card Body */}
                              <div className="p-4 space-y-3">
                                <p className="text-ivory/60 text-xs leading-relaxed line-clamp-2">{rec.why}</p>
                                {/* Best Cooking */}
                                <div className="flex flex-wrap gap-1.5">
                                  {rec.bestCooking.map((c: string, i: number) => (
                                    <span key={i} className="text-[10px] bg-antique-gold/10 text-antique-gold px-2 py-0.5 rounded-full border border-antique-gold/20">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                                {/* Avoid */}
                                {rec.avoid && (
                                  <div className="flex items-start gap-1.5 text-[10px] text-red-400/70">
                                    <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{rec.avoid}</span>
                                  </div>
                                )}
                                <div className="flex items-center text-antique-gold text-xs font-medium gap-1 pt-1">
                                  Detayları İncele <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-taupe-surface border-t border-white/5 relative overflow-hidden">
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] bg-antique-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] bg-antique-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Leaf size={40} className="text-antique-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ivory mb-8">Neden Sadece Belirli Irklar?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <ShieldCheck className="text-ivory/50 mx-auto mb-4" size={32} />
              <h4 className="text-lg font-display font-semibold text-ivory mb-2">Genetik Miras</h4>
              <p className="text-sm text-ivory/60 leading-relaxed">Etin kalitesi hayvanın genetiğinde başlar. Sadece et verimliliği ve lezzeti kanıtlanmış ırklarla çalışıyoruz.</p>
            </div>
            <div>
              <Award className="text-ivory/50 mx-auto mb-4" size={32} />
              <h4 className="text-lg font-display font-semibold text-ivory mb-2">Sürdürülebilir Kalite</h4>
              <p className="text-sm text-ivory/60 leading-relaxed">Müşterilerimize her siparişte aynı yüksek standardı sunabilmek için kas yapısı tahmin edilebilir ırkları tercih ediyoruz.</p>
            </div>
            <div>
              <Check className="text-ivory/50 mx-auto mb-4" size={32} />
              <h4 className="text-lg font-display font-semibold text-ivory mb-2">Doğal Mermerleşme</h4>
              <p className="text-sm text-ivory/60 leading-relaxed">Özellikle Angus gibi ırklar, yağı kas arasına eşsiz bir şekilde dağıtarak etin suni bir müdahale olmadan yumuşamasına olanak tanır.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
