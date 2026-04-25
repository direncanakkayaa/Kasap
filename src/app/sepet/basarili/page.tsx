"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Phone,
  Home,
  ShoppingBag,
  Clock,
  Copy,
  Check,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [copied, setCopied] = useState(false);

  const shortId = orderId.slice(-8).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[var(--deep-espresso)]/40">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-[#2A1B1A]/80 backdrop-blur-md rounded-3xl border border-emerald-500/20 p-10 sm:p-14 shadow-2xl text-center relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Check */}
          <div className="relative z-10 mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center animate-bounce-once">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-4xl font-serif text-emerald-400 mb-3 relative z-10">
            Siparişiniz Alındı!
          </h1>
          <p className="text-[var(--ivory)]/70 text-lg mb-8 relative z-10">
            Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp size
            ulaştırılacaktır.
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="bg-black/30 rounded-2xl border border-[var(--taupe-surface)] p-5 mb-8 relative z-10">
              <p className="text-xs text-[var(--ivory)]/40 uppercase tracking-widest mb-2">
                Sipariş Numarası
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-display font-bold text-[var(--antique-gold)] tracking-wider">
                  #{shortId}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[var(--ivory)]/60 hover:text-[var(--antique-gold)]"
                  title="Kopyala"
                >
                  {copied ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-black/20 rounded-2xl border border-[var(--taupe-surface)] p-6 mb-8 relative z-10">
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                </div>
                <span className="text-emerald-400 text-xs font-medium">
                  Sipariş Alındı
                </span>
              </div>
              <div className="flex-1 h-px bg-[var(--taupe-surface)] mx-3" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--taupe-surface)] flex items-center justify-center">
                  <Clock size={18} className="text-[var(--ivory)]/30" />
                </div>
                <span className="text-[var(--ivory)]/40 text-xs">
                  Hazırlanıyor
                </span>
              </div>
              <div className="flex-1 h-px bg-[var(--taupe-surface)] mx-3" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--taupe-surface)] flex items-center justify-center">
                  <Package size={18} className="text-[var(--ivory)]/30" />
                </div>
                <span className="text-[var(--ivory)]/40 text-xs">
                  Teslim
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-ivory font-medium py-4 rounded-xl border border-white/10 transition-all"
            >
              <Home size={18} />
              Ana Sayfa
            </Link>
            <Link
              href="/urunler"
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              <ShoppingBag size={18} />
              Alışverişe Devam Et
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-[var(--taupe-surface)] relative z-10">
            <p className="text-sm text-[var(--ivory)]/50">
              Sorularınız için bizi arayabilirsiniz
            </p>
            <a
              href="tel:+905551234567"
              className="inline-flex items-center gap-2 text-[var(--antique-gold)] font-medium mt-2 hover:underline"
            >
              <Phone size={16} />
              0555 123 45 67
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BasariliPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--antique-gold)] border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
