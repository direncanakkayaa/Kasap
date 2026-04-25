"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import StoryVisuals from "./StoryVisuals";

export default function AboutSection() {
  return (
    <section id="hakkimizda" className="section-padding bg-taupe-surface relative overflow-hidden">
      {/* Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-antique-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Görsel Alan - Artık Dinamik */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <StoryVisuals />
            {/* Floating Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-4 -right-4 bg-antique-gold text-deep-espresso px-6 py-3 rounded-xl
                           font-display text-lg font-bold shadow-2xl z-20"
            >
              2010&apos;dan Beri
            </motion.div>
          </motion.div>

          {/* İçerik */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-antique-gold text-xs font-semibold tracking-[0.2em] uppercase">
              Hikayemiz
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ivory mt-3 mb-6 leading-tight">
              Antalya&apos;nın{" "}
              <span className="antique-gold-gradient">Lezzet Mirası</span>
            </h2>

            <div className="space-y-4 text-ivory/70 leading-relaxed">
              <p>
                Kasap Erdoğan, 2010 yılında Antalya Muratpaşa Yalı Caddesi&apos;nde başlayan 
                lezzet yolculuğuna, bugün Muratpaşa ve Lara şubeleriyle devam etmektedir. 
                Geleneksel kasaplık sanatını, Akdeniz&apos;in en taze etleriyle buluşturuyoruz.
              </p>
              <p>
                Muratpaşa Yalı Caddesi&apos;ndeki ilk şubemizden aldığımız ilhamla, 
                Lara şubemizde de kalite ve güven standartlarımızdan ödün vermeden 
                misafirlerimize en iyisini sunuyoruz.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-8 p-6 rounded-xl border border-antique-gold/10 bg-deep-espresso/50 relative">
              <Quote size={20} className="text-antique-gold/30 absolute top-4 left-4" />
              <p className="text-ivory/60 italic pl-8 font-display text-lg">
                &ldquo;Antalya&apos;nın her sofrasında Kasap Erdoğan güveni ve 
                lezzetinin olması en büyük gururumuzdur.&rdquo;
              </p>
              <p className="text-antique-gold text-sm mt-3 pl-8 font-semibold">
                — Erdoğan Usta, Kurucu
              </p>
            </div>

            {/* Değerler */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "🥩", label: "Taze Et Garantisi" },
                { value: "🏆", label: "Kalite Sertifikası" },
                { value: "🚚", label: "Aynı Gün Teslimat" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-xl bg-deep-espresso border border-antique-gold/5
                                              hover:border-antique-gold/20 transition-colors">
                  <div className="text-2xl mb-2">{item.value}</div>
                  <div className="text-[11px] text-ivory/50">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
