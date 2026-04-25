import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package, Beef, CalendarClock, Phone, ShieldCheck, User as UserIcon, FileSignature } from "lucide-react";
import { StatusStepper } from "@/components/dashboard/StatusStepper";
import AdminPaymentPanel from "./AdminPaymentPanel";

export const revalidate = 0; // Bu sayfanın anlık Session datasını SSR işlemesi için zorunlu

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).phone) {
    redirect("/login");
  }

  const phone = (session.user as any).phone;

  // Lüks profil için tüm veriyi Prisma ilişkileriyle (Relations) tek sorguda çek
  const user = await prisma.user.findUnique({
    where: { phone },
    include: {
      shares: {
        include: { animal: true, distribution: true }
      },
      orders: { orderBy: { createdAt: "desc" } },
      dryAgedOrders: { orderBy: { createdAt: "desc" } },
      proxyConsents: { orderBy: { consentDate: "desc" } },
    }
  });

  if (!user) {
    redirect("/login");
  }

  const mapShareStatus = (animalStatus: string, shareStatus: string) => {
    if (shareStatus === 'TESLIM') return "TESLIM";
    if (animalStatus === 'PARCALANDI') return "PARCALANDI";
    if (animalStatus === 'KESILDI') return "KESILDI";
    if (shareStatus === 'SATILDI') return "SATILDI";
    return "REZERVE"; 
  };

  // Eğer kullanıcı Admin ise beklemedeki ödemeleri çek
  let pendingPayments: any[] = [];
  if (user.role === 'ADMIN') {
    pendingPayments = await prisma.sharePayment.findMany({
      where: { status: 'BEKLEMEDE' },
      include: {
        share: {
          include: { animal: true, address: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[var(--deep-espresso)]/40 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--antique-gold)]/5 rounded-bl-[100%] blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Kullanıcı Profili VIP Başlığı (Hero Card) */}
        <div className="bg-[#2A1B1A]/80 border border-[var(--taupe-surface)] shadow-2xl rounded-[2.5rem] p-8 backdrop-blur-md flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-[var(--antique-gold)]/10 border-2 border-[var(--antique-gold)] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(197,160,89,0.3)]">
            <UserIcon className="w-10 h-10 text-[var(--antique-gold)]" />
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="text-3xl sm:text-4xl font-serif text-white mb-3">Hoş Geldiniz, <span className="text-[var(--antique-gold)]">{user.name || "Değerli Müşterimiz"}</span></h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[var(--ivory)]/70">
              <span className="flex items-center gap-1.5 font-medium"><Phone className="w-4 h-4 text-[var(--antique-gold)]"/> {user.phone}</span>
              {user.email && <span className="flex items-center gap-1.5">| {user.email}</span>}
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-[var(--antique-gold)]/30"><ShieldCheck className="w-4 h-4 text-green-500" /> Hesap Doğrulandı</span>
              {user.role === 'ADMIN' && (
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 text-xs font-bold uppercase tracking-wider">Yönetici</span>
              )}
            </div>
            
            {/* Hızlı Özet İstatistikleri (KPI Metrics) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full">
              <div className="bg-black/40 rounded-2xl p-5 border border-[var(--taupe-surface)] hover:border-[var(--antique-gold)]/40 transition-colors">
                <p className="text-[10px] text-[var(--antique-gold)] uppercase tracking-wider mb-2 font-bold">Kurban Hisseleri</p>
                <p className="text-3xl font-bold text-white">{user.shares.length}</p>
              </div>
              <div className="bg-black/40 rounded-2xl p-5 border border-[var(--taupe-surface)] hover:border-[var(--antique-gold)]/40 transition-colors">
                <p className="text-[10px] text-[var(--antique-gold)] uppercase tracking-wider mb-2 font-bold">Aktif Siparişler</p>
                <p className="text-3xl font-bold text-white">{user.orders.filter(o => o.status !== 'TAMAMLANDI').length}</p>
              </div>
              <div className="bg-black/40 rounded-2xl p-5 border border-[var(--taupe-surface)] hover:border-[var(--antique-gold)]/40 transition-colors">
                <p className="text-[10px] text-[var(--antique-gold)] uppercase tracking-wider mb-2 font-bold">Dry-Aged Dolabı</p>
                <p className="text-3xl font-bold text-white">{user.dryAgedOrders.length}</p>
              </div>
              <div className="bg-black/40 rounded-2xl p-5 border border-[var(--taupe-surface)] hover:border-[var(--antique-gold)]/40 transition-colors">
                <p className="text-[10px] text-[var(--antique-gold)] uppercase tracking-wider mb-2 font-bold">İmzalı Vekaletler</p>
                <p className="text-3xl font-bold text-white">{user.proxyConsents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Modülü: Bekleyen Ödemeler */}
        {user.role === 'ADMIN' && pendingPayments.length > 0 && (
          <AdminPaymentPanel pendingPayments={pendingPayments} />
        )}

        {/* Detaylı Modüller */}
        <div className="space-y-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          
          {/* Kurban Hisseleri */}
          {user.shares.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-serif text-[var(--antique-gold)] flex items-center gap-3 border-b border-[var(--taupe-surface)] pb-3">
                <Beef className="w-6 h-6" /> Kurban Hisseleriniz
              </h2>
              <div className="grid gap-6">
                {user.shares.map((share) => (
                  <div key={share.id} className="bg-[#2A1B1A]/40 border border-[var(--taupe-surface)] rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all hover:bg-[#2A1B1A]/70 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                      <div>
                        <p className="text-xs text-[var(--antique-gold)] uppercase tracking-widest font-semibold mb-1.5 flex items-center gap-2">
                          Hisse Kaydı: #{share.shareNumber}
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--antique-gold)] animate-pulse" />
                        </p>
                        <h3 className="text-xl md:text-2xl font-serif text-white">Büyükbaş Hayvan <span className="text-[var(--ivory)]/50">(Küpe: {share.animal.id.slice(0,6)})</span></h3>
                        {share.distribution && (
                          <div className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <span className="bg-black/50 text-[var(--ivory)]/80 px-3 py-1.5 rounded border border-[var(--taupe-surface)]">Net Hedef: {share.distribution.totalKg} KG</span>
                            <span className="bg-black/50 text-[var(--ivory)]/70 px-2 py-1.5 rounded border border-[var(--taupe-surface)]">Kıyma: {share.distribution.kiymaKg}kg</span>
                            <span className="bg-black/50 text-[var(--ivory)]/70 px-2 py-1.5 rounded border border-[var(--taupe-surface)]">Kuşbaşı: {share.distribution.kusbasiKg}kg</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-3 text-right">
                         <div className="bg-[var(--antique-gold)]/10 text-[var(--antique-gold)] px-4 py-2 rounded-xl border border-[var(--antique-gold)]/30 text-sm font-bold tracking-wider">
                           DURUM: {share.animal.status.toUpperCase()}
                         </div>
                         {share.kesimGorseliUrl && (
                           <a href={share.kesimGorseliUrl} target="_blank" rel="noreferrer" className="relative block h-20 w-32 rounded-xl border border-white/20 overflow-hidden group hover:border-[#4ADE80] transition-colors shadow-lg">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={share.kesimGorseliUrl} alt="Kesim Kanıtı" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <span className="text-white text-[10px] font-bold tracking-widest uppercase">Fotoğrafı Aç</span>
                              </div>
                           </a>
                         )}
                      </div>
                    </div>
                    <StatusStepper currentStatus={mapShareStatus(share.animal.status, share.status)} type="share" />
                    
                    {/* Hisse Timeline Durumu */}
                    <div className="mt-5 bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-inner">
                       <span className="text-ivory/50 text-xs font-semibold uppercase tracking-wider">Canlı İzlenebilirlik Durumu:</span>
                       <span className="text-[#4ADE80] text-sm font-bold flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                         {(share.timelineState as any)?.progressText || "Sıradaki işlem için lojistik onayı bekleniyor..."}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vekaletler */}
          {user.proxyConsents.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-serif text-[var(--antique-gold)] flex items-center gap-3 border-b border-[var(--taupe-surface)] pb-3">
                <FileSignature className="w-6 h-6" /> Dijital Vekalet Belgeleri
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {user.proxyConsents.map((proxy) => (
                  <div key={proxy.id} className="bg-[#2A1B1A]/60 p-6 rounded-2xl border border-[var(--antique-gold)]/20 shadow-[0_0_15px_rgba(197,160,89,0.05)] flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--antique-gold)]/10 flex items-center justify-center flex-shrink-0">
                       <ShieldCheck className="w-6 h-6 text-[var(--antique-gold)]" />
                    </div>
                    <div>
                      <p className="text-base text-white font-serif mb-1">Elektronik Vekalet Onaylandı</p>
                      <p className="text-sm text-[var(--ivory)]/70">İmza Sahibi: <span className="font-semibold text-[var(--ivory)]">{proxy.customerName}</span></p>
                      <p className="text-xs text-[var(--ivory)]/40 mt-1">Tarih: {new Date(proxy.consentDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dry Aged */}
          {user.dryAgedOrders.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-serif text-[var(--antique-gold)] flex items-center gap-3 border-b border-[var(--taupe-surface)] pb-3">
                <CalendarClock className="w-6 h-6" /> Dry-Aged (Özel Dinlendirme) Dolabınız
              </h2>
              <div className="grid gap-6">
                {user.dryAgedOrders.map((order) => (
                  <div key={order.id} className="bg-[#2A1B1A]/40 border border-[var(--taupe-surface)] rounded-3xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                      <div>
                        <p className="text-xs text-[var(--ivory)]/50 uppercase font-medium tracking-wider mb-1">Dinlendirme Süreci</p>
                        <h3 className="text-2xl font-serif text-white">{order.meatType}</h3>
                        <p className="text-[var(--ivory)]/70 mt-2 flex items-center gap-3 text-sm">
                          <span className="bg-black/40 px-3 py-1.5 rounded-lg border border-[var(--taupe-surface)]">Ağırlık: <b className="text-white">{order.startWeightKg} KG</b></span>
                          <span className="bg-black/40 px-3 py-1.5 rounded-lg border border-[var(--taupe-surface)]">Hedef: <b className="text-[var(--antique-gold)]">{order.agingDays} Gün</b></span>
                        </p>
                        <p className="text-xs text-[var(--ivory)]/40 mt-2 flex items-center gap-1.5">
                          Dolap İklimi: {order.temperature}°C Sıcaklık, {order.humidity}% Nem
                        </p>
                      </div>
                    </div>
                    <StatusStepper currentStatus={order.status} type="dry-aged" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Mağaza Siparişleri */}
          {user.orders.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-serif text-[var(--antique-gold)] flex items-center gap-3 border-b border-[var(--taupe-surface)] pb-3">
                <Package className="w-6 h-6" /> Sipariş Geçmişiniz
              </h2>
              <div className="grid gap-6">
                {user.orders.map((order) => (
                  <div key={order.id} className="bg-[#2A1B1A]/40 border border-[var(--taupe-surface)] rounded-3xl p-6 md:p-8">
                    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                      <div>
                        <p className="text-xs text-[var(--antique-gold)] font-bold uppercase tracking-widest mb-1.5 drop-shadow-[0_0_10px_var(--antique-gold)]">
                          SİPARİŞ NO: #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-2xl font-serif text-white">₺{order.totalAmount}</p>
                        <p className="text-sm text-[var(--ivory)]/50 mt-1">{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <StatusStepper currentStatus={order.status} type="order" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Boş Durum */}
          {user.shares.length === 0 && user.orders.length === 0 && user.dryAgedOrders.length === 0 && (
            <div className="text-center py-24 bg-[#2A1B1A]/20 rounded-3xl border border-[var(--taupe-surface)] border-dashed mx-auto mt-4 backdrop-blur-sm">
               <ShieldCheck className="w-12 h-12 text-[var(--ivory)]/20 mx-auto mb-4" />
              <p className="text-[var(--ivory)]/70 text-lg font-medium">Şu anda hesabınıza tanımlı aktif bir veri bulunmuyor.</p>
              <p className="text-[var(--ivory)]/40 text-sm mt-2 max-w-sm mx-auto">Sipariş verdiğinizde veya kurban hissesine katıldığınızda tüm takip süreçleri burada, uçtan uca şifrelenmiş olarak belirecektir.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
