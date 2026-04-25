import { ArrowLeft, Filter, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getProducts, getAdditions } from "@/app/actions/products";
import ProductCatalogClient from "@/components/products/ProductCatalogClient";

export const metadata = {
  title: "Kasap Ürünlerimiz — Kasap Erdoğan",
  description: "Antalya Muratpaşa ve Lara şubelerimizden en taze et ürünlerimiz. Şef dokunuşuyla şimdi kapınızda.",
};

export default async function UrunlerPage() {
  const [products, additions] = await Promise.all([
    getProducts(),
    getAdditions()
  ]);

  return (
    <div className="min-h-screen bg-charcoal-black">
      {/* Header / Intro */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-antique-gold/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-ivory/40 hover:text-antique-gold transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-antique-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">Boutique Butcher Shop</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Kasap Ürünlerimiz.</h1>
              <p className="text-lg text-ivory/60 leading-relaxed">
                Tarladan sofraya izlenebilir, premium standartlarda işlenmiş et ürünlerimiz. 
                İster çiğ kasap paketinde, ister şefimizin ellerinden pişmiş olarak sipariş verin.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-antique-gold/10 border border-antique-gold/20 px-6 py-4 rounded-3xl backdrop-blur-md">
               <div className="w-12 h-12 rounded-2xl bg-antique-gold flex items-center justify-center text-deep-espresso">
                 <ShoppingBag size={24} />
               </div>
               <div>
                 <div className="text-[10px] text-ivory/40 uppercase tracking-widest font-bold">Hızlı Teslimat</div>
                 <div className="text-white font-display font-semibold">Antalya İçi Aynı Gün</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View (Client Side for Filters/Search) */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <ProductCatalogClient products={products} additions={additions} />
        </div>
      </section>
    </div>
  );
}
