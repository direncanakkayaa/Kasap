"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingCart,
  Plus,
  Minus,
  ChefHat,
  ArrowRight,
  ShieldCheck,
  LogIn,
  Flame,
  Package,
  Loader2,
  MapPin,
  CreditCard,
  CreditCard as BankIcon,
  Truck,
  CheckCircle2,
  PlusCircle,
  Clock,
  ChevronLeft,
  X
} from "lucide-react";
import Link from "next/link";
import { useCart, type CartItem } from "@/lib/cart-store";
import { createOrder } from "@/app/actions/order-actions";
import { getUserAddresses, createAddress, setDefaultAddress } from "@/app/actions/user-actions";
import { cn } from "@/lib/utils";

type CheckoutStep = "review" | "address" | "payment";

export default function SepetPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const updateNote = useCart((s) => s.updateNote);
  const clearCart = useCart((s) => s.clearCart);
  const getTotalAmount = useCart((s) => s.getTotalAmount);

  // States
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("review");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"KART" | "HAVALE" | "KAPID_ODEME">("KART");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalAmount = getTotalAmount();
  const kdv = totalAmount * 0.01;
  const grandTotal = totalAmount + kdv;

  useEffect(() => {
    setMounted(true);
    if (authStatus === "authenticated") {
      loadAddresses();
    }
  }, [authStatus]);

  async function loadAddresses() {
    const data = await getUserAddresses();
    setAddresses(data);
    const defaultAddr = data.find(a => a.isDefault);
    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    else if (data.length > 0) setSelectedAddressId(data[0].id);
  }

  const handleCheckout = async () => {
    if (authStatus !== "authenticated") {
      router.push("/login?callbackUrl=/sepet");
      return;
    }

    if (step === "review") {
      setStep("address");
      return;
    }

    if (step === "address") {
      if (!selectedAddressId) {
        setError("Lütfen bir teslimat adresi seçin.");
        return;
      }
      setStep("payment");
      return;
    }

    // Process Final Order
    setError("");
    setIsSubmitting(true);

    try {
      const result = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          serviceType: item.serviceType,
          unitPrice: item.price + (item.serviceType === "COOKED" ? item.cookingPrice : 0),
          additionsTotal: item.selectedAdditions.reduce((s, a) => s + a.price, 0),
          butcherNotes: [
            item.butcherNote,
            item.selectedAdditions.length > 0 
              ? `Yan Ürünler: ${item.selectedAdditions.map((a) => a.name).join(", ")}` 
              : "",
          ].filter(Boolean).join(" | "),
        })),
        totalAmount: grandTotal,
        notes: orderNotes || undefined,
        addressId: selectedAddressId || undefined,
        // @ts-ignore
        paymentMethod: paymentMethod === "KAPID_ODEME" ? "NAKIT" : paymentMethod,
      });

      if (result.requiresAuth) {
        router.push("/login?callbackUrl=/sepet");
        return;
      }

      if (!result.success) {
        setError(result.error || "Bir hata oluştu.");
        return;
      }

      // Success logic
      // In a real KART flow, we would redirect to a bank page here.
      // For now, we simulate success for all flows.
      clearCart();
      router.push(`/sepet/basarili?orderId=${result.orderId}`);
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      district: formData.get("district"),
      street: formData.get("street"),
      label: formData.get("label"),
    };

    startTransition(async () => {
      await createAddress(data);
      await loadAddresses();
      setIsAddingAddress(false);
    });
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[var(--deep-espresso)]/40">
      <div className="max-w-6xl mx-auto">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-16 gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-4">
           {[
             { id: "review", label: "Sepet", icon: ShoppingCart },
             { id: "address", label: "Teslimat", icon: MapPin },
             { id: "payment", label: "Ödeme", icon: CreditCard }
           ].map((s, idx) => (
             <div key={s.id} className="flex items-center gap-4 flex-shrink-0">
                <div className={cn(
                  "flex flex-col items-center gap-2",
                  step === s.id ? "text-antique-gold" : "text-ivory/20"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    step === s.id ? "border-antique-gold bg-antique-gold/10" : "border-white/5 bg-white/5"
                  )}>
                    <s.icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                {idx < 2 && <div className="w-12 h-[2px] bg-white/5 -mt-4" />}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Back Button */}
            {step !== "review" && (
              <button 
                onClick={() => setStep(step === "payment" ? "address" : "review")}
                className="flex items-center gap-2 text-ivory/40 hover:text-white transition-colors text-sm mb-4"
              >
                <ChevronLeft size={16} /> Geri Dön
              </button>
            )}

            {/* ERROR UI */}
            {error && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="text-red-500" />
                {error}
              </div>
            )}

            {/* STEP: REVIEW */}
            {step === "review" && (
              <div className="space-y-6">
                {items.length === 0 ? (
                  <div className="bg-[#2A1B1A]/60 border border-white/5 rounded-3xl p-20 text-center">
                    <ShoppingCart className="w-20 h-20 text-ivory/5 mx-auto mb-6" />
                    <p className="text-ivory/70 text-xl font-serif">Sepetiniz şu an boş.</p>
                    <Link href="/urunler" className="mt-8 inline-block bg-antique-gold text-deep-espresso font-bold px-10 py-4 rounded-xl hover:bg-gold-light transition-all">
                      Ürünleri Keşfet
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.productId}-${item.serviceType}`} className="bg-[#2A1B1A]/80 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex flex-col sm:flex-row gap-6 group hover:border-antique-gold/20 transition-all">
                      <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40">
                         <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                         <div className="flex justify-between items-start">
                            <div>
                               <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                               <div className="flex items-center gap-2">
                                  <p className="text-antique-gold font-bold">
                                    ₺{(item.price * item.weight).toFixed(0)}
                                    {item.unit === "KG" && <span className="text-[10px] text-ivory/40 font-normal ml-1">({item.weight < 1 ? `${item.weight * 1000}gr` : `${item.weight}kg`})</span>}
                                  </p>
                                  {item.serviceType === "COOKED" ? (
                                    <span className="bg-orange-950/40 text-orange-400 text-[10px] px-2 py-0.5 rounded-full border border-orange-500/20 uppercase font-bold tracking-tighter">Pişmiş (+₺{item.cookingPrice})</span>
                                  ) : (
                                    <span className="bg-emerald-950/40 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-tighter">Çiğ</span>
                                  )}
                               </div>
                            </div>
                            <button onClick={() => removeItem(item.productId)} className="p-2 text-ivory/20 hover:text-red-400 transition-colors">
                               <Trash2 size={20} />
                            </button>
                         </div>
                         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                            <div className="w-full sm:w-2/3 relative">
                               <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 text-antique-gold/40 w-4 h-4" />
                               <input 
                                 placeholder="Kasap Notu..." 
                                 value={item.butcherNote}
                                 onChange={(e) => updateNote(item.productId, e.target.value)}
                                 className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-antique-gold transition-all"
                               />
                            </div>
                            <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-white/5">
                               <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center text-ivory/40 hover:text-white"><Minus size={14}/></button>
                               <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-ivory/40 hover:text-white"><Plus size={14}/></button>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* STEP: ADDRESS */}
            {step === "address" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                     <Truck className="text-antique-gold" /> Teslimat Bilgileri
                   </h2>
                   <button 
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="flex items-center gap-2 text-antique-gold font-bold text-sm bg-antique-gold/10 px-4 py-2 rounded-xl border border-antique-gold/20"
                   >
                     {isAddingAddress ? <X size={16} /> : <><Plus size={16} /> Yeni Adres</>}
                   </button>
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="bg-[#2A1B1A]/80 p-8 rounded-3xl border border-white/10 space-y-6 animate-slide-in">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest pl-2">Alıcı Ad Soyad</label>
                          <input name="fullName" required className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-antique-gold transition-all" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest pl-2">Telefon</label>
                          <input name="phone" required className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-antique-gold transition-all" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest pl-2">İl / Şehir</label>
                          <input name="city" required defaultValue="Karabük" className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-antique-gold transition-all" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest pl-2">İlçe</label>
                          <input name="district" required className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-antique-gold transition-all" />
                       </div>
                       <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest pl-2">Açık Adres (Cadde, Sokak, No, Daire)</label>
                          <textarea name="street" required rows={3} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-antique-gold transition-all resize-none" />
                       </div>
                       <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest pl-2">Adres Başlığı (Örn: Ev, İş)</label>
                          <input name="label" placeholder="Evim" className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-antique-gold transition-all" />
                       </div>
                    </div>
                    <button type="submit" disabled={isPending} className="w-full py-5 bg-antique-gold text-deep-espresso font-bold rounded-2xl flex items-center justify-center gap-2">
                       {isPending ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> Adresi Kaydet</>}
                    </button>
                  </form>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={cn(
                          "bg-[#2A1B1A]/80 p-6 rounded-3xl border cursor-pointer transition-all flex justify-between items-center group",
                          selectedAddressId === addr.id ? "border-antique-gold bg-antique-gold/5" : "border-white/5 hover:border-white/20"
                        )}
                      >
                         <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                              selectedAddressId === addr.id ? "bg-antique-gold text-deep-espresso" : "bg-white/5 text-ivory/20"
                            )}>
                               <MapPin size={20} />
                            </div>
                            <div>
                               <p className="font-bold text-white flex items-center gap-2">
                                 {addr.label}
                                 {addr.isDefault && <span className="text-[9px] bg-white/10 text-ivory/40 px-2 py-0.5 rounded font-bold">VARSAYILAN</span>}
                               </p>
                               <p className="text-sm text-ivory/60 mt-1">{addr.street}</p>
                               <p className="text-xs text-ivory/40">{addr.district} / {addr.city}</p>
                            </div>
                         </div>
                         {selectedAddressId === addr.id && <CheckCircle2 className="text-antique-gold" />}
                      </div>
                    ))}
                    {addresses.length === 0 && (
                      <div className="bg-black/20 border-2 border-dashed border-white/5 p-12 rounded-3xl text-center">
                         <MapPin className="w-12 h-12 text-ivory/5 mx-auto mb-4" />
                         <p className="text-ivory/40">Kayıtlı teslimat adresi bulunamadı.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP: PAYMENT */}
            {step === "payment" && (
              <div className="space-y-8 animate-slide-in">
                 <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                   <CreditCard className="text-antique-gold" /> Ödeme Seçenekleri
                 </h2>

                 <div className="grid gap-4">
                    {[
                      { id: "KART", label: "Kredi / Banka Kartı", desc: "PayTR ile 3D Güvenli Ödeme", icon: BankIcon },
                      { id: "HAVALE", label: "Havale / EFT", desc: "Hesap bilgilerimiz sipariş sonrası verilir", icon: Clock },
                      { id: "KAPID_ODEME", label: "Kapıda Ödeme (Nakit)", desc: "Teslimat anında ödeme", icon: Truck }
                    ].map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={cn(
                          "bg-[#2A1B1A]/80 p-6 rounded-3xl border cursor-pointer transition-all flex justify-between items-center group",
                          paymentMethod === m.id ? "border-antique-gold bg-antique-gold/5" : "border-white/5 hover:border-white/20"
                        )}
                      >
                         <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                              paymentMethod === m.id ? "bg-antique-gold text-deep-espresso" : "bg-white/5 text-ivory/20"
                            )}>
                               <m.icon size={24} />
                            </div>
                            <div>
                               <p className="font-bold text-white text-lg">{m.label}</p>
                               <p className="text-xs text-ivory/40 mt-1">{m.desc}</p>
                            </div>
                         </div>
                         {paymentMethod === m.id && <CheckCircle2 className="text-antique-gold" size={24} />}
                      </div>
                    ))}
                 </div>

                 {paymentMethod === "KART" && (
                   <div className="bg-antique-gold/10 border border-antique-gold/30 p-6 rounded-[2.5rem] flex items-center gap-6">
                      <ShieldCheck className="text-antique-gold w-12 h-12 flex-shrink-0" />
                      <div>
                         <p className="text-white font-bold">Güvenli Ödeme Altyapısı</p>
                         <p className="text-sm text-ivory/60">Bir sonraki adımda PayTR 256-Bit SSL korumalı ödeme penceresine yönlendirileceksiniz.</p>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
               <div className="bg-[#2A1B1A]/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 shadow-2xl sticky top-32 space-y-8">
                  <h2 className="text-2xl font-serif text-white border-b border-white/5 pb-4">Özet</h2>

                  <div className="space-y-4">
                     {items.map(item => {
                       const basePriceWithWeight = item.price * item.weight;
                       const linePrice = (basePriceWithWeight + (item.serviceType === 'COOKED' ? item.cookingPrice : 0)) * item.quantity;
                       return (
                        <div key={item.productId} className="flex justify-between items-start text-sm">
                           <div className="flex flex-col">
                              <span className="text-ivory/60">{item.name} x{item.quantity}</span>
                              <span className="text-[10px] text-ivory/20 font-bold uppercase tracking-widest">{item.unit === 'KG' ? (item.weight < 1 ? `${item.weight * 1000}gr` : `${item.weight}kg`) : `${item.weight} adet`}</span>
                           </div>
                           <span className="text-white font-bold">₺{linePrice.toFixed(0)}</span>
                        </div>
                       );
                     })}
                  </div>

                  {step === "payment" && (
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-2">
                       <p className="text-[10px] text-ivory/30 uppercase tracking-widest font-bold">Teslim Edilecek Adres</p>
                       <p className="text-xs text-white font-medium">{addresses.find(a => a.id === selectedAddressId)?.street}</p>
                       <p className="text-[10px] text-antique-gold/60 font-bold">{paymentMethod.replace('_', ' ')} İLE ÖDEME</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-ivory/40">Ara Toplam</span>
                        <span className="text-ivory/80">₺{totalAmount.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-ivory/40">KDV (%1)</span>
                        <span className="text-ivory/80">₺{kdv.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-end pt-2">
                        <span className="text-lg text-white font-serif">Toplam</span>
                        <span className="text-4xl font-bold text-antique-gold">₺{grandTotal.toFixed(0)}</span>
                     </div>
                  </div>

                  {authStatus !== "authenticated" ? (
                    <Link 
                      href="/login?callbackUrl=/sepet"
                      className="w-full bg-white/5 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <LogIn size={20} /> Önce Giriş Yapın
                    </Link>
                  ) : (
                    <button 
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full bg-antique-gold text-deep-espresso font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gold/30 hover:bg-gold-light transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck size={22} />}
                      {step === "review" ? "Teslimata Geç" : step === "address" ? "Ödemeye Geç" : "Siparişi Onayla"}
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-[10px] text-ivory/20 font-bold uppercase tracking-widest">
                    <ShieldCheck size={14} /> 256-Bit SSL Protected
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
