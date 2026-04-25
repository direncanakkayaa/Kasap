"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, ChefHat, ShoppingCart, Check, Info, Minus, Plus, CheckCircle, Scale } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

interface SideProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isCookable: boolean;
  cookingPrice: number;
  unit: string;
}

interface QuickViewProps {
  product: Product;
  additions: SideProduct[];
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, additions, isOpen, onClose }: QuickViewProps) {
  const [isCooked, setIsCooked] = useState(false);
  const [weight, setWeight] = useState(product.unit === "KG" ? 0.5 : 1); // 500gr default for KG or 1 unit
  const [quantity, setQuantity] = useState(1);
  const [selectedAdditions, setSelectedAdditions] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const addItem = useCart((s) => s.addItem);
  
  // Weights (in KG)
  const SUGGESTED_WEIGHTS = [0.25, 0.5, 0.75, 1, 1.5, 2];

  const unitPrice = (product.price * weight) + (isCooked ? product.cookingPrice : 0);
  const additionsTotal = additions.filter(a => selectedAdditions.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (unitPrice + additionsTotal) * quantity;

  const toggleAddition = (id: string) => {
    setSelectedAdditions(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
      unit: product.unit,
      quantity: quantity,
      weight: weight,
      serviceType: isCooked ? "COOKED" : "RAW",
      cookingPrice: product.cookingPrice || 0,
      butcherNote: "",
      selectedAdditions: additions
        .filter((a) => selectedAdditions.includes(a.id))
        .map((a) => ({ id: a.id, name: a.name, price: a.price })),
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      // Reset state for next open
      setIsCooked(false);
      setWeight(product.unit === "KG" ? 0.5 : 1);
      setQuantity(1);
      setSelectedAdditions([]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-deep-espresso border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left: Product Image & Info */}
          <div className="w-full md:w-5/12 relative aspect-square md:aspect-auto bg-charcoal-black">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="text-antique-gold font-semibold text-xs tracking-widest uppercase mb-2 block">Premium Seçim</span>
              <h2 className="text-3xl font-display font-bold text-white mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 text-ivory/60 text-sm">
                 <Info size={14} />
                 <span>Taze ve günlük kesim</span>
              </div>
            </div>
          </div>

          {/* Right: Options & Checkout */}
          <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] bg-[url('/noise.png')]">
            
            {/* Service Toggle */}
            {product.isCookable && (
              <div className="mb-8">
                <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest mb-4 block">Hazırlanış Biçimi</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsCooked(false)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${!isCooked ? 'bg-antique-gold/10 border-antique-gold text-antique-gold' : 'bg-white/5 border-white/10 text-ivory/40 hover:border-white/20'}`}
                  >
                    <div className={`p-2 rounded-lg ${!isCooked ? 'bg-antique-gold text-deep-espresso' : 'bg-white/5'}`}>
                      <ShoppingCart size={18} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">Çiğ (Kasap)</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setIsCooked(true)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${isCooked ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold' : 'bg-white/5 border-white/10 text-ivory/40 hover:border-white/20'}`}
                  >
                    <div className={`p-2 rounded-lg ${isCooked ? 'bg-orange-500 text-white' : 'bg-white/5'}`}>
                      <Flame size={18} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">Pişmiş (Şef)</div>
                      <div className="text-[10px] opacity-60">+₺{product.cookingPrice}</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Weight Selection (if KG) */}
            {product.unit === "KG" && (
              <div className="mb-8">
                <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest mb-4 block flex items-center gap-2">
                  <Scale size={12} /> Gramaj Seçimi ({weight * 1000} gr)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {SUGGESTED_WEIGHTS.map(w => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={cn(
                        "py-3 rounded-xl border text-sm font-bold transition-all",
                        weight === w ? "bg-white/20 border-white text-white" : "bg-white/5 border-white/5 text-ivory/40 hover:bg-white/10"
                      )}
                    >
                      {w < 1 ? `${w * 1000} gr` : `${w} kg`}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                   <div className="flex-1">
                      <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">Özel Gramaj</p>
                      <div className="flex items-center gap-2">
                         <input 
                           type="number" 
                           step="0.05"
                           value={weight}
                           onChange={(e) => setWeight(parseFloat(e.target.value))}
                           className="bg-transparent text-xl font-bold text-white focus:outline-none w-20"
                         />
                         <span className="text-antique-gold font-bold">KG</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-ivory/40 uppercase tracking-widest mb-1">KG Fiyatı</p>
                      <p className="text-ivory font-bold">₺{product.price}</p>
                   </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest mb-4 block">Paket/Adet Sayısı</label>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 p-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/5 rounded-xl transition-colors text-ivory"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-display text-2xl font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/5 rounded-xl transition-colors text-ivory"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Side Products (Additions) */}
            <div className="mb-10">
              <label className="text-[10px] font-bold text-ivory/40 uppercase tracking-widest mb-4 block">Yan Ürünler & Soslar</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleAddition(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left ${selectedAdditions.includes(item.id) ? 'bg-white/10 border-antique-gold' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-charcoal-black flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-ivory truncate">{item.name}</div>
                      <div className="text-[10px] text-antique-gold font-display">+₺{item.price}</div>
                    </div>
                    {selectedAdditions.includes(item.id) && (
                      <CheckCircle className="text-antique-gold w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer / Add to Cart */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-ivory/40 uppercase tracking-widest mb-1">Tahmini Tutar</div>
                <div className="text-4xl font-display font-bold text-white">₺{totalPrice.toFixed(0)}</div>
              </div>

              {showSuccess ? (
                <div className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-5 rounded-2xl font-bold shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle size={20} />
                  Sepete Eklendi!
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-antique-gold text-deep-espresso px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  <ShoppingCart size={20} />
                  Sepete Ekle
                </button>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
