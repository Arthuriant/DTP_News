"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';
// 1. Import Alert Service
import { AlertService } from '@/services/AlertService';

export default function ProductSizesTab() {
  const params = useParams();
  const productId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [sizes, setSizes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Asset Nusantara
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  // State Form
  const [form, setForm] = useState({
    id: '', title: '', short_desc: '', description: '', 
    price: '', width: '', height: '', depth: '', unit: 'cm', img: null as File | null
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  const fetchSizes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getProductSizes(productId);
      setSizes(data || []);
    } catch (error) {
      console.error("Gagal mengambil data ukuran:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchSizes();
  }, [fetchSizes, productId]);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('storage/') ? `${path}` : `${path}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('title', form.title);
    if (form.short_desc) formData.append('short_desc', form.short_desc);
    if (form.description) formData.append('description', form.description);
    if (form.price !== '') formData.append('price', form.price.toString());
    if (form.width !== '') formData.append('width', form.width.toString());
    if (form.height !== '') formData.append('height', form.height.toString());
    if (form.depth !== '') formData.append('depth', form.depth.toString());
    formData.append('unit', form.unit || 'cm');
    if (form.img) formData.append('img', form.img);

    try {
      if (form.id) {
        await ProductService.updateProductSize(form.id, formData);
      } else {
        await ProductService.createProductSize(formData);
      }
      setIsModalOpen(false);
      fetchSizes();

      // 2. Tambahkan Notifikasi Sukses
      AlertService.success("Berhasil", "Varian ukuran proporsi berhasil disimpan.");
    } catch (error: any) {
      // 3. Ganti alert bawaan dengan AlertService Error
      AlertService.error("Gagal Menyimpan", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (size: any) => {
    setForm({
      id: size.id,
      title: size.title || '',
      short_desc: size.short_desc || '',
      description: size.description || '',
      price: size.price !== null ? size.price.toString() : '',
      width: size.width !== null ? size.width.toString() : '',
      height: size.height !== null ? size.height.toString() : '',
      depth: size.depth !== null ? size.depth.toString() : '',
      unit: size.unit || 'cm',
      img: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // 4. Ganti confirm bawaan dengan AlertService Confirm
    const isConfirmed = await AlertService.confirm(
      "Hapus Varian Ukuran?",
      "Spesifikasi proporsi ini beserta gambarnya akan dihapus secara permanen dari mahakarya.",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await ProductService.deleteProductSize(id);
        setSizes(sizes.filter(s => s.id !== id));

        // 5. Tambahkan Notifikasi Sukses Hapus
        AlertService.success("Terhapus!", "Varian ukuran berhasil dihapus.");
      } catch (error: any) {
        // 6. Ganti alert bawaan dengan AlertService Error
        AlertService.error("Gagal Menghapus", error.message);
      }
    }
  };

  const openNewModal = () => {
    setForm({ id: '', title: '', short_desc: '', description: '', price: '', width: '', height: '', depth: '', unit: 'cm', img: null });
    setIsModalOpen(true);
  };

  // ================= STYLING FORM (Mengikuti AddressModal) =================
  const inputClass = "w-full bg-white text-[#2D1A11] px-4 py-2.5 rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] border-none outline-none focus:ring-2 focus:ring-[#D9B35A]/50 transition-all font-semibold placeholder-[#8B7355]/40 text-sm appearance-none";
  const labelClass = "block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1";

  // ================= MODAL PORTAL CONTENT (Gaya AddressModal) =================
  const modalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn transition-all duration-300 font-sans"
      onClick={(e) => e.target === e.currentTarget && !isSaving && setIsModalOpen(false)}
    >
      <div className="relative bg-[#F8F3E9] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex-none relative z-10 bg-[#2D1A11] px-6 py-4 shadow-md flex justify-between items-center">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-lg font-serif font-bold tracking-wide flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              {form.id === '' ? "Tambah Varian Proporsi" : "Ubah Varian Proporsi"}
            </h2>
          </div>
          <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all cursor-pointer disabled:opacity-50">✕</button>
        </div>

        {/* BODY MODAL - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 scrollbar-thin scrollbar-thumb-[#D9B35A]/50 scrollbar-track-transparent">
          <form id="sizeForm" onSubmit={handleSave} className="space-y-4">
            
            {/* Baris 1: Judul */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className={labelClass}>Nama Proporsi (Cth: L)</label>
                <input required maxLength={25} value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} placeholder="Nama ukuran..." />
              </div>
              <div className="w-full">
                <label className={labelClass}>Sub Judul (Target Market)</label>
                <input maxLength={100} value={form.short_desc} onChange={e => setForm({...form, short_desc: e.target.value})} className={inputClass} placeholder="Cth: Cocok untuk Laptop 15 inchi" />
              </div>
            </div>

            {/* Baris 2: Dimensi & Unit */}
            <div>
              <label className={labelClass}>Spesifikasi Dimensi</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EFE8DC] p-4 rounded-xl shadow-inner border-none">
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Lebar (W)</label>
                  <input type="number" step="any" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Tinggi (H)</label>
                  <input type="number" step="any" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Dalam (D)</label>
                  <input type="number" step="any" value={form.depth} onChange={e => setForm({...form, depth: e.target.value})} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Satuan</label>
                  <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className={inputClass}>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                    <option value="inch">inch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Baris 3: Harga Tambahan & Gambar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className={labelClass}>Harga Tambahan (Markup IDR)</label>
                <input type="number" placeholder="Kosongkan jika harga tetap" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} />
              </div>
              <div className="w-full sm:w-1/2">
                <label className={labelClass}>Gambar Visual (Opsional)</label>
                <div className="bg-white rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] px-2 py-1.5 flex items-center">
                  <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => setForm({...form, img: e.target.files ? e.target.files[0] : null})} className="w-full text-xs text-[#8B7355] file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#2D1A11] file:text-[#D9B35A] file:font-bold file:uppercase file:cursor-pointer cursor-pointer outline-none" />
                </div>
              </div>
            </div>

            {/* Baris 4: Deskripsi */}
            <div>
              <label className={labelClass}>Catatan Detail (Opsional)</label>
              <textarea rows={3} placeholder="Tuliskan catatan tambahan..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass + " resize-none"}></textarea>
            </div>
          </form>
        </div>

        {/* FOOTER MODAL */}
        <div className="flex-none p-4 sm:px-8 py-4 border-t border-[#8B7355]/10 flex justify-end items-center gap-4 bg-[#EFE8DC] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="text-[#8B7355] font-black text-[10px] uppercase tracking-widest hover:text-[#2D1A11] px-5 py-2.5 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button type="submit" form="sizeForm" disabled={isSaving} className="bg-gradient-to-r from-[#2D1A11] to-[#3d2417] text-[#D9B35A] px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50">
            {isSaving ? "Menyimpan..." : "Simpan Ukuran"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans animate-fadeIn relative z-10">
      
      {/* ================= HEADER HALAMAN ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#D9B35A]/30 pb-8 gap-4">
        <div>
          <h3 className="text-3xl font-serif font-medium text-[#2D1A11] tracking-wide flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#D9B35A]"></span>
            Panduan Proporsi (Size)
          </h3>
          <p className="text-[#8B7355] text-sm mt-3 font-light tracking-wide pl-12">
            Kelola variasi arsitektur ukuran, spesifikasi dimensi mendetail, dan valuasi harga khusus.
          </p>
        </div>
        
        {/* Tombol Tambah Premium */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D9B35A] to-[#8B7355] opacity-0 group-hover:opacity-30 blur transition-opacity duration-700"></div>
          <button 
            onClick={openNewModal} 
            className="relative flex items-center gap-3 px-8 py-4 bg-[#2D1A11] border border-[#D9B35A]/80 text-[#D9B35A] text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[0_0_20px_rgba(217,179,90,0.4)] transition-all duration-700 ease-out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path>
            </svg>
            TAMBAH VARIAN
          </button>
        </div>
      </div>

      {/* ================= LIST KARTU UKURAN (Tampilan Ultra Premium) ================= */}
      {isLoading ? (
        <div className="py-32 flex justify-center items-center">
          <div className="w-10 h-10 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sizes.length === 0 ? (
        <div className="relative py-32 flex flex-col items-center justify-center bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none overflow-hidden shadow-sm group">
          <div className="absolute inset-0 opacity-[0.03] grayscale sepia mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-16 h-16 text-[#D9B35A]/60 mb-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
            <h4 className="text-3xl font-serif text-[#2D1A11] mb-3 tracking-wide font-medium">Katalog Proporsi Kosong</h4>
            <p className="text-[#8B7355] text-sm font-light tracking-wider">Mulai tentukan skala arsitektur pertama untuk mahakarya ini.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none grayscale sepia mix-blend-multiply" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>

          {sizes.map((size) => (
            <div key={size.id} className="group bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(45,26,17,0.2)] hover:-translate-y-2 transition-all duration-1000 relative overflow-hidden flex flex-col z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#D9B35A] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-8 flex gap-8">
                <div className="w-32 h-32 rounded-none overflow-hidden border border-[#D9B35A]/30 bg-white p-2 shadow-inner flex-shrink-0 flex items-center justify-center transition-transform duration-1000 group-hover:scale-105">
                  {size.img ? (
                    <img src={getImageUrl(size.img)} alt={size.title} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <svg className="w-10 h-10 text-[#D9B35A]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[10px] uppercase font-bold text-[#8B7355] tracking-[0.3em] mb-2 line-clamp-1 border-b border-[#D9B35A]/20 pb-1 inline-block self-start">
                    {size.short_desc || 'EDISI STANDAR'}
                  </p>
                  <h4 className="text-3xl font-serif font-medium text-[#2D1A11] leading-none mb-4">{size.title}</h4>
                  {size.price ? (
                     <div className="inline-flex items-center gap-2 text-[#D9B35A] text-[11px] font-bold tracking-[0.2em] self-start">
                       <span className="w-2 h-2 bg-[#D9B35A] rounded-none rotate-45"></span>
                       + RP {Number(size.price).toLocaleString('id-ID')}
                     </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-[#8B7355] text-[11px] font-bold tracking-[0.2em] self-start opacity-70">
                       <span className="w-4 h-[1px] bg-[#8B7355]"></span>
                       HARGA DASAR
                     </div>
                  )}
                </div>
              </div>

              <div className="bg-[#2D1A11] px-8 py-5 flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
                <div className="text-center relative z-10 w-full">
                  <p className="text-[9px] uppercase font-semibold text-[#D9B35A]/70 mb-1 tracking-[0.2em]">Lebar (W)</p>
                  <p className="text-lg font-serif text-[#D9B35A]">{size.width || 0} <span className="text-[10px] font-sans">{size.unit}</span></p>
                </div>
                <div className="w-[1px] h-10 bg-[#D9B35A]/20 relative z-10"></div>
                <div className="text-center relative z-10 w-full">
                  <p className="text-[9px] uppercase font-semibold text-[#D9B35A]/70 mb-1 tracking-[0.2em]">Tinggi (H)</p>
                  <p className="text-lg font-serif text-[#D9B35A]">{size.height || 0} <span className="text-[10px] font-sans">{size.unit}</span></p>
                </div>
                <div className="w-[1px] h-10 bg-[#D9B35A]/20 relative z-10"></div>
                <div className="text-center relative z-10 w-full">
                  <p className="text-[9px] uppercase font-semibold text-[#D9B35A]/70 mb-1 tracking-[0.2em]">Dalam (D)</p>
                  <p className="text-lg font-serif text-[#D9B35A]">{size.depth || 0} <span className="text-[10px] font-sans">{size.unit}</span></p>
                </div>
              </div>

              <div className="flex">
                <button onClick={() => handleEdit(size)} className="flex-1 py-4 bg-white text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7355] border-t border-r border-[#D9B35A]/20 hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:border-[#D9B35A] transition-all duration-500 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  Perbarui
                </button>
                <button onClick={() => handleDelete(size.id)} className="w-16 flex-shrink-0 flex items-center justify-center bg-white text-rose-900/50 border-t border-[#D9B35A]/20 hover:bg-rose-900 hover:text-white hover:border-rose-900 transition-all duration-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER MODAL DI LUAR DOM TREE (PORTAL) */}
      {mounted && isModalOpen && createPortal(modalContent, document.body)}

    </div>
  );
}