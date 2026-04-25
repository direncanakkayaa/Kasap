import { prisma } from "@/lib/prisma";
import {
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  TrendingUp,
  Users,
  Beef,
  FileText
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { status: "ONAYLANDI" as any } }),
    prisma.order.count({ where: { status: "HAZIRLANIYOR" as any } }),
    prisma.order.count({ where: { status: "TAMAMLANDI" as any } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.meatGuide.count(),
  ]);

  const [
    totalOrders, 
    pendingOrders, 
    preparingOrders, 
    deliveredOrders, 
    revenue, 
    totalUsers,
    totalProducts,
    totalGuides
  ] = stats;
  
  const totalRevenue = revenue._sum.totalAmount || 0;

  const quickStats = [
    { label: "Toplam Sipariş", value: totalOrders, icon: ShoppingBag, color: "text-white", border: "border-white/10" },
    { label: "Yeni Onaylı", value: pendingOrders, icon: Clock, color: "text-amber-400", border: "border-amber-500/20" },
    { label: "Hazırlanıyor", value: preparingOrders, icon: Package, color: "text-blue-400", border: "border-blue-500/20" },
    { label: "Tamamlanan", value: deliveredOrders, icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Ciro", value: `₺${totalRevenue.toLocaleString("tr-TR")}`, icon: TrendingUp, color: "text-antique-gold", border: "border-antique-gold/20" },
    { label: "Ürün Sayısı", value: totalProducts, icon: Beef, color: "text-ivory/60", border: "border-white/10" },
  ];

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-4xl font-serif text-[var(--antique-gold)]">Admin Dashboard</h1>
        <p className="text-ivory/50 mt-1">İşletmenizin genel durumu ve hızlı istatistikler.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-[#2A1B1A]/80 rounded-2xl p-5 border ${stat.border}`}>
              <p className="text-[10px] uppercase tracking-wider mb-2 font-bold flex items-center gap-1 opacity-70">
                <Icon size={12} /> {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Shortcut Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/orders" className="group bg-[#2A1B1A]/40 border border-white/5 p-8 rounded-3xl hover:border-antique-gold/40 transition-all">
          <ShoppingBag className="w-10 h-10 text-antique-gold mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-serif text-white mb-2">Siparişleri Yönet</h3>
          <p className="text-sm text-ivory/40">Gelen siparişlerin durumunu güncelleyin ve detayları görün.</p>
        </Link>
        
        <Link href="/admin/products" className="group bg-[#2A1B1A]/40 border border-white/5 p-8 rounded-3xl hover:border-antique-gold/40 transition-all">
          <Beef className="w-10 h-10 text-antique-gold mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-serif text-white mb-2">Ürün Kataloğu</h3>
          <p className="text-sm text-ivory/40">Yeni ürün ekleyin, fiyatları güncelleyin ve stok durumunu yönetin.</p>
        </Link>
        
        <Link href="/admin/guide" className="group bg-[#2A1B1A]/40 border border-white/5 p-8 rounded-3xl hover:border-antique-gold/40 transition-all">
          <FileText className="w-10 h-10 text-antique-gold mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-serif text-white mb-2">Et Rehberi</h3>
          <p className="text-sm text-ivory/40">Bilinçli tüketici için eğitici içerikleri ve şef notlarını düzenleyin.</p>
        </Link>
      </div>

      {/* Recent Activity / Users info */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#2A1B1A]/60 rounded-3xl border border-white/5 p-6">
          <h3 className="text-lg font-serif text-antique-gold mb-4 flex items-center gap-2">
            <Users size={20} /> Sistem Özeti
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5 text-sm">
              <span className="text-ivory/60">Kayıtlı Müşteri Sayısı</span>
              <span className="text-white font-bold">{totalUsers}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5 text-sm">
              <span className="text-ivory/60">Aktif Rehber İçerikleri</span>
              <span className="text-white font-bold">{totalGuides}</span>
            </div>
            <div className="flex justify-between items-center py-3 text-sm">
              <span className="text-ivory/60">Tamamlanan Teslimatlar</span>
              <span className="text-emerald-400 font-bold">{deliveredOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
