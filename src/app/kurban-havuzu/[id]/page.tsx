import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, Scale, Beef, Timer } from "lucide-react";
import { getKurbanRoom } from "@/app/actions/kurban-actions";
import ShareCardClient from "./ShareCardClient";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return {
    title: `Oda #${params.id.slice(-5).toUpperCase()} - Kurban Havuzu`,
  };
}

export default async function KurbanRoomPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const result = await getKurbanRoom(params.id);

  if (!result.success || !result.data) {
    return notFound();
  }

  const room = result.data;
  const totalShares = 7; // Assuming cattle
  const soldShares = room.shares.filter((s: any) => s.status !== "MUSAIT").length;
  const perShareKg = (room.totalKg / 7).toFixed(1);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Navigation */}
        <Link
          href="/kurban-havuzu"
          className="inline-flex items-center gap-2 text-sm text-[var(--ivory)]/50 hover:text-[var(--antique-gold)] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Havuz Listesine Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-[#2A1B1A] border border-[var(--taupe-surface)] p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--antique-gold)]/10 blur-3xl rounded-full" />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[var(--antique-gold)] font-bold tracking-widest text-xs uppercase mb-2">
                    Kurban Odası
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-serif text-white">
                    ODA #{room.id.slice(-5).toUpperCase()}
                  </h1>
                </div>
                <div className="bg-[var(--taupe-surface)] px-4 py-2 rounded-xl text-center border border-[var(--antique-gold)]/20">
                  <span className="block text-xl font-black text-[var(--ivory)]">{room.totalKg}</span>
                  <span className="text-xs text-[var(--ivory)]/50 uppercase tracking-widest">KG Karkas</span>
                </div>
              </div>

              <p className="text-[var(--ivory)]/70 text-lg mb-8 max-w-lg leading-relaxed">
                Bu odada yer alan {room.breed} cinsi büyükbaş kurbanımız 7 eşit hisseye bölünecektir. Katılım durumunu aşağıdan takip edebilirsiniz.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat label="Irk" value={room.breed} icon={<Beef size={18} />} />
                <Stat label="Durum" value={room.status} icon={<Timer size={18} />} />
                <Stat label="Kapasite" value={`${soldShares}/7 Dolu`} icon={<Users size={18} />} />
                <Stat label="Hisse Başı Tahmini" value={`~${perShareKg} kg`} icon={<Scale size={18} />} />
              </div>
            </div>

            {/* Shares List */}
            <div>
              <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="text-[var(--antique-gold)]" />
                Hisse Dağılımı ({soldShares}/7)
              </h2>

              <div className="space-y-4">
                {room.shares.map((share: any) => (
                  <ShareCardClient key={share.id} share={share} perShareKg={perShareKg} roomId={room.id} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#2A1B1A] border border-[var(--antique-gold)]/20 rounded-3xl p-6 sm:p-8 sticky top-28 shadow-2xl">
              <h3 className="text-[var(--antique-gold)] font-bold text-lg mb-4 text-center">Nasıl Çalışır?</h3>
              <ol className="space-y-6">
                <Step num="1" title="Hisse Seçimi" desc="Müsait olan hisselerden birini rezerve edin." />
                <Step num="2" title="Onay & Vekalet" desc="Müşteri temsilcimiz sizi arayarak dijital vekalet sürecini başlatır." />
                <Step num="3" title="Grup İletişimi" desc="Oda dolduğunda diğer hissedarlarla ortak WhatsApp grubuna alınırsınız." />
                <Step num="4" title="Şeffaf Kesim" desc="Bayram günü canlı yayın ile kesim aşamasını izleyebileceksiniz." />
              </ol>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

function Stat({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 border border-[var(--taupe-surface)] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
      <div className="text-[var(--antique-gold)]">{icon}</div>
      <div>
        <div className="text-[10px] text-[var(--ivory)]/50 uppercase tracking-widest leading-none mb-1">{label}</div>
        <div className="font-semibold text-[var(--ivory)] text-sm">{value}</div>
      </div>
    </div>
  );
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--taupe-surface)] text-[var(--antique-gold)] font-bold flex items-center justify-center text-sm border border-[var(--antique-gold)]/30">
        {num}
      </div>
      <div>
        <h4 className="text-[var(--ivory)] font-medium text-sm mb-1">{title}</h4>
        <p className="text-[var(--ivory)]/50 text-xs leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}
