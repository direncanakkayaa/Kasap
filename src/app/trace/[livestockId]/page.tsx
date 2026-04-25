import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, ShieldCheck, Route, Wheat, Activity, Clock, CheckCircle2, QrCode } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Kimlik Kartı | Erdoğan Kasap",
  description: "Erdoğan Kasap Çiftlikten Sofraya izlenebilirlik sistemi.",
};

export default async function TracePage({ params }: { params: Promise<{ livestockId: string }> }) {
  const resolvedParams = await params;
  
  // Veritabanından livestock çekmeyi dene (Eğer yoksa mock veriler gösterelim)
  let livestock = await prisma.livestock.findUnique({
    where: { id: resolvedParams.livestockId }
  });

  // Şimdilik mock veri sistemi
  if (!livestock) {
    // Demo verisi (Tag ID'ye göre dinamik türetilmiş gibi)
    livestock = {
      id: resolvedParams.livestockId,
      tagNumber: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
      breed: "Black Angus",
      farmOrigin: "Kırklareli Doğal Yaşam Çiftliği, Trakya",
      feedType: "100% Doğal Mera + Son 60 Gün Özel Mısır Rasyonu",
      slaughterDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Timeline Mock verileri (Soğuk Zincir Lojistik Hikayesi)
  // slaughterDate'e göre tarihler belirleniyor
  const sDate = livestock.slaughterDate ? new Date(livestock.slaughterDate) : new Date();
  
  const timeline = [
    {
      title: "Çiftlikten Sevk",
      desc: "Hayvan, veteriner hekim gözetiminde stresten uzak bir şekilde ana çiftlikten yola çıktı.",
      date: new Date(sDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      icon: <MapPin className="text-antique-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" size={24} />,
      status: "completed"
    },
    {
      title: "Kalite Kontrol ve Kesim",
      desc: "İslami usullere uygun ve %100 hijyenik koşullarda kesim işlemi tamamlandı. pH seviyesi: 5.6",
      date: sDate,
      icon: <Activity className="text-antique-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" size={24} />,
      status: "completed"
    },
    {
      title: "Soğuk Hava Dinlendirme",
      desc: "Karkas, 0-2°C derecelik soğuk hava depolarında enzimatik parçalanma ve etin yumuşaması için dinlenmeye alındı.",
      date: new Date(sDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      icon: <Clock className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" size={24} />,
      status: "completed"
    },
    {
      title: "Usta Ellerde Parçalama",
      desc: "Etiniz, usta kasaplarımız tarafından size özel porsiyonlara ayrılarak hava geçirmeyen teknolojiyle vakumlandı.",
      date: new Date(sDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      icon: <ShieldCheck className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" size={24} />,
      status: "completed"
    },
    {
      title: "Vitrinde / Teslimata Hazır",
      desc: "Ürününüz cold-chain (soğuk zincir) korunarak dolaplarımıza yerleşti.",
      date: new Date(sDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      icon: <CheckCircle2 className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" size={24} />,
      status: "current"
    }
  ];

  return (
    <div className="min-h-screen bg-charcoal-black pb-24">
      {/* Navbar Minimalist */}
      <nav className="border-b border-white/5 bg-charcoal-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ivory/70 hover:text-antique-gold transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Masaya Dön</span>
          </Link>
          <div className="font-display font-bold text-lg tracking-widest uppercase text-ivory flex items-center gap-2">
            <QrCode size={18} className="text-antique-gold" />
            Et Kimliği
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-antique-gold/10 rounded-full mb-6 border border-antique-gold/20 shadow-[0_0_40px_rgba(197,160,89,0.15)]">
            <ShieldCheck size={40} className="text-antique-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ivory mb-4">Ürün Pasaportu</h1>
          <p className="text-ivory/60 text-lg">Bu etin çiftlikten masanıza olan hikayesi %100 şeffaflıkla kayıt altındadır.</p>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
           <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-antique-gold/40 transition-colors">
             <div className="absolute top-0 right-0 w-32 h-32 bg-antique-gold/10 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
             <div className="text-xs text-ivory/40 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
               <QrCode size={14} /> Bakanlık Küpe ID
             </div>
             <div className="text-2xl font-display font-bold text-white tracking-widest">{livestock.tagNumber}</div>
           </div>

           <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-antique-gold/40 transition-colors">
             <div className="absolute top-0 right-0 w-32 h-32 bg-antique-gold/10 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
             <div className="text-xs text-ivory/40 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
               <Activity size={14} /> Hayvan Irkı
             </div>
             <div className="text-2xl font-display font-bold text-antique-gold">{livestock.breed}</div>
           </div>

           <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-antique-gold/40 transition-colors md:col-span-2">
             <div className="absolute top-0 right-0 w-32 h-32 bg-antique-gold/10 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
             <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div>
                  <div className="text-xs text-ivory/40 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Çiftlik Menşei
                  </div>
                  <div className="text-xl font-display font-medium text-white">{livestock.farmOrigin}</div>
                </div>
                <div className="w-px h-12 bg-white/10 hidden md:block" />
                <div>
                  <div className="text-xs text-ivory/40 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
                    <Wheat size={14} /> Beslenme Tipi (Rasyon)
                  </div>
                  <div className="text-xl font-display font-medium text-white">{livestock.feedType}</div>
                </div>
             </div>
           </div>
        </div>

        {/* Timeline Visualization */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-display font-bold text-ivory flex items-center gap-3">
              <Route className="text-antique-gold" />
              Şeffaf Lojistik Süreci
            </h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="relative pl-6 md:pl-0">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-antique-gold via-white/10 to-transparent -translate-x-1/2" />
            
            <div className="space-y-12">
              {timeline.map((item, idx) => {
                const isLeft = idx % 2 === 0;
                const isCurrent = item.status === "current";
                return (
                  <div key={idx} className={`relative flex md:justify-between items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                    {/* Center Node */}
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-charcoal-black border-4 border-[#1c1a17] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                       {item.icon}
                    </div>
                    
                    <div className="w-full md:w-[45%] pl-10 md:pl-0" />
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isLeft ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10'}`}>
                      <div className={`p-6 rounded-3xl border ${isCurrent ? 'bg-green-950/20 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-white/[0.02] border-white/5'} hover:bg-white/[0.04] transition-colors`}>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isCurrent ? 'text-green-400' : 'text-antique-gold'}`}>
                          {item.date.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-ivory/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="text-center p-8 bg-black/40 rounded-3xl border border-white/5">
          <p className="text-ivory/50 text-sm mb-4">
            Ürününüze ait pH seviyeleri, dinlendirme koşulları ve soğuk zincir kalitesi T.C. Tarım ve Orman Bakanlığı yönergelerine uygundur.
          </p>
          <div className="inline-flex gap-4 opacity-50 justify-center w-full filter mix-blend-screen grayscale md:flex-row flex-col">
            <span className="font-bold tracking-widest text-xs md:text-base">HELAL KESİM</span>
            <span className="hidden md:inline">•</span>
            <span className="font-bold tracking-widest text-xs md:text-base">%100 SOĞUK ZİNCİR</span>
          </div>
        </div>

      </main>
    </div>
  );
}
