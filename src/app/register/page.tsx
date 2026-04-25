"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, Lock, ChevronRight, User, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setError("Lütfen geçerli bir telefon numarası girin.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Kayıt olurken bir hata meydana geldi.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-br from-[var(--deep-espresso)] via-black to-[var(--deep-espresso)]/80 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--antique-gold)]/5 rounded-bl-[100%] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--antique-gold)]/5 rounded-tr-[100%] blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#2A1B1A]/80 backdrop-blur-xl border border-[var(--taupe-surface)] rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif text-[var(--antique-gold)] mb-2">Aramıza Katılın</h1>
            <p className="text-[var(--ivory)]/60 text-sm">Erdoğan Kasap ayrıcalıklarından yararlanmak için hemen hesap oluşturun.</p>
          </div>

          {success ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 p-6 rounded-xl text-center space-y-4">
              <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500" />
              <div>
                <h3 className="text-lg font-medium text-white">Kayıt Başarılı!</h3>
                <p className="text-sm mt-1">Giriş sayfasına yönlendiriliyorsunuz...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/40 border-l-4 border-red-500 text-red-200 p-3 rounded text-sm flex gap-2 items-center">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" /> {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--ivory)]/50 uppercase tracking-wider pl-1">Ad Soyad</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-[var(--antique-gold)]/50 group-focus-within:text-[var(--antique-gold)] transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full bg-black/40 border border-[var(--taupe-surface)] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[var(--ivory)]/20 focus:outline-none focus:border-[var(--antique-gold)] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--ivory)]/50 uppercase tracking-wider pl-1">Telefon Numarası</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-[var(--antique-gold)]/50 group-focus-within:text-[var(--antique-gold)] transition-colors" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
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
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="En az 6 karakter"
                    className="w-full bg-black/40 border border-[var(--taupe-surface)] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[var(--ivory)]/20 focus:outline-none focus:border-[var(--antique-gold)] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-[var(--antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[var(--deep-espresso)] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Kayıt Ol <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="bg-black/30 border-t border-[var(--taupe-surface)] py-5 text-center px-4">
          <p className="text-sm text-[var(--ivory)]/60">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-[var(--antique-gold)] font-medium hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
