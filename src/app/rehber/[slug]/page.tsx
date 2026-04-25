import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChefHat, Info, Home, ChevronRight, Star, AlertTriangle, Flame, CheckCircle2, ShoppingCart, ShoppingBag } from "lucide-react";
import Isometric3DAnatomy from "@/components/rehber/Isometric3DAnatomy";
import type { Metadata } from "next";

export const revalidate = 3600;

// Dinamik SEO Metadata
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const guide = await prisma.meatGuide.findUnique({ where: { slug: params.slug } });
  if (!guide) return { title: "Et Rehberi — Erdoğan Kasap" };
  return {
    title: `${guide.title} — Et Rehberi | Erdoğan Kasap`,
    description: guide.shortDesc,
    openGraph: { title: guide.title, description: guide.shortDesc, images: guide.coverUrl ? [guide.coverUrl] : undefined },
  };
}

export async function generateStaticParams() {
  try {
    const guides = await prisma.meatGuide.findMany({ select: { slug: true } });
    return guides.map((guide: { slug: string }) => ({ slug: guide.slug }));
  } catch (error) {
    console.warn("DB not ready during build phase, skipping pre-rendering.");
    return [];
  }
}

// ── Irk bilgileri (statik, breed ID → display data) ──────────────────────
const BREED_META: Record<string, { name: string; emoji: string; color: string; bgColor: string; borderColor: string }> = {
  angus:     { name: "Black Angus",        emoji: "🐄", color: "text-amber-400",  bgColor: "bg-amber-950/40",  borderColor: "border-amber-700/40" },
  simental:  { name: "Simental",           emoji: "🐂", color: "text-sky-400",    bgColor: "bg-sky-950/40",    borderColor: "border-sky-700/40"   },
  yerlikara: { name: "Yerli Kara",         emoji: "🐃", color: "text-green-400",  bgColor: "bg-green-950/40",  borderColor: "border-green-700/40" },
  limuzin:   { name: "Limuzin",            emoji: "🐎", color: "text-purple-400", bgColor: "bg-purple-950/40", borderColor: "border-purple-700/40"},
  kivircik:  { name: "Kıvırcık",           emoji: "🐑", color: "text-rose-400",   bgColor: "bg-rose-950/40",   borderColor: "border-rose-700/40"  },
  karaman:   { name: "Karaman",            emoji: "🐑", color: "text-orange-400", bgColor: "bg-orange-950/40", borderColor: "border-orange-700/40"},
  merinos:   { name: "Merinos",            emoji: "🐑", color: "text-emerald-400",bgColor: "bg-emerald-950/40",borderColor: "border-emerald-700/40"},
};

interface BreedRec {
  rating: number;
  why: string;
  bestCooking: string[];
  avoid: string;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? "text-[var(--antique-gold)] fill-[var(--antique-gold)]" : "text-white/15 fill-white/5"}
        />
      ))}
    </div>
  );
}

function RatingBar({ rating }: { rating: number }) {
  const pct = (rating / 5) * 100;
  const colorClass =
    rating >= 5 ? "from-amber-400 to-yellow-300" :
    rating >= 4 ? "from-green-400 to-emerald-300" :
    rating >= 3 ? "from-sky-400 to-blue-300" :
    "from-red-400 to-rose-300";
  return (
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function GuideDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const guide = await prisma.meatGuide.findUnique({ where: { slug: params.slug } });
  if (!guide) return notFound();

  const [relatedGuides, linkedProducts, additions, allAnatomyProducts] = await Promise.all([
    prisma.meatGuide.findMany({ where: { slug: { in: guide.relatedSlugs } } }),
    prisma.product.findMany({ where: { meatGuideSlug: params.slug, inStock: true } }),
    prisma.addition.findMany({ where: { inStock: true } }),
    prisma.product.findMany({ where: { meatGuideSlug: { not: null }, inStock: true } })
  ]);

  const defaultChefTip = "Kırmızı etleri pişirmeden önce oda sıcaklığına gelmesi için 30 dakika dışarıda bekletmek, suyunu hapsetmesi açısından kritik bir detaydır. Kesinlikle soğukken tavaya atmayınız.";

  const breedRecs = guide.breedRecommendations as Record<string, BreedRec> | null;

  // Sadece rating > 0 olan ırkları göster (büyükbaş et ise kuzu geçersiz)
  const validBreeds = breedRecs
    ? Object.entries(breedRecs)
        .filter(([, rec]) => rec.rating > 0)
        .sort(([, a], [, b]) => b.rating - a.rating)
    : [];

  return (
    <main className="min-h-screen bg-[var(--deep-espresso)]">
      {/* Hero Header */}
      <div className="h-[50vh] min-h-[400px] relative flex items-center justify-center">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={guide.coverUrl || guide.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d"} 
            alt={guide.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--deep-espresso)] via-black/60 to-black/20" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <div className="inline-block bg-[var(--antique-gold)]/20 text-[var(--antique-gold)] border border-[var(--antique-gold)]/30 px-6 py-2 rounded-full font-bold tracking-widest text-sm mb-6">
            {guide.animalType === "BUYUKBAS" ? "BÜYÜKBAŞ (DANA)" : "KÜÇÜKBAŞ (KUZU)"}
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 drop-shadow-2xl">{guide.title}</h1>
          <p className="text-xl text-[var(--ivory)]/90 drop-shadow-md font-light leading-relaxed">
            {guide.shortDesc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--ivory)]/50 mb-10 bg-[var(--taupe-surface)] px-5 py-2.5 rounded-full border border-[var(--antique-gold)]/10 shadow-lg w-fit">
          <Link href="/" className="hover:text-[var(--antique-gold)] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Ana Sayfa
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/rehber" className="hover:text-[var(--antique-gold)] transition-colors">Et Rehberi</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--antique-gold)] font-medium">{guide.title}</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-[var(--taupe-surface)] backdrop-blur-xl border border-[var(--antique-gold)]/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--antique-gold)]/10 flex items-center justify-center">
                  <Info className="w-6 h-6 text-[var(--antique-gold)]" />
                </div>
                <h2 className="text-3xl font-display text-[var(--antique-gold)]">Etin Yapısı ve Kökeni</h2>
              </div>
              <p className="text-[var(--ivory)]/80 text-lg leading-relaxed whitespace-pre-line">
                {guide.content}
              </p>
            </section>

            <section className="bg-gradient-to-br from-[var(--taupe-surface)] to-[var(--deep-espresso)] border border-[var(--antique-gold)]/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--antique-gold)]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[var(--antique-gold)]/10 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-[var(--antique-gold)]" />
                </div>
                <h2 className="text-3xl font-display text-[var(--antique-gold)]">Nelerde Kullanılır?</h2>
              </div>
              <p className="text-[var(--ivory)]/80 text-lg leading-relaxed relative z-10 whitespace-pre-line">
                {guide.usageTips}
              </p>
              
              {/* Şefin İpucu */}
              <div className="mt-10 bg-[var(--antique-gold)]/10 border border-[var(--antique-gold)]/20 rounded-xl p-6 relative z-10">
                <p className="text-[var(--antique-gold)] font-medium flex items-center gap-2">
                  <ChefHat className="w-5 h-5" /> Şefin İpucu:
                </p>
                <p className="text-[var(--ivory)]/70 text-sm mt-2 leading-relaxed">
                  {guide.chefTip || defaultChefTip}
                </p>
              </div>
            </section>

            {/* ── IRKI KARŞILAŞTIRMA BÖLÜMÜ ── */}
            {validBreeds.length > 0 && (
              <section className="bg-[var(--taupe-surface)] border border-[var(--antique-gold)]/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[var(--antique-gold)]/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[var(--antique-gold)]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display text-[var(--antique-gold)]">Irk Karşılaştırması</h2>
                    <p className="text-[var(--ivory)]/50 text-sm mt-1">Hangi ırk bu et için daha uygun?</p>
                  </div>
                </div>

                {/* Özet bar chart */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 p-5 bg-black/20 rounded-2xl border border-white/5">
                  {validBreeds.map(([key, rec]) => {
                    const meta = BREED_META[key];
                    if (!meta) return null;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-lg w-6 text-center">{meta.emoji}</span>
                        <span className={`text-xs font-semibold ${meta.color} w-24 shrink-0`}>{meta.name}</span>
                        <div className="flex-1">
                          <RatingBar rating={rec.rating} />
                        </div>
                        <span className="text-xs text-[var(--ivory)]/40 w-6 text-right">{rec.rating}/5</span>
                      </div>
                    );
                  })}
                </div>

                {/* Detay kartları */}
                <div className="space-y-4">
                  {validBreeds.map(([key, rec]) => {
                    const meta = BREED_META[key];
                    if (!meta) return null;
                    const isTop = rec.rating === 5;
                    return (
                      <div
                        key={key}
                        className={`rounded-2xl border p-5 sm:p-6 transition-all ${meta.bgColor} ${meta.borderColor} ${isTop ? "ring-1 ring-[var(--antique-gold)]/30" : ""}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{meta.emoji}</span>
                            <span className={`font-display font-semibold text-lg ${meta.color}`}>{meta.name}</span>
                            {isTop && (
                              <span className="text-[10px] font-bold tracking-widest bg-[var(--antique-gold)] text-[var(--deep-espresso)] px-2 py-0.5 rounded-full ml-1">
                                EN İYİ UYUM
                              </span>
                            )}
                          </div>
                          <StarRating rating={rec.rating} size={15} />
                        </div>

                        {/* Why */}
                        <p className="text-[var(--ivory)]/75 text-sm leading-relaxed mb-4">{rec.why}</p>

                        <div className="flex flex-wrap gap-4">
                          {/* Best Cooking */}
                          {rec.bestCooking.length > 0 && (
                            <div className="flex-1 min-w-[160px]">
                              <p className="text-[10px] uppercase tracking-widest text-[var(--ivory)]/40 mb-2 flex items-center gap-1">
                                <CheckCircle2 size={10} className="text-green-400" /> Önerilen Yöntem
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {rec.bestCooking.map((c, i) => (
                                  <span key={i} className="text-[11px] bg-green-500/10 text-green-300 px-2 py-0.5 rounded-full border border-green-500/20">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Avoid */}
                          {rec.avoid && (
                            <div className="flex-1 min-w-[160px]">
                              <p className="text-[10px] uppercase tracking-widest text-[var(--ivory)]/40 mb-2 flex items-center gap-1">
                                <AlertTriangle size={10} className="text-red-400" /> Kaçınılması Gereken
                              </p>
                              <p className="text-[11px] text-red-300/80 leading-relaxed">{rec.avoid}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hayvanlarımız linki */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <p className="text-[var(--ivory)]/50 text-sm">Irklarımız hakkında daha fazla bilgi almak ister misiniz?</p>
                  <Link
                    href="/hayvanlarimiz"
                    className="inline-flex items-center gap-2 text-[var(--antique-gold)] hover:text-yellow-400 font-medium text-sm transition-colors group"
                  >
                    Hayvanlarımız <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>
            )}
            
            {/* Anatomi Haritası */}
            <section className="mt-12 animate-slide-up">
              <Isometric3DAnatomy 
                animalType={guide.animalType} 
                activeSlug={guide.slug} 
                products={allAnatomyProducts}
                additions={additions}
              />
            </section>
          </div>

          {/* Sidebar - Commercial Cross Sell */}
          <div className="lg:col-span-1 space-y-8">
            {/* SATIN ALMA PANELİ (NEW) */}
            <div className="bg-gradient-to-br from-antique-gold/20 to-transparent border border-antique-gold/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-antique-gold/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
               
               <h3 className="text-xl font-display text-white mb-6 flex items-center gap-2">
                 <ShoppingCart className="text-antique-gold" size={20} />
                 Sofranıza Getirelim
               </h3>

               {linkedProducts.length > 0 ? (
                 <div className="space-y-4">
                   {linkedProducts.map((p) => (
                     <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-antique-gold/40 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-ivory font-bold text-sm">{p.name}</h4>
                          <span className="text-antique-gold font-display font-bold">₺{p.price}</span>
                        </div>
                        <p className="text-[10px] text-ivory/40 mb-4">{p.unit} Birim Fiyatıdır</p>
                        
                        <div className="flex items-center gap-2">
                           {p.isCookable && (
                             <div className="flex items-center gap-1 text-[9px] bg-orange-500/10 text-orange-400 px-2 py-1 rounded-md border border-orange-500/20">
                               <Flame size={10} /> Pişirilebilir
                             </div>
                           )}
                           <div className="flex items-center gap-1 text-[9px] bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                               <CheckCircle2 size={10} /> Stokta
                           </div>
                        </div>

                        <Link 
                          href="/urunler"
                          className="w-full mt-4 flex justify-center items-center gap-2 bg-antique-gold text-deep-espresso text-xs font-bold py-2.5 rounded-xl hover:bg-white transition-all"
                        >
                          Hemen İncele
                        </Link>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-6 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-ivory/40 text-xs leading-relaxed">
                      Bu kesim için şu an stokta hazır paket bulunmuyor. Özel sipariş için bizi arayabilirsiniz.
                    </p>
                 </div>
               )}

               <p className="text-[10px] text-ivory/30 mt-6 text-center italic">
                 * Tüm etlerimiz soğuk zincir bozulmadan, özel vakumlu paketlerde teslim edilir.
               </p>
            </div>

            <div className="bg-[var(--taupe-surface)] border border-[var(--antique-gold)]/10 rounded-3xl p-8 shadow-xl sticky top-28">
               <h3 className="text-xl font-display text-white mb-6 border-b border-[var(--antique-gold)]/10 pb-4">
                Bunu Da Deneyebilirsiniz
              </h3>

              {relatedGuides.length > 0 ? (
                <div className="space-y-6">
                  {relatedGuides.map((rel: any) => (
                    <Link key={rel.id} href={`/rehber/${rel.slug}`} className="group block">
                      <div className="flex gap-4 items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={rel.imageUrl || ""} 
                          alt={rel.title} 
                          className="w-20 h-20 rounded-xl object-cover border border-[var(--antique-gold)]/10"
                        />
                        <div>
                          <h4 className="text-white font-medium group-hover:text-[var(--antique-gold)] transition-colors">{rel.title}</h4>
                          <span className="text-[var(--ivory)]/50 text-xs uppercase tracking-wider mt-1 block">
                            {rel.animalType === "BUYUKBAS" ? "DANA" : "KUZU"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--ivory)]/50 text-sm">Şu an için benzer bir öneri bulunmuyor.</p>
              )}

              <div className="mt-10 pt-6 border-t border-[var(--antique-gold)]/10">
                <Link href="/sepet" className="w-full flex justify-center items-center gap-2 bg-[var(--antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                  Sepete Ek Et Ekle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
