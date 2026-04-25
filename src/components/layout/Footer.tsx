import Link from "next/link";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Ürünlerimiz", href: "/#urunler" },
  { label: "Kurban Hisse", href: "/kurban" },
  { label: "Hakkımızda", href: "/#hakkimizda" },
];

export default function Footer() {
  return (
    <footer className="bg-taupe-surface border-t border-antique-gold/10">
      {/* Gold Divider */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-antique-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-ivory mb-2">
              Kasap Erdoğan
            </h3>
            <p className="text-[11px] text-antique-gold/70 tracking-[0.2em] uppercase mb-4">
              Premium Et & Şarküteri
            </p>
            <p className="text-sm text-ivory/60 leading-relaxed">
              2010 yılından beri Antalya'da Kasap Erdoğan kalitesi ve güvencesiyle 
              taptaze etleri sofralarınıza ulaştırıyoruz.
            </p>
          </div>

          {/* Sayfalar */}
          <div>
            <h4 className="font-display text-lg font-semibold text-antique-gold mb-4">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/60 hover:text-antique-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-display text-lg font-semibold text-antique-gold mb-4">
              Şubelerimiz
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-antique-gold mt-1 shrink-0" />
                <div className="flex flex-col gap-1">
                   <p className="text-xs font-bold text-white">Muratpaşa (Yalı Şubesi)</p>
                   <span className="text-xs text-ivory/60">Yalı Cad. No:114, Antalya</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-antique-gold mt-1 shrink-0" />
                <div className="flex flex-col gap-1">
                   <p className="text-xs font-bold text-white">Lara Şubesi</p>
                   <span className="text-xs text-ivory/60">Lara Bölgesi, Güzeloba, Antalya</span>
                </div>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <Phone size={16} className="text-antique-gold shrink-0" />
                <a
                  href="tel:+905551234567"
                  className="text-sm text-ivory/60 hover:text-antique-gold transition-colors"
                >
                  0555 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-antique-gold shrink-0" />
                <span className="text-sm text-ivory/60">
                   08:00 – 21:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-antique-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} Kasap Erdoğan. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-ivory/30">
            2010'dan beri Antalya'nın lezzet adresi.
          </p>
        </div>
      </div>
    </footer>
  );
}
