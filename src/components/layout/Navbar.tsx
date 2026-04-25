"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown, Phone, MessageSquare, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

const VISIBLE_LINKS = [
  { label: "Hayvanlarımız", href: "/hayvanlarimiz" },
  { label: "Ürünler", href: "/#urunler" },
  { label: "Et Rehberi", href: "/rehber" },
];

const SECONDARY_LINKS = [
  { label: "Kurban Hisse", href: "/kurban" },
  { label: "Canlı Kesim", href: "/canli-kesim" },
  { label: "Hakkımızda", href: "/#hakkimizda" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const itemCount = useCart((s) => s.getItemCount());
  const [copied, setCopied] = useState(false);

  // Hydration-safe cart count
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth >= 1024) {
      e.preventDefault();
      navigator.clipboard.writeText("+905551234567");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "nav-pill-active" : "nav-pill w-full bg-deep-espresso/40 backdrop-blur-md border-b border-white/5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          isScrolled ? "h-14" : "h-20"
        )}>
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-full burgundy-gradient flex items-center justify-center
                          group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all">
              <span className="text-antique-gold font-display text-base font-bold">KE</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-ivory tracking-tight leading-none">
                Kasap Erdoğan
              </span>
              {!isScrolled && (
                <span className="text-[8px] text-antique-gold/70 tracking-widest uppercase mt-0.5 animate-fade-in">
                  2010'dan Beri Antalya
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {VISIBLE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-xs font-semibold text-ivory/80 rounded-full
                         hover:text-antique-gold hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Secondary Menu Dropdown */}
            <div className="relative group/menu">
              <button className="px-4 py-2 text-xs font-semibold text-ivory/50 rounded-full
                               hover:text-ivory flex items-center gap-1 transition-all">
                Diğer <ChevronDown size={14} className="group-hover/menu:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible 
                            group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300">
                <div className="bg-taupe-surface/95 backdrop-blur-xl border border-antique-gold/10 p-2 rounded-2xl shadow-2xl min-w-[160px]">
                  {SECONDARY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-xs text-ivory/70 hover:text-antique-gold hover:bg-white/5 rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-white/10 mr-2">
              <a
                href="https://wa.me/905551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-[#25D366] transition-colors rounded-full hover:bg-white/5"
                title="WhatsApp Destek"
              >
                <MessageSquare size={20} />
              </a>
              <Link
                href="/sepet"
                className="relative w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-antique-gold transition-colors rounded-full hover:bg-white/5"
              >
                <ShoppingCart size={20} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-lg animate-bounce-once">
                    {itemCount}
                  </span>
                )}
              </Link>
              {status === "authenticated" ? (
                <div className="flex items-center gap-1">
                  <Link
                    href={(session.user as any).role === "ADMIN" ? "/admin/live-orders" : "/dashboard"}
                    className="w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-antique-gold transition-colors rounded-full hover:bg-white/5"
                    title={(session.user as any).role === "ADMIN" ? "Yönetici Paneli" : "Profilim"}
                  >
                    <User size={20} />
                  </Link>
                  {(session.user as any).role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-500/10"
                      title="Yönetici Paneli"
                    >
                      <ShieldCheck size={20} />
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-10 h-10 flex items-center justify-center text-ivory/40 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                    title="Çıkış Yap"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-antique-gold transition-colors rounded-full hover:bg-white/5"
                  title="Giriş Yap"
                >
                  <User size={20} />
                </Link>
              )}
            </div>

            {/* Primary CTA */}
            <a
              href="tel:+905551234567"
              onClick={handlePhoneClick}
              className={cn(
                "flex items-center gap-2 font-bold transition-all duration-300 rounded-full",
                isScrolled
                  ? "bg-antique-gold text-deep-espresso px-4 py-2 text-xs"
                  : "bg-antique-gold text-deep-espresso px-6 py-2.5 text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              )}
            >
              {copied ? <Check size={isScrolled ? 14 : 16} /> : <Phone size={isScrolled ? 14 : 16} />}
              <span className={cn(isScrolled ? "block" : "hidden sm:block")}>
                {copied ? "Kopyalandı" : "Bizi Arayın"}
              </span>
            </a>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-ivory hover:text-antique-gold transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-taupe-surface/95 backdrop-blur-2xl border-t border-white/5",
          isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-8 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {[...VISIBLE_LINKS, ...SECONDARY_LINKS].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-ivory/80 rounded-2xl hover:bg-white/5 hover:text-antique-gold transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <a
              href="https://wa.me/905551234567"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366]/10 text-[#25D366] font-bold rounded-2xl border border-[#25D366]/20 transition-all hover:bg-[#25D366]/20"
            >
              <MessageSquare size={20} /> WhatsApp'tan Yazın
            </a>
            <Link
              href="/sepet"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 text-ivory font-bold rounded-2xl border border-white/10 relative"
            >
              <ShoppingCart size={20} /> Sepetim
              {mounted && itemCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </Link>
            {status === "authenticated" ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={(session.user as any).role === "ADMIN" ? "/admin/live-orders" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-antique-gold/10 text-antique-gold font-bold rounded-2xl border border-antique-gold/20"
                >
                  <User size={20} /> {(session.user as any).role === "ADMIN" ? "Yönetici Paneli" : "Hesabım"}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-red-500/5 text-red-400 font-bold rounded-2xl border border-red-500/10"
                >
                  <LogOut size={20} /> Çıkış Yap
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-antique-gold/10 text-antique-gold font-bold rounded-2xl border border-antique-gold/20"
              >
                <User size={20} /> Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
