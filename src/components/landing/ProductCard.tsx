"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ShoppingCart, Info } from "lucide-react";

interface ProductCardProps {
  product: any;
  onOpenQuickView: (product: any) => void;
}

export default function ProductCard({
  product,
  onOpenQuickView
}: ProductCardProps) {
  const isGuideLink = !!product.href || !!product.meatGuideSlug;

  return (
    <div 
      onClick={() => onOpenQuickView(product)}
      className="group relative rounded-3xl overflow-hidden bg-taupe-surface border border-white/5
                  hover:border-antique-gold/30 transition-all duration-500 cursor-pointer
                  hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2"
    >
      {/* Card Top – Visual */}
      <div className="relative h-32 sm:h-56 bg-charcoal-black flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
        />

        {/* Category Badge */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <span className="text-[8px] sm:text-[10px] text-ivory/60 font-semibold tracking-widest uppercase">
            {product.category.replace('-', ' ')}
          </span>
        </div>

        {/* Hover Overlay – Info */}
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <ShoppingCart className="text-antique-gold mb-3" size={32} />
           <p className="text-white font-bold">Hızlı İncele</p>
           <p className="text-ivory/40 text-xs mt-1">Detaylar ve Pişirme Seçenekleri</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-6">
        <h3 className="font-display text-sm sm:text-xl font-bold text-ivory group-hover:text-antique-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="hidden sm:block text-sm text-ivory/40 mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] text-ivory/30 uppercase tracking-widest">Fiyat</span>
            <span className="text-sm sm:text-2xl font-display font-bold text-white">₺{product.price}</span>
          </div>
          <button className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-deep-espresso bg-antique-gold rounded-xl sm:rounded-2xl
                         shadow-[0_5px_15px_rgba(197,160,89,0.3)] hover:bg-white transition-colors">
            <ShoppingCart className="w-3 h-3 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
