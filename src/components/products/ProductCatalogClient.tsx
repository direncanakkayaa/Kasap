"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ShoppingCart, Flame, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import QuickViewModal from "./QuickViewModal";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "hepsi", label: "Tümü" },
  { id: "kirmizi-et", label: "Kırmızı Et" },
  { id: "kofteler", label: "Köfte & Burger" },
  { id: "sarkuteri", label: "Şarküteri" },
  { id: "hazir-urunler", label: "Hazır Ürünler" },
  { id: "soslar", label: "Soslar & Mezeler" },
];

export default function ProductCatalogClient({ products, additions }: { products: any[], additions: any[] }) {
  const [activeCategory, setActiveCategory] = useState("hepsi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === "hepsi" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className={cn(
        "sticky top-20 z-40 transition-all duration-300 -mx-4 px-4 py-4",
        isScrolled ? "bg-deep-espresso/90 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-antique-gold transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Canınız ne çekiyor? (Antrikot, Köfte, Sucuk...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-antique-gold/50 focus:bg-white/10 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter - Mobile Horizontal Scroll */}
            <div className="w-full md:w-auto flex flex-nowrap overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-widest border",
                    activeCategory === cat.id 
                      ? 'bg-antique-gold border-antique-gold text-deep-espresso shadow-lg' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-2">
         <div className="flex items-center gap-2 text-ivory/40">
            <SlidersHorizontal size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{filteredProducts.length} Ürün Listeleniyor</span>
         </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
          {filteredProducts.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-taupe-surface border border-white/5 transition-all duration-500 group-hover:border-antique-gold/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Badge */}
                {p.isCookable && (
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-orange-500/90 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">
                     <Flame size={10} />
                     PİŞİRİLEBİLİR
                  </div>
                )}

                {/* Image */}
                <div className="absolute inset-0">
                   <img 
                    src={p.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800"} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                   <div className="flex flex-col gap-1 mb-2">
                      <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-antique-gold transition-colors leading-tight">{p.name}</h3>
                      <div className="flex items-center justify-between">
                         <div className="text-xl font-display font-bold text-antique-gold">₺{p.price}</div>
                         <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{p.unit}</div>
                      </div>
                   </div>
                   
                   <p className="text-ivory/50 text-[11px] md:text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                     {p.description}
                   </p>

                   <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/10" />
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-antique-gold text-deep-espresso flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                         <ShoppingCart size={16} />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10 mx-2">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🔍</div>
           <h3 className="text-ivory font-display text-2xl mb-2">Kayıtlı ürün bulunamadı.</h3>
           <p className="text-ivory/40 max-w-sm mx-auto">Aradığınız kriterlere uygun ürünümüz bulunmamaktadır. Lütfen arama terimini değiştirmeyi deneyin.</p>
           <button 
             onClick={() => { setActiveCategory("hepsi"); setSearchQuery(""); }}
             className="mt-8 text-antique-gold font-bold uppercase tracking-widest text-xs hover:underline"
           >
             Tüm Filtreleri Temizle
           </button>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal 
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          additions={additions}
        />
      )}
    </div>
  );
}

