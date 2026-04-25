import Link from "next/link";
import { Scale, Video, Timer, ShoppingBag, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: <Scale size={28} />,
    title: "Kurban Hisse",
    description:
      "Büyükbaş hayvanlardan 7 hisse sistemiyle kurban hizmeti. Hisse dağılımını hesaplayın, vekaletinizi dijital olarak verin.",
    href: "/kurban",
    highlight: true,
  },
  {
    icon: <Video size={28} />,
    title: "Canlı Kesim İzleme",
    description:
      "Kesim sürecini canlı olarak takip edin. Şeffaflık ve güven ilkemizin bir parçası.",
    href: "/canli-kesim",
    highlight: false,
  },
  {
    icon: <Timer size={28} />,
    title: "Dry-Aged Dinlendirme",
    description:
      "Özel odalarımızda 21 ile 60 gün arası dinlendirilen etler. Sıcaklık ve nem anlık takip edilir.",
    href: "/dry-aged",
    highlight: false,
  },
  {
    icon: <ShoppingBag size={28} />,
    title: "Akıllı Sepet",
    description:
      "Her bir kasap ürününe özel notlar ve kasaba özel eklemeler yapabileceğiniz alışveriş sistemi.",
    href: "/sepet",
    highlight: false,
  },
];

export default function ServicesSection() {
  return (
    <section id="hizmetler" className="section-padding bg-taupe-surface relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-antique-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-antique-gold text-xs font-semibold tracking-[0.2em] uppercase">
            Neler Sunuyoruz
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ivory mt-3 mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-ivory/50 max-w-lg mx-auto">
            Sadece et satmıyoruz — güven, kalite ve sorumluluk sunuyoruz.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className={`group p-6 rounded-2xl border transition-all duration-500
                       hover:shadow-[0_0_30px_rgba(128,0,32,0.15)] hover:-translate-y-1
                       ${
                         service.highlight
                           ? "bg-gradient-to-b from-burgundy/20 to-deep-espresso border-antique-gold/20"
                           : "bg-deep-espresso border-antique-gold/5 hover:border-antique-gold/20"
                       }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5
                           ${service.highlight ? "bg-antique-gold text-deep-espresso" : "bg-burgundy/20 text-antique-gold"}`}
              >
                {service.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-ivory group-hover:text-antique-gold transition-colors mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-ivory/50 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-antique-gold/10 pt-4">
                <span className="text-xs font-semibold text-antique-gold/60 group-hover:text-antique-gold transition-colors tracking-wide uppercase">
                  {service.title === "Akıllı Sepet" ? "Siparişe Başla" : "Platformu İncele"}
                </span>
                <div className="w-8 h-8 rounded-full bg-antique-gold/10 flex items-center justify-center group-hover:bg-antique-gold transition-colors">
                  <ArrowRight className="w-4 h-4 text-antique-gold group-hover:text-deep-espresso transition-colors duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
