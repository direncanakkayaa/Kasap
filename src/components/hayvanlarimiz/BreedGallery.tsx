"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function BreedGallery({ images, alt, name }: { images: string[]; alt: string; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Sadece 1'den fazla resim varsa carousel çalışsın
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, 4000); // 4 saniyede bir geçiş

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative rounded-[2rem] overflow-hidden group w-full aspect-[4/3] shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-black/90 via-charcoal-black/20 to-transparent z-10" />
      
      {/* Resimler */}
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${alt} görünüm ${index + 1}`}
            className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[4000ms]"
          />
        </div>
      ))}
      
      {/* Gösterge (Dots) */}
      {images.length > 1 && (
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? "w-6 bg-antique-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]" 
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* İsim ve Parlama Efekti */}
      <div className="absolute bottom-8 left-8 z-20">
        <h3 className="text-4xl font-display font-bold text-ivory drop-shadow-xl flex items-center gap-3">
          {name}
          <Sparkles className="text-antique-gold animate-pulse" size={24} />
        </h3>
      </div>
    </div>
  );
}
