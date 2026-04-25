"use client";

import { useState, useTransition } from "react";
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar,
  Check,
  Loader2,
  ChevronDown
} from "lucide-react";
import { updateUserRole } from "@/app/actions/admin-product-actions";
import { useRouter } from "next/navigation";

export default function AdminUsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (u.phone || "").includes(searchTerm)
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`Kullanıcı rolünü "${newRole}" olarak değiştirmek istediğinize emin misiniz?`)) {
      startTransition(async () => {
        await updateUserRole(userId, newRole);
        router.refresh();
      });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-antique-gold">Kullanıcı Yönetimi</h1>
        <p className="text-ivory/50">Müşteri listesi ve yetkilendirme ayarları.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-ivory/20" />
        </div>
        <input 
          type="text" 
          placeholder="İsim veya telefon ile ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#2A1B1A]/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-ivory/20 focus:outline-none focus:border-antique-gold transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#2A1B1A]/60 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="px-6 py-5 text-xs font-bold text-ivory/40 uppercase tracking-widest">Kullanıcı</th>
                <th className="px-6 py-5 text-xs font-bold text-ivory/40 uppercase tracking-widest">İletişim</th>
                <th className="px-6 py-5 text-xs font-bold text-ivory/40 uppercase tracking-widest">Rol</th>
                <th className="px-6 py-5 text-xs font-bold text-ivory/40 uppercase tracking-widest">Kayıt Tarihi</th>
                <th className="px-6 py-5 text-xs font-bold text-ivory/40 uppercase tracking-widest">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center text-antique-gold">
                        {user.name ? user.name[0].toUpperCase() : <UserIcon size={18} />}
                      </div>
                      <div>
                        <p className="text-white font-bold">{user.name || "İsimsiz Kullanıcı"}</p>
                        <p className="text-[10px] text-ivory/30 font-mono tracking-tighter uppercase">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-ivory/80">
                        <Phone size={14} className="text-antique-gold/40" /> {user.phone}
                      </div>
                      {user.email && (
                        <div className="flex items-center gap-2 text-xs text-ivory/40">
                          <Mail size={14} className="text-antique-gold/20" /> {user.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${
                      user.role === 'ADMIN' 
                        ? "bg-red-500/10 text-red-400 border-red-500/20" 
                        : user.role === 'BUTCHER'
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      <Shield size={10} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-ivory/40">
                       <Calendar size={14} />
                       {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="relative inline-block group/dropdown">
                      <select 
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={isPending}
                        className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-antique-gold appearance-none cursor-pointer pr-10"
                      >
                        <option value="CUSTOMER">Müşteri Yap</option>
                        <option value="BUTCHER">Kasap Yap</option>
                        <option value="ADMIN">Admin Yap</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/20 pointer-events-none" size={12} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
