"use client";

import { useState, useTransition } from "react";
import { 
  FileText, 
  Search, 
  Edit2, 
  ExternalLink,
  ChevronRight,
  Beef,
  Award,
  BookOpen,
  Check,
  X,
  Loader2
} from "lucide-react";
import { updateGuide } from "@/app/actions/admin-product-actions";
import { uploadImage } from "@/app/actions/upload-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminGuideClient({ guides }: { guides: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGuide, setEditingGuide] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (guide: any) => {
    setEditingGuide(guide);
    setImagePreview(guide.imageUrl);
    setCoverPreview(guide.coverUrl);
    setImageFile(null);
    setCoverFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      setUploading(true);
      let finalImageUrl = editingGuide.imageUrl;
      let finalCoverUrl = editingGuide.coverUrl;

      try {
        if (imageFile) {
          const imgData = new FormData();
          imgData.append("file", imageFile);
          finalImageUrl = await uploadImage(imgData);
        }
        if (coverFile) {
          const cvrData = new FormData();
          cvrData.append("file", coverFile);
          finalCoverUrl = await uploadImage(cvrData);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Görsel yüklenirken bir hata oluştu.");
        setUploading(false);
        return;
      }

      const data = {
        title: formData.get("title"),
        shortDesc: formData.get("shortDesc"),
        content: formData.get("content"),
        usageTips: formData.get("usageTips"),
        chefTip: formData.get("chefTip"),
        imageUrl: finalImageUrl,
        coverUrl: finalCoverUrl,
      };

      await updateGuide(editingGuide.id, data);
      setEditingGuide(null);
      setUploading(false);
      router.refresh();
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-antique-gold">Et Rehberi Yönetimi</h1>
        <p className="text-ivory/50">Eğitici içerikleri, pişirme önerilerini ve şef notlarını güncelleyin.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* List Side */}
        <div className={`space-y-6 ${editingGuide ? "lg:w-1/3" : "w-full"}`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-ivory/20" />
            </div>
            <input 
              type="text" 
              placeholder="Başlık ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2A1B1A]/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-ivory/20 focus:outline-none focus:border-antique-gold transition-all text-sm"
            />
          </div>

          <div className="grid gap-3">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id}
                onClick={() => handleEdit(guide)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group ${
                  editingGuide?.id === guide.id 
                    ? "bg-antique-gold/10 border-antique-gold border-r-4" 
                    : "bg-[#2A1B1A]/40 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${guide.animalType === 'BUYUKBAS' ? 'text-blue-400 bg-blue-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
                    <Beef size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold group-hover:text-antique-gold transition-colors">{guide.title}</h3>
                    <p className="text-[10px] text-ivory/30 uppercase tracking-widest">{guide.animalType}</p>
                  </div>
                </div>
                <ChevronRight className={`text-ivory/20 group-hover:text-white transition-all ${editingGuide?.id === guide.id ? "rotate-90 text-antique-gold" : ""}`} size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Editor Side */}
        {editingGuide ? (
          <div className="flex-1 bg-[#2A1B1A]/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 lg:p-12 shadow-2xl space-y-8 animate-slide-in">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center text-antique-gold">
                   <BookOpen size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-white">{editingGuide.title}</h2>
                  <p className="text-sm text-ivory/40">Sayfa ID: {editingGuide.slug}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link 
                  href={`/rehber/${editingGuide.slug}`} 
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/5 transition-all"
                >
                  <ExternalLink size={14} /> Sitede Gör
                </Link>
                <button 
                  onClick={() => setEditingGuide(null)}
                  className="p-2 text-ivory/40 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-antique-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText size={12} /> İçerik Başlığı
                  </label>
                  <input 
                    name="title"
                    defaultValue={editingGuide.title}
                    className="w-full bg-black/40 border-b-2 border-white/5 py-4 text-xl font-bold text-white focus:outline-none focus:border-antique-gold transition-all bg-transparent"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-antique-gold uppercase tracking-[0.2em]">Kısa Açıklama (Listeleme Kartı İçin)</label>
                  <textarea 
                    name="shortDesc"
                    defaultValue={editingGuide.shortDesc}
                    rows={2}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-ivory/80 focus:outline-none focus:border-antique-gold transition-all resize-none"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-antique-gold uppercase tracking-[0.2em]">Detaylı İçerik (Markdown Destekli)</label>
                  <textarea 
                    name="content"
                    defaultValue={editingGuide.content}
                    rows={6}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-ivory/80 focus:outline-none focus:border-antique-gold transition-all resize-none font-mono text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Check size={12} /> Kullanım Alanları
                  </label>
                  <input 
                    name="usageTips"
                    defaultValue={editingGuide.usageTips}
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-orange-400/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Award size={12} /> Şefin Notu (Gizli Lezzet Sırrı)
                  </label>
                  <input 
                    name="chefTip"
                    defaultValue={editingGuide.chefTip}
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-400/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-antique-gold uppercase tracking-[0.2em]">Kapak Görseli</label>
                  <div className="relative group aspect-video bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                    {coverPreview ? (
                      <img src={coverPreview} className="w-full h-full object-cover" />
                    ) : (
                      <Beef size={32} className="text-ivory/10" />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <ExternalLink size={24} className="text-white mb-2" />
                      <span className="text-xs font-bold text-white uppercase">Değiştir</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCoverFile(file);
                            setCoverPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-antique-gold uppercase tracking-[0.2em]">İçerik Görseli</label>
                  <div className="relative group aspect-square bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                      <Beef size={32} className="text-ivory/10" />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <ExternalLink size={24} className="text-white mb-2" />
                      <span className="text-xs font-bold text-white uppercase">Değiştir</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                 <button 
                  type="button"
                  onClick={() => setEditingGuide(null)}
                  className="px-8 py-4 bg-white/5 text-ivory/60 font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Değişiklikleri İptal Et
                </button>
                <button 
                  type="submit"
                  disabled={isPending || uploading}
                  className="px-12 py-4 bg-antique-gold text-deep-espresso font-bold rounded-2xl hover:bg-gold-light transition-all flex items-center gap-3 shadow-xl shadow-gold/20 disabled:opacity-50"
                >
                  {(isPending || uploading) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  İçeriği Güncelle
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/5 rounded-[2.5rem]">
             <FileText className="w-16 h-16 text-ivory/10 mb-4" />
             <p className="text-ivory/40">Düzenlemek istediğiniz bir rehber içeriği seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
