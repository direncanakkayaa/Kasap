"use client";

import { useState } from "react";
import {
  calculateShareDistribution,
  MEAT_CATEGORIES,
} from "@/lib/share-calculator";
import { formatKg } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Info, CheckCircle2 } from "lucide-react";

const PRESETS = [
  { label: "Küçük", weight: 210 },
  { label: "Orta", weight: 280 },
  { label: "Büyük", weight: 350 },
  { label: "Dev", weight: 420 },
];

export default function ShareCalculator() {
  const [totalKg, setTotalKg] = useState(280);
  const [selectedShare, setSelectedShare] = useState<number | null>(null);
  
  const distribution = calculateShareDistribution(totalKg);

  return (
    <div className="rounded-2xl bg-taupe-surface border border-antique-gold/10 overflow-hidden shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-burgundy-dark/60 via-burgundy-dark/40 to-transparent border-b border-antique-gold/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-antique-gold/5 blur-[80px] rounded-full pointer-events-none" />
        <h3 className="font-display text-2xl font-bold text-ivory mb-2 relative z-10">
          Hisse Dağılım Hesaplayıcı
        </h3>
        <p className="text-sm text-ivory/60 max-w-lg relative z-10">
          Karkas ağırlığını seçin veya kaydırıcı ile ayarlayın. Hisse başına düşen net et miktarını ve dağılımını interaktif olarak görün.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-10">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="text-sm font-semibold text-ivory/80 uppercase tracking-widest">
              Karkas Ağırlığı Seçimi
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTotalKg(preset.weight)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
                    ${totalKg === preset.weight 
                      ? "bg-antique-gold text-charcoal-black border-antique-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105" 
                      : "bg-deep-espresso/50 text-ivory/60 border-antique-gold/20 hover:border-antique-gold/50 hover:text-ivory"}`}
                >
                  {preset.label} ({preset.weight}kg)
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-deep-espresso/30 p-4 rounded-xl border border-antique-gold/5">
            <input
              type="range"
              min={150}
              max={500}
              step={10}
              value={totalKg}
              onChange={(e) => setTotalKg(Number(e.target.value))}
              aria-label="Karkas Ağırlığı"
              aria-valuetext={`${totalKg} kilogram`}
              className="flex-1 h-2 rounded-full appearance-none bg-charcoal-black
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-yellow-300 [&::-webkit-slider-thumb]:to-antique-gold [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all"
            />
            <div className="flex flex-col items-end min-w-[80px]">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold antique-gold-gradient tracking-tight">{totalKg}</span>
                <span className="text-sm text-ivory/50 font-medium">kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Breakdown Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-ivory/80 uppercase tracking-widest">
              Hisse Başına Et Dağılımı (1/7)
            </h4>
            <div className="text-right">
              <span className="text-2xl font-bold text-ivory">{formatKg(distribution.perShareKg)}</span>
              <span className="text-xs text-ivory/50 ml-1">Toplam</span>
            </div>
          </div>
          
          {/* Graphic Bar that scales based on total volume */}
          <div className="w-full bg-black/20 rounded-full h-8 sm:h-10 p-1 border border-antique-gold/10">
            <div 
              className="relative h-full rounded-full overflow-hidden flex shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out"
              style={{ width: `${(totalKg / 500) * 100}%`, minWidth: '15%' }}
            >
              {MEAT_CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.key}
                  className="h-full relative group hover:opacity-90 cursor-help flex items-center justify-center overflow-hidden"
                  style={{
                    width: `${cat.percentage * 100}%`,
                    backgroundColor: cat.color,
                    borderRight: idx !== MEAT_CATEGORIES.length - 1 ? '1px solid rgba(0,0,0,0.3)' : 'none'
                  }}
                  title={`${cat.label} - ${formatKg(distribution[cat.key])}`}
                >
                  {/* Tooltip hint on hover */}
                  <div className="absolute inset-x-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center z-20 pointer-events-none">
                    <div className="bg-charcoal-black text-ivory text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap shadow-xl">
                      {formatKg(distribution[cat.key])}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 sm:gap-2">
            {MEAT_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-ivory/70">{cat.label}</span>
                <span className="text-sm font-bold text-ivory ml-1">{formatKg(distribution[cat.key])}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7 Shares Interactive Grid */}
        <div className="pt-6 border-t border-antique-gold/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-ivory/80 uppercase tracking-widest">
              Hisse Seçimi
            </h4>
            <span className="text-xs text-ivory/50 flex items-center gap-1 hidden sm:flex">
              <Info size={14} /> Bir hisse seçerek havuza katılın
            </span>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {Array.from({ length: 7 }, (_, i) => {
              const num = i + 1;
              const isSelected = selectedShare === num;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedShare(num)}
                  aria-label={`${num}. Hisse`}
                  aria-pressed={isSelected}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group
                    ${isSelected 
                      ? "bg-antique-gold border-antique-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105" 
                      : "bg-burgundy/20 border-antique-gold/10 hover:border-antique-gold/40 hover:bg-burgundy-dark/60 hover:shadow-lg"
                    } border`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 shadow-md">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                  <span className={`text-2xl sm:text-3xl font-bold transition-colors ${isSelected ? "text-charcoal-black" : "text-ivory/60 group-hover:text-antique-gold"}`}>
                    {num}
                  </span>
                  <span className={`text-[10px] sm:text-xs uppercase tracking-wider mt-1 sm:mt-2 transition-colors ${isSelected ? "text-charcoal-black/70" : "text-ivory/40 group-hover:text-ivory/60"}`}>
                    Hisse
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Area */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedShare ? "max-h-40 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}>
             <div className="bg-antique-gold/10 border border-antique-gold/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <h5 className="text-ivory font-semibold text-sm sm:text-base">
                    {selectedShare}. Hisse Seçildi ({formatKg(distribution.perShareKg)})
                  </h5>
                  <p className="text-xs text-ivory/60 mt-1">
                    Bu hisse ile Kurban Havuzu'na katılarak grubunuzu oluşturabilirsiniz.
                  </p>
               </div>
               <Link
                href="/kurban-havuzu"
                className="shrink-0 w-full sm:w-auto px-6 py-2.5 bg-antique-gold text-charcoal-black font-bold text-sm rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
               >
                 Havuza Katıl <ArrowRight size={16} />
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
