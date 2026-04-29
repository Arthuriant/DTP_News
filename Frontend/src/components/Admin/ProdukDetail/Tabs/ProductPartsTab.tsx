"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ProductService } from '@/services/ProductService'; 
import { useParams, useRouter } from 'next/navigation';

export default function ProductPartsTab() {
  const params = useParams();
  const productId = params.id as string; 
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Asset Nusantara
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  const [editForm, setEditForm] = useState({
    id: '',
    product_id: productId,
    name: '',
    part_code: '', // tambah
    z_index_front: 20,
    z_index_back: 10,
    z_index_top: 10,
  });

  // Mencegah Hydration Error pada Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kunci Scroll saat Modal Terbuka
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  // Fungsi kebal error untuk membaca format JSON dari Laravel
  const parseZIndex = (zIndexData: any) => {
    if (typeof zIndexData === 'string') {
      try { return JSON.parse(zIndexData); } catch (e) { return { Front: 0, Back: 0, Top: 0 }; }
    }
    return zIndexData || { Front: 0, Back: 0, Top: 0 };
  };

  const fetchParts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getParts();
      const filteredParts = (data || []).filter((p: any) => p.product_id === productId);
      setParts(filteredParts);
    } catch (error) {
      console.error("Gagal mengambil data parts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchParts();
  }, [fetchParts, productId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      product_id: productId, 
      name: editForm.name,
      part_code: editForm.part_code, // tambah
      z_index: {
        Front: editForm.z_index_front,
        Back: editForm.z_index_back,
        Top: editForm.z_index_top
      }
    };

    try {
      if (editForm.id) {
        await ProductService.updatePart(editForm.id, payload);
      } else {
        await ProductService.createPart(payload);
      }
      await fetchParts();
      setIsModalOpen(false);
    } catch (error: any) {
      alert("Gagal Menyimpan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (part: any) => {
    const parsedZ = parseZIndex(part.z_index);
    setEditForm({
      id: part.id,
      product_id: part.product_id,
      name: part.name,
      part_code: part.part_code, // tambah
      z_index_front: parsedZ.Front || 0,
      z_index_back: parsedZ.Back || 0,
      z_index_top: parsedZ.Top || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus komponen tas ini beserta foldernya secara permanen dari mahakarya?")) {
      try {
        await ProductService.deletePart(id);
        setParts(parts.filter(p => p.id !== id));
      } catch (error) {
        console.error("Gagal menghapus part:", error);
      }
    }
  };

  const openNewModal = () => {
    setEditForm({ id: '', product_id: productId, name: '', part_code: '', z_index_front: 20, z_index_back: 10, z_index_top: 10 }); // tambah part_code: ''
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
      <div className="relative bg-[#F8F3E9] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex-none relative z-10 bg-[#2D1A11] px-6 py-4 shadow-md flex justify-between items-center">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-lg font-serif font-bold tracking-wide flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
              {editForm.id === '' ? "Tambah Part Baru" : "Ubah Part Produk"}
            </h2>
          </div>
          <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all cursor-pointer disabled:opacity-50">✕</button>
        </div>

        {/* BODY MODAL - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 scrollbar-thin scrollbar-thumb-[#D9B35A]/50 scrollbar-track-transparent">
          <form id="partForm" onSubmit={handleSave} className="space-y-5">
            
            <div>
              <label className={labelClass}>Nama Part / Potongan (Cth: Badan Depan)</label>
              <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className={inputClass} placeholder="Ketik nama komponen..." />
            </div>

            <div>
              <label className={labelClass}>Kode Part (Cth: PRT-BADAN-TAS-KIRI)</label>
              <input 
                required 
                type="text" 
                value={editForm.part_code} 
                onChange={e => setEditForm({...editForm, part_code: e.target.value})} 
                className={inputClass} 
                placeholder="Ketik kode part..." 
              />
            </div>

            <div>
              <label className={labelClass}>Hierarki Z-Index (Kedalaman 3D)</label>
              <div className="grid grid-cols-3 gap-3 bg-[#EFE8DC] p-4 rounded-xl shadow-inner border-none">
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Z-Front</label>
                  <input required type="number" value={editForm.z_index_front} onChange={e => setEditForm({...editForm, z_index_front: Number(e.target.value)})} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Z-Back</label>
                  <input required type="number" value={editForm.z_index_back} onChange={e => setEditForm({...editForm, z_index_back: Number(e.target.value)})} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Z-Top</label>
                  <input required type="number" value={editForm.z_index_top} onChange={e => setEditForm({...editForm, z_index_top: Number(e.target.value)})} className={inputClass} placeholder="0" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* FOOTER MODAL */}
        <div className="flex-none p-4 sm:px-8 py-4 border-t border-[#8B7355]/10 flex justify-end items-center gap-4 bg-[#EFE8DC] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="text-[#8B7355] font-black text-[10px] uppercase tracking-widest hover:text-[#2D1A11] px-5 py-2.5 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button type="submit" form="partForm" disabled={isSaving} className="bg-gradient-to-r from-[#2D1A11] to-[#3d2417] text-[#D9B35A] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50">
            {isSaving ? "Menyimpan..." : "Simpan Part"}
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
            Komponen Slicing (Parts)
          </h3>
          <p className="text-[#8B7355] text-sm mt-3 font-light tracking-wide pl-12">
            Kelola hierarki lapisan (Z-Index) dan potongan bagian tas untuk fitur 3D Customizer.
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
            TAMBAH PART
          </button>
        </div>
      </div>

      {/* ================= LIST KARTU PARTS (Struktur Seperti SIZE) ================= */}
      {isLoading ? (
        <div className="py-32 flex justify-center items-center">
          <div className="w-10 h-10 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : parts.length === 0 ? (
        <div className="relative py-32 flex flex-col items-center justify-center bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none overflow-hidden shadow-sm group">
          <div className="absolute inset-0 opacity-[0.03] grayscale sepia mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-16 h-16 text-[#D9B35A]/60 mb-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            <h4 className="text-3xl font-serif text-[#2D1A11] mb-3 tracking-wide font-medium">Belum Ada Komponen</h4>
            <p className="text-[#8B7355] text-sm font-light tracking-wider">Tambahkan struktur part pertama untuk produk ini.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none grayscale sepia mix-blend-multiply" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>

          {parts.map((p) => {
            const z = parseZIndex(p.z_index);
            return (
              <div 
                key={p.id} 
                onClick={() => router.push(`/admin/produk/${productId}/part/${p.id}`)}
                className="group cursor-pointer bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(45,26,17,0.2)] hover:-translate-y-2 transition-all duration-1000 relative overflow-hidden flex flex-col z-10"
              >
                {/* Garis Aksen Emas Atas */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D9B35A] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Bagian Atas: Info Part */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#8B7355] tracking-[0.3em] mb-2 line-clamp-1 border-b border-[#D9B35A]/20 pb-1 inline-block self-start">
                        KOMPONEN 3D
                      </p>
                      <h4 className="text-3xl font-serif font-medium text-[#2D1A11] leading-none group-hover:text-[#D9B35A] transition-colors duration-500 mt-2">{p.name}</h4>
                    </div>
                    <div className="w-12 h-12 rounded-none border border-[#D9B35A]/30 flex items-center justify-center text-[#D9B35A] group-hover:bg-[#D9B35A] group-hover:text-[#2D1A11] transition-all duration-500 shadow-sm">
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Grid Hierarki Z-Index - Block Gelap Eksklusif Full Width */}
                <div className="bg-[#2D1A11] px-8 py-5 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
                  
                  <div className="text-center relative z-10 w-full">
                    <p className="text-[9px] uppercase font-semibold text-[#D9B35A]/70 mb-1 tracking-[0.2em]">Z-Front</p>
                    <p className="text-xl font-serif text-[#D9B35A]">{z.Front}</p>
                  </div>
                  <div className="w-[1px] h-10 bg-[#D9B35A]/20 relative z-10"></div>
                  
                  <div className="text-center relative z-10 w-full">
                    <p className="text-[9px] uppercase font-semibold text-[#D9B35A]/70 mb-1 tracking-[0.2em]">Z-Back</p>
                    <p className="text-xl font-serif text-[#D9B35A]">{z.Back}</p>
                  </div>
                  <div className="w-[1px] h-10 bg-[#D9B35A]/20 relative z-10"></div>
                  
                  <div className="text-center relative z-10 w-full">
                    <p className="text-[9px] uppercase font-semibold text-[#D9B35A]/70 mb-1 tracking-[0.2em]">Z-Top</p>
                    <p className="text-xl font-serif text-[#D9B35A]">{z.Top}</p>
                  </div>
                </div>

                {/* Tombol Aksi Bawah */}
                <div className="flex">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(p); }} 
                    className="flex-1 py-4 bg-white text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7355] border-t border-r border-[#D9B35A]/20 hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:border-[#D9B35A] transition-all duration-500 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Perbarui
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} 
                    className="w-16 flex-shrink-0 flex items-center justify-center bg-white text-rose-900/50 border-t border-[#D9B35A]/20 hover:bg-rose-900 hover:text-white hover:border-rose-900 transition-all duration-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* RENDER MODAL DI LUAR DOM TREE (PORTAL) */}
      {mounted && isModalOpen && createPortal(modalContent, document.body)}

    </div>
  );
}