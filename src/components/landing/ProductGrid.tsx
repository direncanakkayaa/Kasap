import { getProducts, getAdditions } from "@/app/actions/products";
import ProductGridClient from "./ProductGridClient";
import { section } from "framer-motion/client";

export default async function ProductGrid() {
  const [products, additions] = await Promise.all([
    getProducts(),
    getAdditions()
  ]);

  return (
    <section id="urunler" className="section-padding relative">
      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-antique-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-antique-gold text-xs font-semibold tracking-[0.2em] uppercase">
            Vitrinimiz
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ivory mt-3 mb-4">
            Ürünlerimiz
          </h2>
          <p className="text-ivory/50 max-w-lg mx-auto">
            Her gün taze kesilmiş, özenle hazırlanmış et çeşitlerimizi keşfedin.
            Artık pişmiş seçeneği ve yan ürünlerle beraber kapınızda.
          </p>
        </div>

        {/* Client Side Logic for Filtering and Modals */}
        <ProductGridClient products={products} additions={additions} />
      </div>
    </section>
  );
}
