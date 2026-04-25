"use client";

import Link from "next/link";
import { Search, Home, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
        <span className="font-playfair text-6xl font-bold text-gold">404</span>
      </div>
      
      <h1 className="mb-2 font-playfair text-4xl font-bold text-ivory md:text-5xl">
        Sayfa Bulunamadı
      </h1>
      
      <p className="mb-8 max-w-md text-lg text-ivory/60">
        Aradığınız lezzet bu sayfada değil gibi görünüyor. Belki başka bir reyonumuza bakmak istersiniz?
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3 font-semibold text-deep-espresso transition-all hover:bg-gold/90"
        >
          <Home className="h-5 w-5" />
          Ana Sayfaya Dön
        </Link>
        
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full border border-ivory/20 bg-ivory/5 px-8 py-3 font-semibold text-ivory transition-all hover:bg-ivory/10"
        >
          <ChevronLeft className="h-5 w-5" />
          Geri Dön
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link 
          href="/urunler" 
          className="group rounded-xl border border-ivory/10 bg-ivory/5 p-6 text-left transition-all hover:border-gold/50"
        >
          <Search className="mb-3 h-6 w-6 text-gold transition-transform group-hover:scale-110" />
          <h3 className="mb-1 font-semibold text-ivory">Ürünlerimizi Keşfedin</h3>
          <p className="text-sm text-ivory/60">En taze et çeşitleri ve kasap ürünleri.</p>
        </Link>
        
        <Link 
          href="/rehber" 
          className="group rounded-xl border border-ivory/10 bg-ivory/5 p-6 text-left transition-all hover:border-gold/50"
        >
          <Search className="mb-3 h-6 w-6 text-gold transition-transform group-hover:scale-110" />
          <h3 className="mb-1 font-semibold text-ivory">Et Rehberi</h3>
          <p className="text-sm text-ivory/60">Hangi et nasıl pişirilir? Püf noktaları burada.</p>
        </Link>
      </div>
    </div>
  );
}
