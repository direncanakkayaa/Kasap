import { prisma } from "@/lib/prisma";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Beef,
} from "lucide-react";
import AdminOrderActions from "./AdminOrderActions";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  // Fetch all orders with items and user info
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      user: true,
      address: true,
    },
  });

  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
    ODEME_BEKLENIYOR: { label: "Ödeme Bekleniyor", color: "text-ivory/40", bg: "bg-white/5", border: "border-white/10", icon: Clock },
    ONAYLANDI: { label: "Onaylandı", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: Clock },
    HAZIRLANIYOR: { label: "Hazırlanıyor", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: Package },
    YOLDA: { label: "Kuryede", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Truck },
    TAMAMLANDI: { label: "Tamamlandı", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2 },
    IPTAL: { label: "İptal Edildi", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle },
    BEKLEMEDE: { label: "Beklemede", color: "text-ivory/20", bg: "bg-white/5", border: "border-white/10", icon: Clock },
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[var(--antique-gold)]">Sipariş Yönetimi</h1>
          <p className="text-ivory/50">Tüm müşteri siparişlerini buradan takip edebilirsiniz.</p>
        </div>
      </div>

      <div className="bg-[#2A1B1A]/60 backdrop-blur-md rounded-3xl border border-[var(--taupe-surface)] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[var(--taupe-surface)]">
          <h2 className="text-xl font-serif text-[var(--antique-gold)]">
            Aktif Siparişler ({orders.length})
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Beef className="w-16 h-16 text-[var(--taupe-surface)] mx-auto mb-4" />
            <p className="text-ivory/50 text-lg">Henüz sipariş bulunmuyor.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--taupe-surface)]">
            {orders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.BEKLEMEDE;
              const StatusIcon = sc.icon;
              return (
                <div
                  key={order.id}
                  className="p-6 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs text-[var(--antique-gold)] font-bold uppercase tracking-widest">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${sc.bg} ${sc.color} border ${sc.border}`}>
                          <StatusIcon size={12} />
                          {sc.label}
                        </span>
                        <span className="text-xs text-ivory/40">
                          {new Date(order.createdAt).toLocaleString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-ivory/80">
                          <span className="text-ivory/40">Müşteri:</span>{" "}
                          <strong className="text-white">{order.customerName}</strong>
                        </span>
                        <span className="text-ivory/60">{order.customerPhone}</span>
                      </div>

                      {order.items.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {order.items.map((item) => (
                            <span
                              key={item.id}
                              className="text-[11px] bg-white/5 text-ivory/70 px-3 py-1 rounded-lg border border-white/5"
                            >
                              {item.product.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-2xl font-display font-bold text-[var(--antique-gold)]">
                        ₺{order.totalAmount.toLocaleString("tr-TR")}
                      </span>
                      <AdminOrderActions
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
