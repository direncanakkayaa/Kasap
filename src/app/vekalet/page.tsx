"use client";

import { useState } from "react";
import { SignaturePad } from "@/components/kurban/SignaturePad";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function VekaletPage() {
  const [formData, setFormData] = useState({
    shareId: "",
    customerName: "",
    customerTc: "",
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const consentText = "Erdoğan Kasap nezdinde kesilecek olan kurbanlık hissem için firmaya; kesim, parçalama ve dağıtım işlemleri adına tarafımca dijital olarak vekalet veriyorum.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.shareId || !formData.customerName || !formData.customerTc || !signature) {
      setErrorMsg("Lütfen formdaki tüm alanları doldurun ve imzanızı atın.");
      return;
    }
    if (formData.customerTc.length !== 11) {
      setErrorMsg("TC Kimlik Numarası 11 haneli olmalıdır.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          signatureData: signature,
          consentText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setIsSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-b from-black to-[var(--deep-espresso)]/30">
        <div className="max-w-xl mx-auto text-center space-y-6 bg-[#2A1B1A]/80 backdrop-blur-md p-10 rounded-2xl border border-[var(--taupe-surface)] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--antique-antique-gold)]/10 rounded-bl-full blur-2xl" />
          
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
          <h1 className="text-3xl font-serif text-[var(--antique-antique-gold)]">Vekaletiniz Alındı</h1>
          <p className="text-[var(--ivory)]/80 text-lg">
            Sayın {formData.customerName}, kurban kesim süreciniz için gerekli vekalet başarıyla kayıt altına alınmıştır.
            Durumunuzu <span className="text-[var(--antique-antique-gold)] font-medium">Dashboard</span> üzerinden takip edebilirsiniz.
          </p>
          <div className="pt-8 border-t border-[var(--taupe-surface)]">
            <Link
              href="/"
              className="inline-block bg-[var(--antique-antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[var(--deep-espresso)]/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--antique-antique-gold)] mb-4">Dijital Vekalet</h1>
          <p className="text-[var(--ivory)]/70 text-lg">
            Kurban kesim, parçalama ve dağıtım işlemlerinin İslami usullere uygun ve hijyenik bir şekilde 
            gerçekleştirilebilmesi için vekaletinizi form üzerinden onaylayabilirsiniz.
          </p>
        </div>

        <div className="bg-[#2A1B1A]/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-[var(--taupe-surface)] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--antique-antique-gold)]/10 rounded-bl-full blur-2xl" />

          {errorMsg && (
            <div className="mb-6 bg-red-950/40 border border-red-900 border-l-4 border-l-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ivory)]/80">Hisse Numaranız (ID)</label>
                <input
                  type="text"
                  required
                  value={formData.shareId}
                  onChange={(e) => setFormData({ ...formData, shareId: e.target.value })}
                  placeholder="Hisse No"
                  className="w-full bg-black/40 border border-[#423131] rounded-lg px-4 py-3 text-white placeholder-[var(--ivory)]/30 focus:outline-none focus:border-[var(--antique-antique-gold)] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ivory)]/80">TC Kimlik No</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={formData.customerTc}
                  onChange={(e) => setFormData({ ...formData, customerTc: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="11 Haneli TC"
                  className="w-full bg-black/40 border border-[#423131] rounded-lg px-4 py-3 text-white placeholder-[var(--ivory)]/30 focus:outline-none focus:border-[var(--antique-antique-gold)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--ivory)]/80">Ad Soyad</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full bg-black/40 border border-[#423131] rounded-lg px-4 py-3 text-white placeholder-[var(--ivory)]/30 focus:outline-none focus:border-[var(--antique-antique-gold)] transition-colors"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--taupe-surface)]">
              <h3 className="text-lg font-serif text-[var(--antique-antique-gold)] flex items-center gap-2">
                <span className="bg-[var(--antique-antique-gold)] text-[var(--deep-espresso)] w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold">1</span>
                Vekalet Metni
              </h3>
              <div className="bg-black/30 p-4 rounded-lg border border-[var(--taupe-surface)]/50 text-sm italic text-[var(--ivory)]/70 leading-relaxed">
                "{consentText}"
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--taupe-surface)]">
              <h3 className="text-lg font-serif text-[var(--antique-antique-gold)] flex items-center gap-2 mb-2">
                <span className="bg-[var(--antique-antique-gold)] text-[var(--deep-espresso)] w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold">2</span>
                Dijital İmza
              </h3>
              <SignaturePad onSignatureChange={setSignature} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-[var(--antique-antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-[var(--deep-espresso)] border-t-transparent flex-shrink-0 rounded-full animate-spin"></div>
              ) : (
                "Vekaleti Onayla ve Gönder"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
