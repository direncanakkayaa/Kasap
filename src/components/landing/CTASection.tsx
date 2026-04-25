"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Check } from "lucide-react";

export default function CTASection() {
  const [copied, setCopied] = useState(false);

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth >= 1024) {
      e.preventDefault();
      navigator.clipboard.writeText("+905551234567");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark via-burgundy to-burgundy-dark" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-ivory mb-4 leading-tight">
          Sipariş Vermek İçin{" "}
          <span className="antique-gold-gradient">Bizi Arayın</span>
        </h2>
        <p className="text-ivory/70 text-lg mb-10 max-w-xl mx-auto">
          İster telefonla, ister WhatsApp üzerinden siparişinizi verebilirsiniz.
          Aynı gün teslimat hizmeti sunuyoruz.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+905551234567"
            onClick={handlePhoneClick}
            className="flex items-center gap-3 px-8 py-4 text-sm font-semibold
                     text-deep-espresso bg-antique-gold rounded-full hover:bg-antique-gold/90
                     transition-all duration-300
                     hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] w-full sm:w-auto justify-center"
          >
            {copied ? <Check size={18} /> : <Phone size={18} />}
            {copied ? "Kopyalandı!" : "+90 555 123 45 67"}
          </a>

          <a
            href="https://wa.me/905551234567?text=Merhaba%2C%20sipari%C5%9F%20vermek%20istiyorum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 text-sm font-semibold
                     text-ivory border-2 border-ivory/30 rounded-full
                     hover:border-green-400 hover:text-green-400
                     transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <MessageCircle size={18} />
            WhatsApp ile Sipariş
          </a>
        </div>

        <p className="mt-8 text-xs text-ivory/40">
          Çalışma Saatleri: Her gün 08:00 – 21:00
        </p>
      </div>
    </section>
  );
}
