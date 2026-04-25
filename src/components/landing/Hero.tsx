"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const HERO_IMAGES = [
  "/images/hero-cow.png", // AI-Generated İsviçre tarzı yemyeşil manzarada büyükbaş
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop", // Premium Izgara / Ateş
  "/images/hero-sheep.png", // AI-Generated Uçsuz bucaksız yemyeşil manzarada koyun sürüsü
  "https://images.unsplash.com/photo-1607623198457-7aad066a4d6e?q=80&w=2000&auto=format&fit=crop", // Premium Dinlendirilmiş Çiğ Et
  "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2000&auto=format&fit=crop", // Restoran Steak Sunumu
];

export default function Hero() {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[var(--deep-espresso)]">
      {/* Background Cinematic Slideshow */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[3000ms] ease-in-out ${idx === currentImg ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Premium Dark Overlay (Vignette + Fade to deep-espresso) */}
      <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--deep-espresso)] via-transparent to-black/30" />

      {/* Decorative Gold Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-antique-gold/30
                      bg-antique-gold/5 mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-antique-gold animate-pulse-antique-gold" />
          <span className="text-xs font-medium text-antique-gold tracking-wider uppercase">
            1970'den Beri Hizmetinizde
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-ivory
                     leading-[1.1] mb-6 animate-slide-up text-shadow">
          Erdoğan{" "}
          <span className="antique-gold-gradient">Kasap</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-ivory/70 font-light max-w-2xl mx-auto mb-4
                    animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Kuşaktan kuşağa aktarılan kasaplık geleneği
        </p>
        <p className="text-sm sm:text-base text-ivory/50 max-w-xl mx-auto mb-10
                    animate-slide-up" style={{ animationDelay: "0.2s" }}>
          En taze, en kaliteli etleri özenle seçiyor, ustalıkla hazırlıyor
          ve sofralarınıza ulaştırıyoruz.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4
                      animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="#urunler"
            className="px-8 py-4 text-sm font-semibold text-deep-espresso bg-antique-gold rounded-full
                     hover:bg-antique-antique-gold-light transition-all duration-300
                     hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] w-full sm:w-auto text-center"
          >
            Ürünlerimizi Keşfedin
          </Link>
          <a
            href="tel:+905551234567"
            className="px-8 py-4 text-sm font-semibold text-ivory border border-ivory/20 rounded-full
                     hover:border-antique-gold hover:text-antique-gold transition-all duration-300 w-full sm:w-auto text-center"
          >
            Sipariş Verin
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto
                      animate-slide-up" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "50+", label: "Yıllık Deneyim" },
            { value: "10K+", label: "Mutlu Müşteri" },
            { value: "100%", label: "Doğal Et" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold antique-gold-gradient">{stat.value}</div>
              <div className="text-[11px] text-ivory/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={24} className="text-antique-gold/50" />
      </div>
    </section>
  );
}
