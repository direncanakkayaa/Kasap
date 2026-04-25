"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Beef, ArrowRight, Search, Star } from "lucide-react";

const TABS = [
  { key: "hepsi", label: "Tümü" },
  { key: "BUYUKBAS", label: "🐄 Büyükbaş" },
  { key: "KUCUKBAS", label: "🐑 Küçükbaş" },
];

const BREED_BADGES: Record<string, { label: string; color: string }> = {
  angus:     { label: "Angus",      color: "bg-amber-900/50 text-amber-300 border-amber-700/40" },
  simental:  { label: "Simental",   color: "bg-sky-900/50 text-sky-300 border-sky-700/40"      },
  yerlikara: { label: "Yerli Kara", color: "bg-green-900/50 text-green-300 border-green-700/40"},
  limuzin:   { label: "Limuzin",    color: "bg-purple-900/50 text-purple-300 border-purple-700/40"},
};

interface BreedRec {
  rating: number;
  why: string;
  bestCooking: string[];
  avoid: string;
}

interface Guide {
  id: string;
  slug: string;
  title: string;
  animalType: string;
  shortDesc: string;
  imageUrl: string | null;
  breedRecommendations?: Record<string, BreedRec> | null;
}

function TopBreedBadges({ recs }: { recs: Record<string, BreedRec> | null | undefined }) {
  if (!recs) return null;
  const top = Object.entries(recs)
    .filter(([, r]) => r.rating >= 4)
    .sort(([, a], [, b]) => b.rating - a.rating)
    .slice(0, 2);
  if (top.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {top.map(([key, rec]) => {
        const badge = BREED_BADGES[key];
        if (!badge) return null;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
          >
            <Star size={9} className="fill-current" />
            {badge.label}
            {rec.rating === 5 && (
              <span className="text-[8px] opacity-70">★★★★★</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function RehberClient({ guides }: { guides: Guide[] }) {
  const [activeTab, setActiveTab] = useState("hepsi");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = guides;
    if (activeTab !== "hepsi") {
      result = result.filter((g) => g.animalType === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) => g.title.toLowerCase().includes(q) || g.shortDesc.toLowerCase().includes(q)
      );
    }
    return result;
  }, [guides, activeTab, searchQuery]);

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--deep-espresso)] to-[var(--charcoal-black)] relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--antique-gold)]/5 rounded-bl-[100%] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-display text-[var(--antique-gold)]">Et Rehberi</h1>
          <p className="text-[var(--ivory)]/70 text-lg max-w-3xl mx-auto">
            Hangi etin hayvanın neresinden elde edildiğini, yapısal özelliklerini ve en doğru pişirme
            yöntemlerini uzman kasaplarımızın hazırladığı dinamik rehberimizden öğrenin.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative mt-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[var(--antique-gold)]/60" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Örn: Antrikot, Izgara, İncik..."
              className="w-full bg-[var(--taupe-surface)] border border-[var(--antique-gold)]/10 rounded-full py-4 pl-14 pr-6 text-white placeholder-[var(--ivory)]/30 focus:outline-none focus:border-[var(--antique-gold)] shadow-xl transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 border ${
                activeTab === tab.key
                  ? "bg-[var(--antique-gold)] text-[var(--deep-espresso)] border-[var(--antique-gold)] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-[var(--taupe-surface)] text-[var(--ivory)]/60 border-[var(--antique-gold)]/10 hover:border-[var(--antique-gold)]/30 hover:text-[var(--ivory)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center">
          <span className="text-sm text-[var(--ivory)]/40">
            {filtered.length} sonuç gösteriliyor
          </span>
        </div>

        {/* Card Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--taupe-surface)] rounded-2xl border border-[var(--antique-gold)]/10">
            <p className="text-[var(--ivory)]/50 text-xl font-display">
              Aramanıza uygun bir et türü bulunamadı.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/rehber/${guide.slug}`} className="group block h-full">
      <div className="bg-[var(--taupe-surface)] border border-[var(--antique-gold)]/5 rounded-2xl overflow-hidden h-full flex flex-col hover:border-[var(--antique-gold)]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] hover:-translate-y-2">
        <div className="h-56 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={guide.imageUrl || "https://images.unsplash.com/photo-1603048297172-c92544798d5e"}
            alt={guide.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[var(--antique-gold)]/20">
            <span className="text-xs font-bold text-[var(--antique-gold)] tracking-wider">
              {guide.animalType === "BUYUKBAS" ? "DANA" : "KUZU"}
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-display text-white mb-3 group-hover:text-[var(--antique-gold)] transition-colors">
            {guide.title}
          </h3>
          <p className="text-[var(--ivory)]/60 text-sm leading-relaxed mb-2 flex-grow">
            {guide.shortDesc}
          </p>
          {/* Irk badge'leri */}
          <TopBreedBadges recs={guide.breedRecommendations} />
          <div className="flex items-center text-[var(--antique-gold)] text-sm font-semibold mt-4 gap-2">
            Detayları İncele <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
