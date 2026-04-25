import { ShieldCheck, Sparkles, Truck, Award, Thermometer, Users } from "lucide-react";

const REASONS = [
  {
    icon: <ShieldCheck size={24} />,
    title: "Hijyen Garantisi",
    description: "ISO 22000 gıda güvenliği standartlarına uygun tesisler.",
  },
  {
    icon: <Sparkles size={24} />,
    title: "Günlük Taze Kesim",
    description: "Her gün taze kesilmiş etler. Dondurulmuş ürün satmıyoruz.",
  },
  {
    icon: <Truck size={24} />,
    title: "Soğuk Zincir Teslimat",
    description: "Etleriniz soğuk zincir kırılmadan kapınıza ulaşır.",
  },
  {
    icon: <Award size={24} />,
    title: "15. Yıl Deneyimi",
    description: "2010'dan beri Antalya'da değişmeyen lezzet kalitesi.",
  },
  {
    icon: <Thermometer size={24} />,
    title: "Kontrollü Saklama",
    description: "0-4°C saklama odaları, anlık sıcaklık takibi.",
  },
  {
    icon: <Users size={24} />,
    title: "10.000+ Müşteri",
    description: "Binlerce mutlu müşteri ve kurumsal iş ortağı.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="section-padding relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-antique-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-antique-gold text-xs font-semibold tracking-[0.2em] uppercase">
            Güven & Kalite
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ivory mt-3 mb-4">
            Neden <span className="antique-gold-gradient">Kasap Erdoğan?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="group p-6 rounded-2xl bg-taupe-surface border border-antique-gold/5
                       hover:border-antique-gold/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-burgundy/20 text-antique-gold
                           flex items-center justify-center mb-4
                           group-hover:bg-antique-gold group-hover:text-deep-espresso transition-all duration-300">
                {reason.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-ivory mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-ivory/50 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
