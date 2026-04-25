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
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "px-5 py-2 text-sm font-medium rounded-full transition-all duration-300",
              activeCategory === cat.key
                ? "bg-antique-gold text-deep-espresso shadow-lg"
                : "bg-taupe-surface text-ivory/60 border border-white/5 hover:border-antique-gold/30 hover:text-ivory"
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
