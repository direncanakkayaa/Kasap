"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ShoppingCart, Flame, ChevronRight } from "lucide-react";
import QuickViewModal from "./QuickViewModal";

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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === "hepsi" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Navigation & Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between sticky top-24 z-40 bg-charcoal-black/80 backdrop-blur-xl py-6 border-b border-white/5">
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat.id 
                  ? 'bg-antique-gold border-antique-gold text-deep-espresso shadow-[0_5px_15px_rgba(197,160,89,0.3)]' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-antique-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Ürün veya lezzet ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-antique-gold/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {filteredProducts.map((p) => (
            <div 
              key={p.id}
              className="group relative bg-taupe-surface border border-white/5 rounded-[2rem] overflow-hidden hover:border-antique-gold/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Badge */}
              {p.isCookable && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-orange-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                   <Flame size={12} />
                   ŞEFİN SEÇİMİ (PİŞİRİLEBİLİR)
                </div>
              )}

              {/* Image Container */}
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <img 
                  src={p.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800"} 
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <button 
                    onClick={() => setSelectedProduct(p)}
                    className="bg-white text-deep-espresso px-6 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-antique-gold transition-colors flex items-center gap-2"
                   >
                     İncele & Satın Al <ChevronRight size={16} />
                   </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                 <div className="flex justify-between items-start mb-3">
                   <h3 className="font-display font-bold text-xl text-white group-hover:text-antique-gold transition-colors">{p.name}</h3>
                   <div className="text-xl font-display font-bold text-antique-gold">₺{p.price}</div>
                 </div>
                 <p className="text-ivory/50 text-sm leading-relaxed mb-6 line-clamp-2">{p.description}</p>
                 
                 <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">{p.unit} Fiyatıdır</span>
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      className="text-antique-gold group-hover:bg-antique-gold group-hover:text-deep-espresso p-2 rounded-xl transition-all border border-antique-gold/20"
                    >
                       <ShoppingCart size={18} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
           <div className="text-4xl mb-4">🔍</div>
           <h3 className="text-ivory font-display text-xl">Aradığınız kriterde ürün bulunamadı.</h3>
           <p className="text-ivory/40">Filtreleri değiştirmeyi deneyebilir veya bizimle iletişime geçebilirsiniz.</p>
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
