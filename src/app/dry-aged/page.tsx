"use client";

import { useState } from "react";
import { Search, Thermometer, Droplets, Clock, Info } from "lucide-react";

export default function DryAgedPage() {
  const [orderId, setOrderId] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  // Mock data for search
  const mockData = {
    id: "DA-2094K",
    type: "Dallas Steak",
    weight: "2.4",
    targetDays: 28,
    currentDays: 14,
    temperature: "1.2",
    humidity: "82",
    status: "Dinleniyor"
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) setIsSearched(true);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[var(--deep-espresso)]/40">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--antique-antique-gold)]">Dry-Aged Takip Sistemi</h1>
          <p className="text-[var(--ivory)]/70 text-lg max-w-3xl mx-auto">
            Etin en lezzetli halini sabırla bekleyenler için geliştirdiğimiz özel odalarımızda, 
            siparişinizin anlık dinlendirme sıcaklığı ve nem oranlarını şeffaf bir şekilde takip edebilirsiniz.
          </p>
        </div>

        {/* Process Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#2A1B1A]/80 border border-[var(--taupe-surface)] rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-2xl font-serif text-[var(--antique-antique-gold)]">21 Gün</h3>
            <p className="text-[var(--ivory)]/70 text-sm">Etin yumuşamaya başladığı, hafif cevizimsi aromaların geliştiği ilk aşama.</p>
          </div>
          <div className="bg-[var(--antique-antique-gold)]/5 border border-[var(--antique-antique-gold)]/30 rounded-2xl p-8 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--antique-antique-gold)] to-transparent"></div>
            <h3 className="text-2xl font-serif text-[var(--antique-antique-gold)]">28 Gün</h3>
            <p className="text-[var(--ivory)]/90 text-sm font-medium">Standart ve en çok tercih edilen bekleme süresi, mükemmel denge.</p>
          </div>
          <div className="bg-[#2A1B1A]/80 border border-[var(--taupe-surface)] rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-2xl font-serif text-[var(--antique-antique-gold)]">45+ Gün</h3>
            <p className="text-[var(--ivory)]/70 text-sm">Gurme lezzet arayanlar için; yoğun blue-cheese ve kavrulmuş aroma notaları.</p>
          </div>
        </div>

        {/* Tracker Search Section */}
        <div className="bg-[#2A1B1A]/90 backdrop-blur-xl rounded-3xl border border-[var(--taupe-surface)] p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {!isSearched ? (
            <div className="max-w-xl mx-auto space-y-8 text-center">
              <div className="inline-flex w-16 h-16 rounded-full bg-black/50 items-center justify-center border border-[var(--taupe-surface)] mb-4">
                <Search className="w-8 h-8 text-[var(--antique-antique-gold)]" />
              </div>
              <h2 className="text-2xl font-serif text-white">Etiniz Ne Durumda?</h2>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  placeholder="Sipariş Numaranız (Örn: DA-2094K)"
                  className="w-full bg-black/60 border border-[var(--taupe-surface)] rounded-full py-4 px-6 text-white text-center text-lg placeholder-[var(--ivory)]/30 focus:outline-none focus:border-[var(--antique-antique-gold)] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="mt-6 bg-[var(--antique-antique-gold)] hover:bg-[#A98444] text-[var(--deep-espresso)] font-bold py-3 px-10 rounded-full transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]"
                >
                  Durumu Sorgula
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10 border-b border-[var(--taupe-surface)] pb-6">
                <div>
                  <h2 className="text-3xl font-serif text-white">Sipariş: {mockData.id}</h2>
                  <p className="text-[var(--antique-antique-gold)] mt-2">{mockData.type} - {mockData.weight} kg</p>
                </div>
                <button 
                  onClick={() => setIsSearched(false)}
                  className="text-sm text-[var(--ivory)]/50 border border-[var(--taupe-surface)] px-4 py-2 rounded-lg hover:text-white transition-colors"
                >
                  Yeni Sorgu
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/40 border border-[#3A2A2A] rounded-2xl p-6 flex items-center gap-4">
                  <div className="bg-[var(--antique-antique-gold)]/10 p-3 rounded-full text-[var(--antique-antique-gold)]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--ivory)]/50">Geçen Süre</p>
                    <p className="text-2xl font-bold text-white"><span className="text-[var(--antique-antique-gold)]">{mockData.currentDays}</span> / {mockData.targetDays} Gün</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-[#3A2A2A] rounded-2xl p-6 flex items-center gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-full text-blue-400">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--ivory)]/50">Kabin Sıcaklığı</p>
                    <p className="text-2xl font-bold text-white">{mockData.temperature}°C</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-[#3A2A2A] rounded-2xl p-6 flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--ivory)]/50">Nem Oranı</p>
                    <p className="text-2xl font-bold text-white">%{mockData.humidity}</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-[#3A2A2A] rounded-2xl p-6 flex items-center gap-4">
                  <div className="bg-[var(--antique-antique-gold)]/10 p-3 rounded-full text-[var(--antique-antique-gold)]">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--ivory)]/50">Durum</p>
                    <p className="text-xl font-bold text-white">{mockData.status}</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-12 bg-black/40 p-6 rounded-2xl border border-[var(--taupe-surface)]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--ivory)]/70">Başlangıç</span>
                  <span className="text-[var(--antique-antique-gold)] font-medium">%50 Tamamlandı</span>
                  <span className="text-[var(--ivory)]/70">Hedef: {mockData.targetDays} Gün</span>
                </div>
                <div className="w-full h-3 bg-[#3A2A2A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--antique-antique-gold)] to-[#E6CA90] rounded-full relative"
                    style={{ width: `${(mockData.currentDays / mockData.targetDays) * 100}%` }}
                  >
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] mix-blend-overlay"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
