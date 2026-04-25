"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Beef, ScanEye, MousePointer2, ShoppingCart, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Seamless Geometric SVG Polygon Coordinates (1000x700 viewBox)
// These polygons share exact vertices, perfectly fitting together like an origami bull.
const BUYUKBAS_REGIONS = [
  { id: "head_neck", label: "Kafa & Gerdan", path: "M100,250 L120,200 L180,150 L330,160 L320,340 L240,360 L140,300 Z", cx: 230, cy: 250, slugs: ["dana-dil", "dana-gerdan"] },
  { id: "rib", label: "Antrikot & Tomahawk", path: "M330,160 L600,160 L600,280 L320,340 Z", cx: 465, cy: 230, slugs: ["dana-antrikot", "dana-tomahawk"] },
  { id: "brisket", label: "Göğüs & Döş", path: "M320,340 L600,280 L600,480 L380,480 L350,460 L300,400 L240,360 Z", cx: 450, cy: 390, slugs: ["dana-dosh"] },
  { id: "front-leg", label: "Ön İncik", path: "M300,400 L350,460 L380,480 L350,680 L280,680 Z", cx: 330, cy: 560, slugs: ["dana-incik"] },
  { id: "loin", label: "Bel & Bonfile", path: "M600,160 L850,180 L800,320 L600,280 Z", cx: 710, cy: 240, slugs: ["dana-bonfile", "dana-kontrfile", "dana-tbone"] },
  { id: "flank", label: "Karın Boşluğu", path: "M600,280 L800,320 L780,450 L600,480 Z", cx: 690, cy: 380, slugs: ["dana-picanha"] },
  { id: "rump", label: "Sokum & Picanha", path: "M850,180 L950,270 L920,400 L800,320 Z", cx: 880, cy: 280, slugs: ["dana-picanha"] },
  { id: "back-leg", label: "Arka İncik / But", path: "M800,320 L920,400 L880,680 L800,680 L760,480 L780,450 Z", cx: 820, cy: 550, slugs: ["dana-incik"] }
];

const KUCUKBAS_REGIONS = [
  { id: "neck", label: "Gerdan", path: "M100,300 L150,200 L300,220 L300,400 L200,420 Z", cx: 200, cy: 300, slugs: ["kuzu-gerdan", "kuzu-uykuluk"] },
  { id: "rib", label: "Kafes & Pirzola", path: "M300,220 L550,220 L550,380 L300,400 Z", cx: 420, cy: 300, slugs: ["kuzu-pirzola"] },
  { id: "saddle", label: "Bel & Küşleme", path: "M550,220 L800,220 L800,350 L550,380 Z", cx: 670, cy: 290, slugs: ["kuzu-pirzola", "kuzu-incik"] },
  { id: "leg", label: "But (Arka)", path: "M800,220 L950,300 L900,450 L850,650 L750,650 L750,480 L800,350 Z", cx: 830, cy: 450, slugs: ["kuzu-but"] },
  { id: "shoulder", label: "Kol (Ön)", path: "M300,400 L550,380 L450,500 L350,650 L250,650 Z", cx: 400, cy: 520, slugs: ["kuzu-kol"] },
  { id: "flank", label: "Boşluk", path: "M550,380 L800,350 L750,480 L600,500 L450,500 Z", cx: 620, cy: 440, slugs: ["kuzu-incik"] }
];

import QuickViewModal from "../products/QuickViewModal";

export default function Isometric3DAnatomy({ 
  animalType, 
  activeSlug,
  products = [],
  additions = []
}: { 
  animalType: string, 
  activeSlug: string,
  products?: any[],
  additions?: any[]
}) {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const regions = animalType === "BUYUKBAS" ? BUYUKBAS_REGIONS : KUCUKBAS_REGIONS;

  // Find products for a given region (based on slugs)
  const getRegionProducts = (slugs: string[]) => {
    return products.filter(p => slugs.includes(p.meatGuideSlug));
  };

  return (
    <div className="w-full bg-gradient-to-br from-[var(--deep-espresso)] to-[var(--charcoal-black)] border border-[var(--antique-gold)]/10 rounded-2xl sm:rounded-[2.5rem] overflow-hidden relative shadow-2xl mt-12 isolate group">
      
      {/* HUD Info Status Bar */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
         <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-[var(--antique-gold)]/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]">
            <ScanEye className="w-5 h-5 text-[var(--antique-gold)] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--antique-gold)] uppercase">İnteraktif Kesim Haritası</span>
         </div>
         {hoveredRegion && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-antique-gold text-deep-espresso px-4 py-2 rounded-xl border border-white/20 shadow-xl"
            >
               <span className="text-[10px] uppercase font-bold tracking-tighter">İncelenen Bölge:</span>
               <div className="text-sm font-display font-bold">{regions.find(r => r.id === hoveredRegion)?.label}</div>
            </motion.div>
         )}
      </div>
      
      {/* Commercial Tooltip (Dinamik Fiyat Gösterici) */}
      <AnimatePresence>
        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            {getRegionProducts(regions.find(r => r.id === hoveredRegion)?.slugs || []).length > 0 ? (
              <div className="bg-black/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-antique-gold/40 shadow-[0_30px_60px_rgba(0,0,0,0.8)] min-w-[240px]">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-antique-gold/20 flex items-center justify-center text-antique-gold">
                       <ShoppingCart size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-ivory/40 uppercase tracking-widest font-bold">Stokta Mevcut</div>
                      <div className="text-antique-gold font-display font-bold">Hemen Satın Al</div>
                    </div>
                 </div>
                 <div className="space-y-3">
                   {getRegionProducts(regions.find(r => r.id === hoveredRegion)?.slugs || []).slice(0, 2).map(p => (
                     <div key={p.id} className="flex justify-between items-center gap-8 border-t border-white/5 pt-3">
                        <span className="text-white text-xs font-semibold">{p.name}</span>
                        <span className="text-white font-display font-bold">₺{p.price}</span>
                     </div>
                   ))}
                 </div>
                 <div className="mt-6 flex items-center gap-2 text-[10px] text-ivory/30">
                    <Info size={12} />
                    <span>Tıklayarak detayları ve pişirme seçeneklerini görün</span>
                 </div>
              </div>
            ) : (
              <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/50 text-xs">
                 Bu bölge için aktif ürün bulunamadı
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kullanım İpucu Box */}
      <div className="absolute bottom-6 right-6 z-20 max-w-[320px] text-right hidden lg:block">
        <div className="bg-black/90 backdrop-blur-md p-5 rounded-3xl border border-[var(--taupe-surface)] shadow-2xl">
           <p className="text-sm text-[var(--ivory)]/70 flex items-start gap-3 text-left leading-relaxed">
             <MousePointer2 className="w-7 h-7 text-[var(--antique-gold)] flex-shrink-0 mt-0.5" />
             Fare ile "Geometric Wireframe" panelleri üzerinde gezinerek fiyatları görün, tıklayarak çiğ veya pişmiş siparişinizi oluşturun.
           </p>
        </div>
      </div>
      
      {/* Interactive Seamless SVG Map Viewport */}
      <div className="w-full relative min-h-[300px] sm:min-h-[500px] h-[45vh] sm:h-[60vh] max-h-[800px] flex items-center justify-center overflow-x-auto overflow-y-hidden p-2 sm:p-10">
        
        {/* Abstract Low-Poly Vector Drawing */}
        <div className="relative w-full h-full max-w-[1200px] flex items-center justify-center">
            
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 700" 
            className="filter drop-shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-transform duration-700 hover:scale-[1.02]"
            style={{ overflow: "visible" }}
          >
            {/* Outline Glow Effect */}
            <g strokeWidth={4} stroke="rgba(212,175,55,0.2)" strokeLinejoin="round" fill="none">
               {regions.map((r) => <path key={`glow-${r.id}`} d={r.path} />)}
            </g>

            {/* Interactive Polygon Paths */}
            {regions.map((region) => {
              const isActive = region.slugs.includes(activeSlug);
              const isHovered = hoveredRegion === region.id;
              const regionProducts = getRegionProducts(region.slugs);
              
              return (
                <g 
                  key={region.id}
                  className="cursor-pointer transition-all duration-300 pointer-events-auto"
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => {
                    if (regionProducts.length > 0) {
                      setSelectedProduct(regionProducts[0]);
                    } else if (region.slugs.length > 0) {
                      router.push(`/rehber/${region.slugs[0]}`);
                    }
                  }}
                >
                  <path 
                    d={region.path}
                    className="transition-all duration-[400ms] ease-out outline-none"
                    fill={isActive ? 'rgba(212,175,55,0.3)' : isHovered ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.4)'}
                    stroke={isActive || isHovered ? 'rgba(212,175,55,1)' : 'rgba(212,175,55,0.4)'}
                    strokeWidth={isActive ? 3 : isHovered ? 2 : 1}
                    strokeLinejoin="round"
                    style={{
                      filter: isActive || isHovered ? 'drop-shadow(0 0 15px rgba(212,175,55,0.6))' : 'none',
                    }}
                  />
                  
                  {/* Fixed Label Centered in Polygon */}
                  <text 
                    x={region.cx} 
                    y={region.cy} 
                    textAnchor="middle" 
                    alignmentBaseline="middle"
                    className={`font-black tracking-wider sm:tracking-widest uppercase transition-all duration-300 pointer-events-none select-none
                      ${isActive ? 'fill-white text-[11px] sm:text-xl' : isHovered ? 'fill-[var(--antique-gold)] text-[10px] sm:text-lg' : 'fill-white/60 text-[9px] sm:text-sm'}`}
                    style={{ 
                       textShadow: isActive || isHovered ? '0px 5px 15px rgba(0,0,0,1), 0px 0px 10px rgba(212,175,55,0.8)' : '0px 2px 5px rgba(0,0,0,1)',
                       transform: `translate(0, ${isActive ? '-5px' : '0'})`
                    }}
                  >
                    {region.label}
                  </text>
                  
                  {/* Active Indicator or Action Hint under label */}
                  {(isActive || isHovered) && (
                    <text
                       x={region.cx}
                       y={region.cy + 25}
                       textAnchor="middle"
                       alignmentBaseline="middle"
                       className={`font-bold tracking-[0.2em] text-[10px] sm:text-xs pointer-events-none select-none animate-pulse ${isActive ? 'fill-green-400' : 'fill-white'}`}
                       style={{ textShadow: "0 2px 4px black" }}
                    >
                      {isActive ? '● Görüntülenen Bölge' : regionProducts.length > 0 ? `₺${regionProducts[0].price} | SATIN AL` : '► İNCELE'}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          
        </div>
      </div>
      
      {/* Quick View Modal Integration */}
      {selectedProduct && (
        <QuickViewModal 
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          additions={additions}
        />
      )}

      {/* Motif & Branding */}
      <div className="absolute top-6 right-6 sm:top-auto sm:right-auto sm:bottom-6 sm:left-6 w-auto z-20 pointer-events-none">
        <div className="flex items-center gap-3 bg-black/50 px-5 py-2.5 rounded-2xl backdrop-blur-xl border border-[var(--taupe-surface)]">
          <ShoppingCart className="w-5 h-5 text-[var(--antique-gold)]" />
          <span className="text-xs font-bold text-[var(--ivory)] uppercase tracking-[0.2em]">
             {animalType === "BUYUKBAS" ? "Büyükbaş (Dana)" : "Küçükbaş (Kuzu)"} - Commercial Anatomy Map
          </span>
        </div>
      </div>
    </div>
  );
}
