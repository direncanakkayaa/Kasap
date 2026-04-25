import type { Metadata } from "next";
import ShareCalculator from "@/components/kurban/ShareCalculator";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Kurban Hisse — Erdoğan Kasap",
  description:
    "Büyükbaş kurban hisse sistemi. Hisse dağılımını hesaplayın, hissenizi seçin.",
};

export default function KurbanPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ivory/50 hover:text-antique-gold
                   transition-colors mb-8 animate-fade-in"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        {/* Page Header */}
        <div className="mb-10 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-antique-gold/10 border border-antique-gold/20
                          flex items-center justify-center">
              <Scale size={24} className="text-antique-gold" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ivory">
                Kurban Hisse
              </h1>
              <p className="text-sm text-ivory/50">
                Büyükbaş hayvanlardan 7 hisse sistemi
              </p>
            </div>
          </div>
          <p className="text-ivory/60 leading-relaxed max-w-2xl">
            Erdoğan Kasap olarak, büyükbaş hayvanlarınızı özenle seçiyor ve profesyonel
            ekibimizle kesim işlemini gerçekleştiriyoruz. Aşağıdaki hesaplayıcı ile
            hisse başına düşen et miktarını ve dağılımını görebilirsiniz.
          </p>
        </div>

        {/* Kurban Havuzu Banner */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-antique-gold/10 to-charcoal-black border border-antique-gold/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden animate-slide-up shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:border-antique-gold/50 transition-colors" style={{ animationFillMode: 'both', animationDelay: '200ms' }}>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-antique-gold/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-antique-gold/20 text-antique-gold text-xs font-bold mb-3 border border-antique-gold/30">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> YENİ
            </div>
            <h2 className="text-2xl font-display font-bold text-ivory mb-2">
              Kurban Havuzu ile Ortak Bulun
            </h2>
            <p className="text-ivory/70 text-sm max-w-xl">
              Tek başınıza veya arkadaşlarınızla hisselere katılın. Eksik hissesi olan gruplara anında dâhil olun, ortaklarınızla tanışın ve süreci şeffafça yönetin.
            </p>
          </div>
          <Link
            href="/kurban-havuzu"
            className="shrink-0 relative z-10 px-8 py-4 bg-antique-gold text-charcoal-black font-bold rounded-xl hover:bg-yellow-600 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(196,164,124,0.3)] hover:shadow-[0_0_30px_rgba(196,164,124,0.5)]"
          >
            Hemen Odaya Katıl
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>


        {/* Calculator */}
        <div className="animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '300ms' }}>
          <ShareCalculator />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '400ms' }}>
          {[
            {
              emoji: "🕌",
              title: "Dini Usullere Uygun",
              desc: "Kesimler dini vecibelere tam uygun şekilde gerçekleştirilir.",
            },
            {
              emoji: "📹",
              title: "Canlı İzleme",
              desc: "Kesim sürecini canlı yayınla takip edebilirsiniz.",
            },
            {
              emoji: "📝",
              title: "Dijital Vekalet",
              desc: "Vekaletinizi dijital imza ile kolayca verebilirsiniz.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl bg-taupe-surface border border-antique-gold/5 text-center"
            >
              <div className="text-2xl mb-2">{item.emoji}</div>
              <h3 className="font-display text-sm font-semibold text-ivory mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-ivory/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
