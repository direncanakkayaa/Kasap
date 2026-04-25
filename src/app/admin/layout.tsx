import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingBag, 
  Beef, 
  Users, 
  Settings,
  ArrowLeft,
  FileText
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Canlı Siparişler", href: "/admin/live-orders", icon: ShieldCheck },
    { label: "Siparişler", href: "/admin/orders", icon: ShoppingBag },
    { label: "Ürünler", href: "/admin/products", icon: Beef },
    { label: "Et Rehberi", href: "/admin/guide", icon: FileText },
    { label: "Kullanıcılar", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-deep-espresso/40 backdrop-blur-xl border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full burgundy-gradient flex items-center justify-center">
              <span className="text-antique-gold font-display text-sm font-bold">KE</span>
            </div>
            <span className="font-display text-lg font-bold text-ivory tracking-tight">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-ivory/60 hover:text-antique-gold hover:bg-white/5 rounded-xl transition-all"
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-ivory/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Müşteri Paneline Dön
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 lg:pt-0">
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
           <span className="text-antique-gold font-serif font-bold">Admin Panel</span>
           <ShieldCheck className="text-antique-gold" />
        </div>
        {children}
      </main>
    </div>
  );
}
