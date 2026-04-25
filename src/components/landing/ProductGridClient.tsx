"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "../products/QuickViewModal";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "hepsi", label: "Tümü" },
  { key: "kirmizi-et", label: "Kırmızı Et" },
  { key: "sarkuteri", label: "Şarküteri" },
  { key: "kofteler", label: "Köfteler" },
];

export default function ProductGridClient({ products, additions }: { products: any[], additions: any[] }) {
  const [activeCategory, setActiveCategory] = useState("hepsi");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const filtered =
    activeCategory === "hepsi"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category Filter - Mobile Horizontal Scroll */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-8 pb-2 px-2 -mx-2 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:mx-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap uppercase tracking-widest",
              activeCategory === cat.key
                ? "bg-antique-gold text-deep-espresso shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105"
                : "bg-taupe-surface text-ivory/40 border border-white/5 hover:border-antique-gold/30 hover:text-ivory"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {filtered.slice(0, 8).map((product: any) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onOpenQuickView={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct}
          additions={additions}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
