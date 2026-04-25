import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Users, Scale, FileText, CheckCircle2 } from "lucide-react";
import { getKurbanRooms } from "@/app/actions/kurban-actions";

export const metadata: Metadata = {
  title: "Kurban Havuzu — Erdoğan Kasap",
  description: "Erdoğan Kasap Kurban Havuzu. Ortak bulun, hisseye katılın.",
};

export default async function KurbanHavuzuPage() {
  const roomsResult = await getKurbanRooms();
  const rooms = roomsResult.success ? roomsResult.data : [];

  return (
    <div className="section-padding min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <Link
          href="/kurban"
          className="inline-flex items-center gap-2 text-sm text-ivory/50 hover:text-antique-gold transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Kurban Ana Sayfasına Dön
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center">
              <Users size={24} className="text-antique-gold" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ivory">
                Kurban Havuzu
              </h1>
              <p className="text-sm text-ivory/50 mt-1">
                Ortak arayan kurban odalarına katılın, hissenizi hemen ayırtın.
              </p>
            </div>
          </div>
          <p className="text-ivory/60 leading-relaxed max-w-3xl">
            Sizin için özenle seçilmiş, İslami usullere uygun kesilecek büyükbaş hayvanlarımızdan oluşan güncel havuzu inceleyin. Eksik hissesi olan gruplara dâhil olabilir, hisse ortaklarınızla otomatik WhatsApp grubu üzerinden iletişim kurabilirsiniz.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="p-6 rounded-2xl bg-taupe-surface border border-antique-gold/10 relative overflow-hidden group hover:border-antique-gold/30 transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-antique-gold/5 rounded-full blur-2xl group-hover:bg-antique-gold/10 transition-colors" />
              <Scale className="text-antique-gold mb-4" size={28} />
              <h3 className="text-ivory font-display font-semibold mb-2">Eşit Dağılım</h3>
              <p className="text-sm text-ivory/60">Kemiksiz etler ve sakatatlar 7 eşit parçaya hassas terazilerle bölünerek paketlenir.</p>
           </div>
           <div className="p-6 rounded-2xl bg-taupe-surface border border-antique-gold/10 relative overflow-hidden group hover:border-antique-gold/30 transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-antique-gold/5 rounded-full blur-2xl group-hover:bg-antique-gold/10 transition-colors" />
              <CheckCircle2 className="text-antique-gold mb-4" size={28} />
              <h3 className="text-ivory font-display font-semibold mb-2">Güvenilir Ortaklık</h3>
              <p className="text-sm text-ivory/60">Sistem üzerinden adil bir şekilde eşleşir, ortaklarınızla şeffafça tanışırsınız.</p>
           </div>
           <div className="p-6 rounded-2xl bg-taupe-surface border border-antique-gold/10 relative overflow-hidden group hover:border-antique-gold/30 transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-antique-gold/5 rounded-full blur-2xl group-hover:bg-antique-gold/10 transition-colors" />
              <FileText className="text-antique-gold mb-4" size={28} />
              <h3 className="text-ivory font-display font-semibold mb-2">Dijital Süreç</h3>
              <p className="text-sm text-ivory/60">Vekaletten canlı yayına kadar tüm süreci dijital ortamda sorunsuzca takip edin.</p>
           </div>
        </div>

        {/* Room List */}
        <h2 className="text-2xl font-display font-semibold text-ivory mb-6">Mevcut Odalar</h2>
        
        {(!rooms || rooms.length === 0) ? (
          <div className="text-center p-12 bg-taupe-surface rounded-2xl border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-ivory/40" size={32} />
            </div>
            <h3 className="text-ivory font-display text-xl mb-2">Şu an açık oda bulunmuyor.</h3>
            <p className="text-ivory/50">Lütfen daha sonra tekrar kontrol edin veya kendi odanızı oluşturmak için iletişime geçin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room: any) => {
              const totalShares = 7;
              const soldShares = room.shares.filter((s: any) => s.status !== "MUSAIT").length;
              const availableShares = totalShares - soldShares;
              const progressPercentage = (soldShares / totalShares) * 100;

              return (
                <Link
                  href={`/kurban-havuzu/${room.id}`}
                  key={room.id}
                  className="group block rounded-2xl bg-taupe-surface border border-white/5 hover:border-antique-gold/40 transition-all overflow-hidden relative"
                >
                  {/* Status Ribbon */}
                  {availableShares === 0 && (
                    <div className="absolute top-4 -right-10 bg-green-500/80 text-white text-[10px] font-bold py-1 px-10 rotate-45 z-10">
                      DOLDU
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs font-medium text-antique-gold mb-1">ODA #{room.id.slice(-5).toUpperCase()}</div>
                        <h3 className="text-lg font-display font-semibold text-ivory">{room.breed} Cinsi Büyükbaş</h3>
                      </div>
                      <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-ivory/70 border border-white/10">
                        {room.totalKg} kg
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-ivory/60">Doluluk</span>
                        <span className="text-ivory font-medium">{soldShares} / {totalShares} Hisse</span>
                      </div>
                      <div className="w-full h-2 bg-charcoal-black rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-antique-gold transition-all duration-1000 ease-out" 
                           style={{ width: `${progressPercentage}%` }}
                         />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ivory/50">
                        {availableShares > 0 ? `${availableShares} boş hisse kaldı` : "Oda tamamlandı"}
                      </span>
                      <span className="text-antique-gold group-hover:underline flex items-center gap-1">
                        Sıraya Gir <ArrowLeft className="rotate-180 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
