"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PlayCircle, ShieldCheck, ListOrdered, Calendar } from "lucide-react";

export default function CanliKesimPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("stream"); // stream or schedule

  const schedule = [
    { time: "08:00", no: "124-A", type: "Büyükbaş", status: "Tamamlandı" },
    { time: "09:30", no: "125-B", type: "Büyükbaş", status: "Devam Ediyor" },
    { time: "11:00", no: "126-C", type: "Büyükbaş", status: "Bekliyor" },
    { time: "13:30", no: "127-D", type: "Kuzu", status: "Bekliyor" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[var(--deep-espresso)]/40">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--antique-antique-gold)]">Canlı Kesim & Takip</h1>
          {session?.user && (
            <div className="inline-block bg-[var(--antique-antique-gold)]/20 text-[var(--antique-antique-gold)] px-4 py-1.5 rounded-full border border-[var(--taupe-surface)] font-medium text-sm">
              Hoş Geldiniz, <span className="font-bold">{session.user.name?.split(' ')[0]}</span>. Yayın şifrelenmiş özel hattır.
            </div>
          )}
          <p className="text-[var(--ivory)]/70 text-lg max-w-2xl mx-auto">
            100% Şeffaflık ve İslami usullere tam uyum ilkemizle, kurban kesim anını canlı yayın üzerinden takip edebilir, sıranızı öğrenebilirsiniz.
            100% Şeffaflık ve İslami usullere tam uyum ilkemizle, kurban kesim anını canlı yayın üzerinden takip edebilir, sıranızı öğrenebilirsiniz.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("stream")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${activeTab === "stream"
                ? "bg-[var(--antique-antique-gold)] text-[var(--deep-espresso)] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                : "bg-[#2A1B1A] text-[var(--ivory)]/70 border border-[var(--taupe-surface)]"
              }`}
          >
            Canlı Yayın
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${activeTab === "schedule"
                ? "bg-[var(--antique-antique-gold)] text-[var(--deep-espresso)] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                : "bg-[#2A1B1A] text-[var(--ivory)]/70 border border-[var(--taupe-surface)]"
              }`}
          >
            Kesim Sırası
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-[#2A1B1A]/60 backdrop-blur-md rounded-3xl border border-[var(--taupe-surface)] p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--antique-antique-gold)]/5 rounded-bl-full blur-3xl pointer-events-none" />

          {activeTab === "stream" ? (
            <div className="space-y-6">
              <div className="aspect-video w-full bg-black rounded-xl border border-[var(--taupe-surface)]/50 flex flex-col items-center justify-center relative overflow-hidden group">
                <PlayCircle className="w-20 h-20 text-[var(--antique-antique-gold)]/40 group-hover:text-[var(--antique-antique-gold)] transition-colors cursor-pointer z-10" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Canlı</span>
                </div>
                {/* Mock Stream Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623198457-7aad066a4d6e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center p-4 bg-black/30 rounded-xl border border-[var(--taupe-surface)]/30">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[var(--antique-antique-gold)] w-6 h-6" />
                  <div>
                    <p className="text-white font-medium">İslami Usullere Uygun</p>
                    <p className="text-[var(--ivory)]/50 text-sm">Kesimlerimiz vekalet okunarak yapılmaktadır.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--ivory)]/50">Şu An Kesimde Olan No</p>
                  <p className="text-2xl font-serif text-[var(--antique-antique-gold)]">125-B</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <ListOrdered className="w-6 h-6 text-[var(--antique-antique-gold)]" />
                <h2 className="text-2xl font-serif text-white">Tahmini Kesim Saatleri</h2>
              </div>

              <div className="grid gap-4">
                {schedule.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl border border-[var(--taupe-surface)] bg-black/40 hover:bg-black/60 transition-colors">
                    <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2A1B1A] border border-[var(--antique-antique-gold)]/30">
                        <Calendar className="w-6 h-6 text-[var(--antique-antique-gold)]" />
                      </div>
                      <div>
                        <p className="text-2xl font-serif text-white">{item.time}</p>
                        <p className="text-[var(--ivory)]/60 text-sm">{item.type} Türü</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-12">
                      <div className="text-center sm:text-right">
                        <p className="text-sm text-[var(--ivory)]/50">Kesim No</p>
                        <p className="text-lg font-bold text-white">{item.no}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${item.status === 'Tamamlandı' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          item.status === 'Devam Ediyor' ? 'bg-[var(--antique-antique-gold)]/10 text-[var(--antique-antique-gold)] border-[var(--antique-antique-gold)]/20 animate-pulse' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
