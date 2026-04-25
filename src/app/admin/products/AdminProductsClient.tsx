"use client";

import { useState, useTransition } from "react";
import { 
  Beef, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Loader2,
  Image as ImageIcon,
  Tag,
  Box
} from "lucide-react";
import { updateProduct, deleteProduct, createProduct } from "@/app/actions/admin-product-actions";
import { uploadImage } from "@/app/actions/upload-actions";
import { useRouter } from "next/navigation";

export default function AdminProductsClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setPreviewUrl(product.imageUrl);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct({
      name: "",
      description: "",
      price: 0,
      category: "kirmizi-et",
      imageUrl: "",
      inStock: true,
      isCookable: false,
      cookingPrice: 0,
      unit: "KG"
    });
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      startTransition(async () => {
        await deleteProduct(id);
        router.refresh();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let finalImageUrl = formData.get("imageUrl") as string;

      if (selectedFile) {
        setUploading(true);
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", selectedFile);
          finalImageUrl = await uploadImage(uploadFormData);
        } catch (error) {
          console.error("Upload failed:", error);
          alert("Görsel yüklenirken bir hata oluştu.");
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category"),
        imageUrl: finalImageUrl,
        inStock: formData.get("inStock") === "true",
        isCookable: formData.get("isCookable") === "true",
        cookingPrice: parseFloat(formData.get("cookingPrice") as string || "0"),
        unit: formData.get("unit"),
      };
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      setIsModalOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-antique-gold">Ürün Yönetimi</h1>
          <p className="text-ivory/50">Mağazanızdaki ürünleri ekleyin, düzenleyin veya silin.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-antique-gold text-deep-espresso font-bold px-6 py-3 rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
        >
          <Plus size={18} /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-ivory/20" />
        </div>
        <input 
          type="text" 
          placeholder="Ürün ismi veya kategori ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#2A1B1A]/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-ivory/20 focus:outline-none focus:border-antique-gold transition-all"
        />
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-deep-espresso/60 border border-white/5 rounded-3xl overflow-hidden hover:border-antique-gold/30 transition-all group">
            <div className="h-48 bg-black/40 relative">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Beef className="w-12 h-12 text-ivory/10" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-antique-gold transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.inStock ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {product.inStock ? "Stokta" : "Tükendi"}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-antique-gold transition-colors">{product.name}</h3>
                <p className="text-xs text-ivory/40 uppercase tracking-widest">{product.category}</p>
              </div>
              
              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-ivory/30 uppercase">Birim Fiyat</span>
                  <span className="text-xl font-bold text-white">₺{product.price} <span className="text-xs font-normal text-ivory/40">/ {product.unit}</span></span>
                </div>
                {product.isCookable && (
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] text-orange-400 uppercase">Pişirme</span>
                      <span className="text-xs font-bold text-orange-200">+₺{product.cookingPrice}</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#1A1110] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-serif text-antique-gold">
                {editingProduct?.id ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-ivory/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Ürün İsmi</label>
                  <input 
                    name="name"
                    required
                    defaultValue={editingProduct?.name}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Açıklama</label>
                  <textarea 
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={3}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Fiyat (₺)</label>
                  <input 
                    name="price"
                    type="number"
                    required
                    step="0.01"
                    defaultValue={editingProduct?.price}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Birim</label>
                  <select 
                    name="unit"
                    defaultValue={editingProduct?.unit}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  >
                    <option value="KG">Kilogram (KG)</option>
                    <option value="ADET">Adet</option>
                    <option value="GR">Gram (GR)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Kategori</label>
                  <select 
                    name="category"
                    defaultValue={editingProduct?.category}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  >
                    <option value="kirmizi-et">Kırmızı Et</option>
                    <option value="sarkuteri">Şarküteri</option>
                    <option value="kofteler">Köfteler</option>
                    <option value="hazir-urunler">Hazır Ürünler</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Stok Durumu</label>
                  <select 
                    name="inStock"
                    defaultValue={editingProduct?.inStock ? "true" : "false"}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  >
                    <option value="true">Stokta Var</option>
                    <option value="false">Tükendi</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Ürün Görseli</label>
                    <span className="text-[10px] text-ivory/20 uppercase tracking-tighter">İsteğe bağlı</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Preview */}
                    <div className="relative group aspect-video bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button 
                               type="button"
                               onClick={() => {
                                 setPreviewUrl(null);
                                 setSelectedFile(null);
                               }}
                               className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/40 transition-all"
                             >
                               <Trash2 size={20} />
                             </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6">
                           <ImageIcon size={40} className="mx-auto text-ivory/10 mb-2" />
                           <p className="text-xs text-ivory/20">Görsel Seçilmedi</p>
                        </div>
                      )}
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                           <Loader2 className="animate-spin text-antique-gold" size={32} />
                           <span className="text-xs font-bold text-antique-gold uppercase tracking-widest">Yükleniyor...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div className="relative h-full">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="file-upload"
                          className="hidden"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center h-full border-2 border-dashed border-white/5 rounded-2xl cursor-pointer hover:border-antique-gold/30 hover:bg-white/5 transition-all group"
                        >
                          <Plus size={24} className="text-ivory/20 group-hover:text-antique-gold transition-colors mb-2" />
                          <span className="text-xs font-bold text-ivory/40 group-hover:text-ivory-light transition-colors">
                            Görsel Yükle
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Manual URL Input (as backup) */}
                  <div className="mt-4">
                    <label className="text-[10px] font-bold text-ivory/20 uppercase tracking-widest mb-2 block">Veya Görsel URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Box size={16} className="text-ivory/20" />
                      </div>
                      <input 
                        name="imageUrl"
                        defaultValue={editingProduct?.imageUrl}
                        placeholder="https://..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-antique-gold transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Pişirilebilir mi?</label>
                   <select 
                    name="isCookable"
                    defaultValue={editingProduct?.isCookable ? "true" : "false"}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  >
                    <option value="false">Hayır (Sadece Çiğ)</option>
                    <option value="true">Evet (Pişirme Seçeneği Var)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ivory/40 uppercase tracking-widest">Pişirme Farkı (₺)</label>
                  <input 
                    name="cookingPrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.cookingPrice}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-antique-gold transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={isPending || uploading}
                  className="flex-1 py-4 bg-antique-gold text-deep-espresso font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {(isPending || uploading) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {editingProduct?.id ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
