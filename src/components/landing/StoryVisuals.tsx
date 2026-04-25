"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  {
    url: "/generated/story_farm.png",
    caption: "%100 Doğal Mera Besisi"
  },
  {
    url: "/generated/story_quality.png",
    caption: "Kusursuz Mermerleşme"
  },
  {
    url: "/generated/story_modern.png",
    caption: "Modern Kasaplık Sanatı"
  },
  {
    url: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=1200",
    caption: "50 Yıllık Miras"
  }
];

export default function StoryVisuals() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${IMAGES[index].url})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Caption */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-10 left-10 right-10"
          >
            <div className="h-0.5 w-12 bg-antique-gold mb-3" />
            <span className="text-ivory font-display text-xl sm:text-2xl font-bold tracking-tight">
              {IMAGES[index].caption}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Elements for "Live" feel */}
      <div className="absolute top-6 left-6 z-10 flex gap-2">
         {IMAGES.map((_, i) => (
           <div 
             key={i} 
             className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-antique-gold' : 'w-2 bg-white/20'}`}
           />
         ))}
      </div>
      
      {/* Decorative Stamp */}
      <div className="absolute top-6 right-6 z-10 w-20 h-20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-white/5 animate-spin-slow">
         <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest text-center px-2">
            Premium Choice Since 1970
         </span>
      </div>
    </div>
  );
}
