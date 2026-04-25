"use client";

import { useState, useTransition } from "react";
import { Users, Info, Scale, ArrowRight, MessageCircle, AlertCircle, Phone, User, Copy, CreditCard, UploadCloud, CheckCircle2 } from "lucide-react";
import { joinShare } from "@/app/actions/kurban-actions";
import { createSharePayment } from "@/app/actions/payment-actions";

type ShareRoomProps = {
  initialRoom: any;
};

export default function ShareRoom({ initialRoom }: ShareRoomProps) {
  const [room, setRoom] = useState(initialRoom);
  const [selectedShare, setSelectedShare] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({ name: "", phone: "", error: "" });
  const [joinedShareId, setJoinedShareId] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const totalKg = room.totalKg;
  const perShareKg = totalKg / 7;

  // Distribution estimation (approximate percentages based on typical yield)
  const distribution = [
    { label: "Kıyma", percentage: 40, weight: perShareKg * 0.4, color: "bg-red-500", type: "temel" },
    { label: "Kuşbaşı", percentage: 25, weight: perShareKg * 0.25, color: "bg-orange-500", type: "temel" },
    { label: "Kemikli Et (Haşlamalık)", percentage: 15, weight: perShareKg * 0.15, color: "bg-amber-600", type: "temel" },
    { label: "Biftek / Antrikot", percentage: 10, weight: perShareKg * 0.1, color: "bg-antique-gold", type: "luks" },
    { label: "Sakatat & Diğer", percentage: 10, weight: perShareKg * 0.1, color: "bg-stone-500", type: "sakatat" },
  ];

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShare) return;

    const formData = new FormData();
    formData.append("customerName", formState.name);
    formData.append("customerPhone", formState.phone);

    startTransition(async () => {
      const res = await joinShare(selectedShare.id, formData);
      if (res.success) {
        // Optimistic update
        const updatedShares = room.shares.map((s: any) =>
          s.id === selectedShare.id
            ? { ...s, status: "REZERVE", customerName: formState.name }
            : s
        );
        setRoom({ ...room, shares: updatedShares });
        setJoinedShareId(selectedShare.id);
        setSelectedShare(null);
        setFormState({ name: "", phone: "", error: "" });
      } else {
        setFormState((prev) => ({ ...prev, error: res.error || "Hata oluştu." }));
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Room Overview & Shares */}
      <div className="lg:col-span-8 space-y-8">
        {/* Room Header Info */}
        <div className="bg-taupe-surface border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-antique-gold/10 text-antique-gold text-xs font-semibold rounded-full border border-antique-gold/20">
                Oda #{room.id.slice(-5).toUpperCase()}
              </span>
              <span className="text-ivory/50 text-sm">{room.createdAt.toLocaleDateString('tr-TR')}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-ivory mb-2">
              {room.breed} Cinsi Büyükbaş
            </h1>
            <p className="text-ivory/60">
              Bu oda tamamen dolduğunda WhatsApp grubu üzerinden tüm hissedarlar birbirleriyle tanıştırılır ve kesim süreci başlar.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[140px]">
            <div className="text-xs text-ivory/50 mb-1">Toplam Karkas</div>
            <div className="text-2xl font-display font-bold text-antique-gold">{totalKg} <span className="text-sm">kg</span></div>
          </div>
        </div>

        {/* 7 Shares Grid */}
        <div>
          <h2 className="text-xl font-display font-semibold text-ivory mb-6 flex items-center gap-2">
            <Users size={20} className="text-antique-gold" />
            Hissedarlar (7 Kişi)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {room.shares.map((share: any) => {
              const isAvailable = share.status === "MUSAIT";
              const isSelected = selectedShare?.id === share.id;
              const isMine = joinedShareId === share.id;

              return (
                <div
                  key={share.id}
                  onClick={() => isAvailable ? setSelectedShare(share) : null}
                  className={`
                    relative p-5 rounded-xl border transition-all 
                    ${isAvailable ? "cursor-pointer hover:border-antique-gold/50" : "cursor-not-allowed opacity-80"}
                    ${isSelected ? "bg-antique-gold/10 border-antique-gold shadow-[0_0_20px_rgba(196,164,124,0.15)]" : 
                      isMine ? "bg-green-500/10 border-green-500/50" : "bg-taupe-surface border-white/5"}
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center
                      ${isSelected ? "bg-antique-gold text-charcoal-black" : "bg-white/5 text-ivory/50"}`}
                    >
                      {share.shareNumber}
                    </span>
                    {isMine && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Sizin</span>}
                  </div>
                  
                  {isAvailable ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-ivory font-medium mb-1">Müsait</div>
                      <div className="text-xs text-antique-gold">Katılmak için tıkla</div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="text-sm text-ivory font-medium truncate">
                        {isMine ? "Siz" : share.customerName || "Gizli Ortak"}
                      </div>
                      <div className="text-xs text-ivory/50 mt-1 capitalize">{share.status}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Group (If Joined) */}
        {joinedShareId && (
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ivory mb-1">Oda WhatsApp Grubu</h3>
                <p className="text-sm text-ivory/70">Oda tamamlandığında veya bayrama 2 hafta kala otomatik açılır.</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg transition-colors shadow-lg">
              Katıl (Yakında)
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Calculator / Join Form */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Join form OR Payment Form */}
        {paymentComplete ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center shadow-xl">
             <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <CheckCircle2 size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Talebiniz Alındı!</h3>
             <p className="text-sm text-ivory/70">Müşteri temsilcimiz dekont ve adres bilgilerinizi kontrol edip en kısa sürede onaylayacaktır.</p>
          </div>
        ) : joinedShareId ? (
          <PaymentForm 
            shareId={joinedShareId} 
            customerName={formState.name}
            customerPhone={formState.phone}
            onSuccess={() => setPaymentComplete(true)} 
          />
        ) : selectedShare ? (
          <div className="bg-taupe-surface border border-antique-gold/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-antique-gold to-yellow-600" />
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-antique-gold flex items-center justify-center text-charcoal-black font-bold">
                {selectedShare.shareNumber}
              </span>
              <div>
                <h3 className="font-display font-semibold text-lg text-ivory">Hisseye Katıl</h3>
                <p className="text-xs text-ivory/50">Bu hisseyi anında rezerve edin.</p>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              {formState.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {formState.error}
                </div>
              )}
              
              <div>
                <label className="block text-xs text-ivory/50 mb-1 ml-1 cursor-pointer">İsim Soyisim</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" size={18} />
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-charcoal-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-ivory focus:outline-none focus:border-antique-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ivory/50 mb-1 ml-1 cursor-pointer">Telefon Numarası</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" size={18} />
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-charcoal-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-ivory focus:outline-none focus:border-antique-gold transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-antique-gold hover:bg-yellow-600 text-charcoal-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isPending ? "Onaylanıyor..." : "Hemen Rezerve Et"}
                {!isPending && <ArrowRight size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setSelectedShare(null)}
                className="w-full py-2 text-ivory/50 hover:text-ivory text-sm transition-colors"
              >
                İptal Et
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-charcoal-black border border-white/5 rounded-2xl p-6 text-center">
            <Scale size={32} className="text-antique-gold/50 mx-auto mb-3" />
            <h3 className="font-display font-medium text-ivory mb-2">Hisse Seçiniz</h3>
            <p className="text-sm text-ivory/50">Rezerve etmek ve hesaplamaları görmek için yandaki boş hisseden birini seçin.</p>
          </div>
        )}

        {/* Share Calculator Component (Synced with Room Total) */}
        <div className="bg-taupe-surface border border-white/5 rounded-2xl p-6">
           <h3 className="font-display font-semibold text-ivory mb-4 flex items-center gap-2">
            <Scale size={18} className="text-antique-gold" />
            Kişi Başı Tahmini Dağılım
           </h3>
           
           <div className="mb-6">
              <div className="text-3xl font-display font-bold text-ivory">
                 {perShareKg.toFixed(1)} <span className="text-lg font-normal text-ivory/50">kg</span>
              </div>
              <p className="text-xs text-ivory/40">Tahmini Kemiksiz + Kemikli Toplam Ağırlık</p>
           </div>

           {/* Progress Chart */}
           <div className="flex h-4 bg-charcoal-black rounded-full overflow-hidden mb-5">
              {distribution.map((item, idx) => (
                <div
                  key={idx}
                  className={`h-full ${item.color} transition-all duration-1000`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${item.weight.toFixed(1)}kg`}
                />
              ))}
            </div>

            {/* Legends */}
            <div className="space-y-3">
              {distribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                    <span className="text-ivory/80">{item.label}</span>
                  </div>
                  <span className="font-medium text-ivory">{item.weight.toFixed(1)} kg</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3">
               <Info size={16} className="text-ivory/40 shrink-0 mt-0.5" />
               <p className="text-[11px] text-ivory/40 leading-relaxed">
                 * Belirtilen miktarlar tahmini değerlerdir. Hayvanın canlı yapısına, kemik ve yağ oranına göre %5-%10 arası değişiklik gösterebilir. Fire oranları düşülmemiştir.
               </p>
            </div>
        </div>

      </div>
    </div>
  );
}

function PaymentForm({ shareId, customerName, customerPhone, onSuccess }: { shareId: string, customerName: string, customerPhone: string, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [method, setMethod] = useState<"HAVALE" | "KART">("HAVALE");
  const [address, setAddress] = useState({ city: "İstanbul", district: "", street: "" });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basit doğrulama
    if (!address.district || !address.street) {
      setError("Lütfen teslimat adresi için ilçe ve mahalle/sokak giriniz.");
      setLoading(false);
      return;
    }

    try {
      const resp = await createSharePayment(shareId, {
        amount: 25000, // Örnek hisse bedeli (Gerçekte DB'den gelmeli)
        method,
        address: {
          city: address.city,
          district: address.district,
          street: address.street,
          fullName: customerName,
          phone: customerPhone,
        }
      });
      
      if (resp.success) {
        onSuccess();
      } else {
        setError(resp.error || "Ödeme bildirilemedi.");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-taupe-surface border border-antique-gold/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-antique-gold to-yellow-600" />
      <h3 className="font-display font-semibold text-lg text-ivory mb-2 flex items-center gap-2">
        <CreditCard size={18} className="text-antique-gold" />
        Ödeme & Teslimat
      </h3>
      <p className="text-xs text-ivory/50 mb-6">Hisseniz rezerve edildi! Süreci tamamlamak için lütfen adresinizi girin ve ödeme yöntemi seçin.</p>
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm mb-4 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-4">
        {/* Adres */}
        <div className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
          <h4 className="text-sm font-bold text-ivory">Teslimat Adresi</h4>
          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-[10px] text-ivory/50 mb-1 uppercase tracking-wider">İl</label>
                <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-charcoal-black/50 border border-white/10 rounded-lg py-2 text-sm text-ivory px-3 focus:border-antique-gold outline-none" />
             </div>
             <div>
                <label className="block text-[10px] text-ivory/50 mb-1 uppercase tracking-wider">İlçe</label>
                <input required value={address.district} onChange={e => setAddress({...address, district: e.target.value})} placeholder="Örn: Kadıköy" className="w-full bg-charcoal-black/50 border border-white/10 rounded-lg py-2 text-sm text-ivory px-3 focus:border-antique-gold outline-none" />
             </div>
          </div>
          <div>
            <label className="block text-[10px] text-ivory/50 mb-1 uppercase tracking-wider">Açık Adres</label>
            <textarea required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} rows={2} placeholder="Mahalle, sokak, no..." className="w-full bg-charcoal-black/50 border border-white/10 rounded-lg py-2 text-sm text-ivory px-3 focus:border-antique-gold outline-none" />
          </div>
        </div>

        {/* Ödeme Yöntemi */}
        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
           <h4 className="text-sm font-bold text-ivory mb-3">Ödeme Yöntemi</h4>
           <div className="grid grid-cols-2 gap-3 mb-4">
              <button type="button" onClick={() => setMethod("HAVALE")} className={`py-2 text-center text-sm font-semibold rounded-lg border transition-all ${method === "HAVALE" ? "bg-antique-gold/10 border-antique-gold text-antique-gold" : "bg-transparent border-white/10 text-ivory/50 hover:bg-white/5"}`}>Havale / EFT</button>
              <button type="button" onClick={() => setMethod("KART")} className={`py-2 text-center text-sm font-semibold rounded-lg border transition-all ${method === "KART" ? "bg-antique-gold/10 border-antique-gold text-antique-gold" : "bg-transparent border-white/10 text-ivory/50 hover:bg-white/5"}`}>Kredi Kartı</button>
           </div>

           {method === "HAVALE" && (
             <div className="bg-charcoal-black p-3 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-xs text-ivory/60">TR12 0006 2000 0000 0000 0000 00</span>
                   <button type="button" className="text-antique-gold hover:text-yellow-500"><Copy size={14}/></button>
                </div>
                <div className="text-[10px] text-ivory/40">Alıcı: Erdoğan Kasap Ltd. Şti.</div>
                <div className="mt-3 p-3 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                   <UploadCloud size={18} className="text-ivory/50" />
                   <span className="text-xs text-ivory/70">Dekont Yükle (Opsiyonel)</span>
                </div>
             </div>
           )}
           {method === "KART" && (
             <div className="text-xs text-ivory/60 p-3 bg-charcoal-black rounded-lg border border-white/5">
                Ödemeyi Müşteri Temsilcimiz sizi aradığında e-mail ile gönderilecek 3D Secure linkinden yapabilirsiniz.
             </div>
           )}
        </div>

        <button disabled={loading} type="submit" className="w-full py-3 bg-antique-gold hover:bg-yellow-600 text-charcoal-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
          {loading ? "Kaydediliyor..." : "İşlemi Tamamla"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
}

