"use client";

import { useState } from "react";
import { joinShare } from "@/app/actions/kurban-actions";
import { CheckCircle2, UserPlus, AlertCircle, ShieldCheck } from "lucide-react";

export default function ShareCardClient({ share, perShareKg, roomId }: { share: any, perShareKg: string, roomId: string }) {
  const [isReserving, setIsReserving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAvailable = share.status === "MUSAIT";
  
  const maskName = (name: string) => {
    if (!name) return "Bir Hissedar";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return name.charAt(0) + "****";
    const last = parts.pop() || "";
    return parts.join(" ") + " " + last.charAt(0) + "****";
  };

  const statusLabel = 
    share.status === "MUSAIT"  ? "BOŞTA" :
    share.status === "REZERVE" ? "REZERVE EDİLDİ" : "SATILDI";

  async function handleJoin(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const res = await joinShare(share.id, formData);
      if (res.success) {
        setIsReserving(false);
      } else {
        setError(res.error || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isAvailable ? 'bg-black/40 border-[var(--antique-gold)]/40 hover:border-[var(--antique-gold)] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-black/20 border-white/5 opacity-80'}`}>
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
        
        {/* Share Number Stamp */}
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 border-2 shadow-inner ${isAvailable ? 'bg-[#2A1B1A] border-[var(--antique-gold)] text-[var(--antique-gold)]' : 'bg-black/50 border-white/10 text-white/30'}`}>
          <span className="text-2xl font-black">{share.shareNumber}</span>
        </div>

        {/* Share Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
            <h3 className="text-xl font-bold text-white">
              {share.shareNumber}. Hisse
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase ${isAvailable ? 'bg-[var(--antique-gold)] text-black' : share.status === 'REZERVE' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {statusLabel}
            </span>
          </div>
          
          <p className="text-sm text-[var(--ivory)]/60">
            {isAvailable 
              ? <span className="text-[var(--ivory)]/80">Bu hisse şu an boşta. Yaklaşık <strong>{perShareKg} kg</strong> kemiksiz et ve kemikli payı düşmektedir.</span>
              : <span className="flex items-center justify-center sm:justify-start gap-1"><ShieldCheck size={14} className="text-green-500" /> Bu hisse {maskName(share.customerName)} tarafından alındı.</span>
            }
          </p>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {isAvailable ? (
            !isReserving && (
              <button 
                onClick={() => setIsReserving(true)}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--antique-gold)] text-black font-bold text-sm rounded-xl hover:bg-yellow-500 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Hemen Rezerve Et
              </button>
            )
          ) : (
            <div className="w-full sm:w-auto px-6 py-3 bg-white/5 text-white/40 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-white/5 cursor-not-allowed">
              <CheckCircle2 size={18} />
              Dolu
            </div>
          )}
        </div>
      </div>

      {/* Reservation Inline Form */}
      {isAvailable && isReserving && (
        <div className="bg-[#1A1A1A] p-6 border-t border-[var(--taupe-surface)]">
          <h4 className="text-[var(--antique-gold)] font-bold mb-4 flex items-center gap-2">
            <UserPlus size={18} /> Rezerve İşlemi ({share.shareNumber}. Hisse)
          </h4>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form action={handleJoin} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-[10px] uppercase text-[var(--ivory)]/50 tracking-widest font-semibold mb-2">Ad Soyad</label>
              <input 
                type="text" 
                name="customerName"
                required
                disabled={loading}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--antique-gold)] transition-colors disabled:opacity-50"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[var(--ivory)]/50 tracking-widest font-semibold mb-2">Telefon Numarası</label>
              <input 
                type="tel" 
                name="customerPhone"
                required
                disabled={loading}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--antique-gold)] transition-colors disabled:opacity-50"
                placeholder="0555 123 45 67"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => { setIsReserving(false); setError(null); }}
                disabled={loading}
                className="px-6 py-3 text-white/50 hover:text-white transition-colors text-sm font-semibold disabled:opacity-50"
              >
                İptal
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[var(--antique-gold)] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-yellow-500 transition-colors text-sm rounded-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {loading ? "Rezerve Ediliyor..." : "Ön Rezervasyonu Tamamla"}
              </button>
            </div>
          </form>
          <p className="text-[10px] text-[var(--ivory)]/40 mt-4 text-center sm:text-left">
            * Rezervasyon sonrası müşteri temsilcimiz 15 dakika içinde sizi arayarak sözlü vekalet ve onay sürecini dijital onay panelinden tamamlayacaktır.
          </p>
        </div>
      )}
    </div>
  );
}
