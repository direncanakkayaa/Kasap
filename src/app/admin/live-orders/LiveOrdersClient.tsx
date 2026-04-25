"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { 
  Bell, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  ChefHat, 
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Volume2,
  VolumeX,
  History,
  Info
} from "lucide-react";
import { updateOrderStatus, getLiveOrders } from "@/app/actions/order-actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function LiveOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [isPending, startTransition] = useTransition();
  const [muted, setMuted] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());
  const prevOrderCount = useRef(initialOrders.length);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Poll for new orders every 10 seconds
  useEffect(() => {
    const poll = async () => {
      const liveOrders = await getLiveOrders();
      
      if (liveOrders.length > prevOrderCount.current) {
        if (!muted && audioRef.current) {
          audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
      }
      
      setOrders(liveOrders);
      prevOrderCount.current = liveOrders.length;
      setLastCheckTime(Date.now());
    };

    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [muted]);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      const updated = await getLiveOrders();
      setOrders(updated);
    });
  };

  const getUrgencyColor = (createdAt: Date, status: string) => {
    if (status === "TAMAMLANDI" || status === "IPTAL") return "border-white/5";
    const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    
    if (minutes > 30) return "border-red-500 bg-red-500/5 animate-pulse-slow";
    if (minutes > 15) return "border-orange-500 bg-orange-500/5";
    return "border-emerald-500/20 bg-emerald-500/5";
  };

  const getTimeElapsed = (createdAt: Date) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    if (minutes < 1) return "Az önce";
    return `${minutes} dk önce`;
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#0C0606]">
      {/* Audio Element */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />

      {/* Brand & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-serif text-antique-gold">Sipariş Komuta Merkezi</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Canlı Akış
            </div>
          </div>
          <p className="text-ivory/40">Kasap Erdoğan için gerçek zamanlı operasyonel takip ekranı.</p>
        </div>

        <div className="flex items-center gap-4">
           <button 
            onClick={() => setMuted(!muted)}
            className={cn(
              "p-4 rounded-2xl border transition-all",
              muted ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-antique-gold/10 border-antique-gold/20 text-antique-gold"
            )}
           >
             {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
           </button>
           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <History className="text-ivory/20" size={20} />
              <div>
                 <p className="text-[10px] text-ivory/30 uppercase font-bold tracking-widest">Son Güncelleme</p>
                 <p className="text-white font-mono text-sm">{new Date(lastCheckTime).toLocaleTimeString()}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Line */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: "Bekleyen", value: orders.filter(o => o.status === 'ONAYLANDI').length, color: "text-red-400" },
           { label: "Hazırlanan", value: orders.filter(o => o.status === 'HAZIRLANIYOR').length, color: "text-orange-400" },
           { label: "Yolda", value: orders.filter(o => o.status === 'YOLDA').length, color: "text-blue-400" },
           { label: "Bugün Tamamlanan", value: 12, color: "text-emerald-400" }
         ].map((stat, idx) => (
           <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
              <p className="text-[10px] text-ivory/30 uppercase tracking-[0.2em] font-bold mb-2">{stat.label}</p>
              <p className={cn("text-3xl font-display font-bold", stat.color)}>{stat.value}</p>
           </div>
         ))}
      </div>

      {/* Live Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         {orders.map((order) => (
           <div 
            key={order.id} 
            className={cn(
              "rounded-[2.5rem] border-2 p-8 transition-all duration-500 flex flex-col gap-6",
              getUrgencyColor(order.createdAt, order.status)
            )}
           >
              {/* Header */}
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-ivory/20">
                       <ShoppingBag size={28} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white mb-1">{order.customerName}</h3>
                       <div className="flex items-center gap-3 text-xs text-ivory/40">
                          <span className="bg-white/5 px-2 py-0.5 rounded uppercase font-mono tracking-tighter">ID: {order.id.slice(-6)}</span>
                          <span className="flex items-center gap-1"><Clock size={12}/> {getTimeElapsed(order.createdAt)}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-bold text-antique-gold mb-1">₺{order.totalAmount.toFixed(0)}</p>
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                      order.status === 'ONAYLANDI' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      order.status === 'HAZIRLANIYOR' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {order.status}
                    </p>
                 </div>
              </div>

              {/* Items */}
              <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                 <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-antique-gold/10 text-antique-gold flex items-center justify-center font-bold text-xs">{item.quantity}x</span>
                            <div>
                               <p className="text-white font-medium">{item.product.name}</p>
                               {item.butcherNotes && <p className="text-[10px] text-ivory/30 italic">{item.butcherNotes}</p>}
                            </div>
                         </div>
                         <span className="text-ivory/40">₺{(item.product.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 <button 
                  onClick={() => handleStatusUpdate(order.id, 'HAZIRLANIYOR')}
                  disabled={order.status === 'HAZIRLANIYOR' || isPending}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                    order.status === 'HAZIRLANIYOR' ? "bg-orange-500 text-white border-orange-500" : "bg-white/5 border-white/5 text-ivory/40 hover:border-white/20"
                  )}
                 >
                    <ChefHat size={20} />
                    <span className="text-[10px] font-bold uppercase">Hazırla</span>
                 </button>

                 <button 
                  onClick={() => handleStatusUpdate(order.id, 'YOLDA')}
                  disabled={order.status === 'YOLDA' || isPending}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                    order.status === 'YOLDA' ? "bg-blue-500 text-white border-blue-500" : "bg-white/5 border-white/5 text-ivory/40 hover:border-white/20"
                  )}
                 >
                    <Truck size={20} />
                    <span className="text-[10px] font-bold uppercase">Yola Çık</span>
                 </button>

                 <button 
                  onClick={() => handleStatusUpdate(order.id, 'TAMAMLANDI')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                 >
                    <CheckCircle2 size={20} />
                    <span className="text-[10px] font-bold uppercase">Teslim Et</span>
                 </button>

                 <a 
                  href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Merhaba ${order.customerName}, Kasap Erdoğan'dan verdiğiniz sipariş işleme alındı ve hazırlanıyor.`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all"
                 >
                    <MessageSquare size={20} />
                    <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                 </a>
              </div>
           </div>
         ))}

         {orders.length === 0 && (
           <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <Bell className="text-ivory/5 w-20 h-20 mb-6" />
              <p className="text-ivory/20 font-serif text-2xl">Henüz aktif sipariş bulunmuyor.</p>
           </div>
         )}
      </div>
    </div>
  );
}
