"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, Lock, ChevronRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone,
        password,
      });

      if (res?.error) {
        setError("Telefon numarası veya şifre hatalı.");
      } else {
        const session = await getSession();
        if ((session?.user as any)?.role === "ADMIN") {
          router.push("/admin/live-orders");
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 bg-gradient-to-br from-[var(--deep-espresso)] via-black to-[var(--deep-espresso)]/80 relative overflow-hidden">
      {/* Decors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--antique-gold)]/5 rounded-bl-[100%] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--antique-gold)]/5 rounded-tr-[100%] blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#2A1B1A]/80 backdrop-blur-xl border border-[var(--taupe-surface)] rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif text-[var(--antique-gold)] mb-2">Giriş Yap</h1>
            <p className="text-[var(--ivory)]/60 text-sm">Satın alımlarınızı ve hisselerinizi takip etmek için hesabınıza giriş yapın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-950/40 border-l-4 border-red-500 text-red-200 p-3 rounded text-sm flex gap-2 items-center">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ivory)]/50 uppercase tracking-wider pl-1">Telefon Numarası</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-[var(--antique-gold)]/50 group-focus-within:text-[var(--antique-gold)] transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="05XX XXX XX XX"
                  className="w-full bg-black/40 border border-[var(--taupe-surface)] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[var(--ivory)]/20 focus:outline-none focus:border-[var(--antique-gold)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ivory)]/50 uppercase tracking-wider pl-1">Şifre</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[var(--antique-gold)]/50 group-focus-within:text-[var(--antique-gold)] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-[var(--taupe-surface)] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[var(--ivory)]/20 focus:outline-none focus:border-[var(--antique-gold)] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[var(--antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--deep-espresso)] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Giriş Yap <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>

        <div className="bg-black/30 border-t border-[var(--taupe-surface)] py-5 text-center px-4">
          <p className="text-sm text-[var(--ivory)]/60">
            Henüz hesabınız yok mu?{' '}
            <Link href="/register" className="text-[var(--antique-gold)] font-medium hover:underline">
              Hemen Kayıt Olun
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--antique-gold)] border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
