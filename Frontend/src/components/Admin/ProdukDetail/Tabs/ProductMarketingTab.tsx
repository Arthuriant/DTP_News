"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';
// 1. Import Alert Service
import { AlertService } from '@/services/AlertService';

export default function ProductMarketingTab() {
  const params = useParams();
  const productId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Asset Nusantara
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  // Modal State untuk Block Utama
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    id: '', title: '', subtitle: '', description: '', img: null as File | null
  });

  // Modal State untuk Feature (Fitur/List)
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [featureForm, setFeatureForm] = useState({ block_id: '', title: '' });

  // Mencegah Hydration Error pada Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kunci Scroll saat Modal Terbuka
  useEffect(() => {
    if (isBlockModalOpen || isFeatureModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isBlockModalOpen, isFeatureModalOpen]);

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getMarketingBlocks(productId);
      setBlocks(data || []);
    } catch (error) {
      console.error("Gagal mengambil data marketing:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchBlocks();
  }, [fetchBlocks, productId]);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('storage/') ? `${path}` : `${path}`;
  };

  // --- HANDLER BLOCK ---
  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('title', blockForm.title);
    if (blockForm.subtitle) formData.append('subtitle', blockForm.subtitle);
    if (blockForm.description) formData.append('description', blockForm.description);
    if (blockForm.img) formData.append('img', blockForm.img);

    try {
      if (blockForm.id) {
        await ProductService.updateMarketingBlock(blockForm.id, formData);
      } else {
        await ProductService.createMarketingBlock(formData);
      }
      setIsBlockModalOpen(false);
      fetchBlocks();
      
      // Menggunakan AlertService untuk Sukses
      AlertService.success("Berhasil", "Narasi marketing berhasil disimpan.");
    } catch (error: any) {
      // Menggunakan AlertService untuk Error
      AlertService.error("Gagal Menyimpan", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    // Menggunakan AlertService untuk Konfirmasi
    const isConfirmed = await AlertService.confirm(
      "Hapus Narasi?",
      "Narasi marketing beserta gambar dan semua poin fiturnya akan dihapus secara permanen.",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await ProductService.deleteMarketingBlock(id);
        fetchBlocks();
        AlertService.success("Terhapus!", "Narasi marketing berhasil dihapus.");
      } catch (error: any) {
        AlertService.error("Gagal Menghapus", error.message);
      }
    }
  };

  // --- HANDLER FEATURE ---
  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ProductService.createMarketingFeature({
        product_id: productId,
        block_id: featureForm.block_id,
        title: featureForm.title
      });
      setIsFeatureModalOpen(false);
      setFeatureForm({ block_id: '', title: '' }); 
      fetchBlocks(); 
      
      // Menggunakan AlertService untuk Sukses
      AlertService.success("Berhasil", "Poin fitur berhasil ditambahkan.");
    } catch (error: any) {
      // Menggunakan AlertService untuk Error
      AlertService.error("Gagal Menyimpan", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    // Menggunakan AlertService untuk Konfirmasi
    const isConfirmed = await AlertService.confirm(
      "Hapus Poin?",
      "Poin keunggulan ini akan dihapus secara permanen.",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await ProductService.deleteMarketingFeature(featureId);
        fetchBlocks();
        AlertService.success("Terhapus!", "Poin fitur berhasil dihapus.");
      } catch (error: any) {
        AlertService.error("Gagal Menghapus", error.message);
      }
    }
  };

  // ================= STYLING FORM (Mengikuti AddressModal) =================
  const inputClass = "w-full bg-white text-[#2D1A11] px-4 py-2.5 rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] border-none outline-none focus:ring-2 focus:ring-[#D9B35A]/50 transition-all font-semibold placeholder-[#8B7355]/40 text-sm appearance-none";
  const labelClass = "block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1";

  // ================= MODAL BLOK KONTEN (Gaya AddressModal) =================
  const blockModalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn transition-all duration-300 font-sans"
      onClick={(e) => e.target === e.currentTarget && !isSaving && setIsBlockModalOpen(false)}
    >
      <div className="relative bg-[#F8F3E9] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex-none relative z-10 bg-[#2D1A11] px-6 py-4 shadow-md flex justify-between items-center">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-lg font-serif font-bold tracking-wide flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
              {blockForm.id === '' ? "Tambah Narasi Konten" : "Ubah Narasi Konten"}
            </h2>
          </div>
          <button onClick={() => setIsBlockModalOpen(false)} disabled={isSaving} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all cursor-pointer disabled:opacity-50">✕</button>
        </div>

        {/* BODY MODAL - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 scrollbar-thin scrollbar-thumb-[#D9B35A]/50 scrollbar-track-transparent">
          <form id="blockForm" onSubmit={handleSaveBlock} className="space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className={labelClass}>Judul Narasi *</label>
                <input required maxLength={25} value={blockForm.title} onChange={e => setBlockForm({...blockForm, title: e.target.value})} className={inputClass} placeholder="Maks. 25 karakter..." />
              </div>
              <div className="w-full">
                <label className={labelClass}>Sub Judul (Opsional)</label>
                <input maxLength={50} value={blockForm.subtitle} onChange={e => setBlockForm({...blockForm, subtitle: e.target.value})} className={inputClass} placeholder="Maks. 50 karakter..." />
              </div>
            </div>

            <div>
              <label className={labelClass}>Deskripsi Lengkap (Opsional)</label>
              <textarea rows={4} value={blockForm.description} onChange={e => setBlockForm({...blockForm, description: e.target.value})} className={inputClass + " resize-none"} placeholder="Ceritakan nilai jual atau keunggulan dari fitur ini..."></textarea>
            </div>

            <div>
              <label className={labelClass}>Gambar / Visualisasi (Opsional)</label>
              <div className="bg-white rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] px-2 py-1.5 flex items-center">
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => setBlockForm({...blockForm, img: e.target.files ? e.target.files[0] : null})} className="w-full text-xs text-[#8B7355] file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#2D1A11] file:text-[#D9B35A] file:font-bold file:uppercase file:cursor-pointer cursor-pointer outline-none" />
              </div>
            </div>

          </form>
        </div>

        {/* FOOTER MODAL */}
        <div className="flex-none p-4 sm:px-8 py-4 border-t border-[#8B7355]/10 flex justify-end items-center gap-4 bg-[#EFE8DC] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={() => setIsBlockModalOpen(false)} disabled={isSaving} className="text-[#8B7355] font-black text-[10px] uppercase tracking-widest hover:text-[#2D1A11] px-5 py-2.5 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button type="submit" form="blockForm" disabled={isSaving} className="bg-gradient-to-r from-[#2D1A11] to-[#3d2417] text-[#D9B35A] px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50">
            {isSaving ? "Menyimpan..." : "Simpan Narasi"}
          </button>
        </div>
      </div>
    </div>
  );

  // ================= MODAL POIN FITUR (Gaya AddressModal) =================
  const featureModalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn transition-all duration-300 font-sans"
      onClick={(e) => e.target === e.currentTarget && !isSaving && setIsFeatureModalOpen(false)}
    >
      <div className="relative bg-[#F8F3E9] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-sm flex flex-col overflow-hidden">
        
        {/* HEADER MODAL FITUR */}
        <div className="flex-none relative z-10 bg-[#2D1A11] px-6 py-4 shadow-md flex justify-between items-center">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-sm font-serif font-bold tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
              Tambah Poin Spesifik
            </h2>
          </div>
          <button onClick={() => setIsFeatureModalOpen(false)} disabled={isSaving} className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all cursor-pointer disabled:opacity-50 text-xs">✕</button>
        </div>
        
        <form onSubmit={handleSaveFeature} className="p-6">
          <label className={labelClass}>Teks Poin (Maks 25 Karakter)</label>
          <input 
            required autoFocus maxLength={25} 
            value={featureForm.title} onChange={e => setFeatureForm({...featureForm, title: e.target.value})} 
            className={`${inputClass} mb-6`} 
            placeholder="Cth: Tahan Air & Debu"
          />
          <div className="flex justify-end items-center gap-3">
            <button type="button" onClick={() => setIsFeatureModalOpen(false)} disabled={isSaving} className="text-[#8B7355] font-black text-[10px] uppercase tracking-widest hover:text-[#2D1A11] px-4 py-2 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="bg-gradient-to-r from-[#2D1A11] to-[#3d2417] text-[#D9B35A] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
              {isSaving ? "Tunggu..." : "Sahkan"}
            </button>
          </div>
        </form>
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
            Nilai Jual (Marketing)
          </h3>
          <p className="text-[#8B7355] text-sm mt-3 font-light tracking-wide pl-12">
            Rangkai identitas mahakarya melalui blok narasi visual dan rincian spesifikasi keunggulan.
          </p>
        </div>
        
        {/* Tombol Tambah Premium */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D9B35A] to-[#8B7355] opacity-0 group-hover:opacity-30 blur transition-opacity duration-700"></div>
          <button 
            onClick={() => { setBlockForm({ id: '', title: '', subtitle: '', description: '', img: null }); setIsBlockModalOpen(true); }}
            className="relative flex items-center gap-3 px-8 py-4 bg-[#2D1A11] border border-[#D9B35A]/80 text-[#D9B35A] text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[0_0_20px_rgba(217,179,90,0.4)] transition-all duration-700 ease-out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path>
            </svg>
            TAMBAH NARASI
          </button>
        </div>
      </div>

      {/* ================= LIST BLOK MARKETING ================= */}
      {isLoading ? (
        <div className="py-32 flex justify-center items-center">
          <div className="w-10 h-10 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : blocks.length === 0 ? (
        /* EMPTY STATE */
        <div className="relative py-32 flex flex-col items-center justify-center bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none overflow-hidden shadow-sm group">
          <div className="absolute inset-0 opacity-[0.03] grayscale sepia mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-16 h-16 text-[#D9B35A]/60 mb-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            <h4 className="text-3xl font-serif text-[#2D1A11] mb-3 tracking-wide font-medium">Buku Cerita Kosong</h4>
            <p className="text-[#8B7355] text-sm font-light tracking-wider">Mulai ukir nilai sejarah dan keunggulan mahakarya Anda.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-10 relative">
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none grayscale sepia mix-blend-multiply" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>

          {blocks.map((block) => (
            <div key={block.id} className="group bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(45,26,17,0.15)] transition-all duration-1000 relative overflow-hidden flex flex-col md:flex-row z-10">
              
              {/* Garis Aksen Kiri */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D9B35A] opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* KOLOM KIRI: INFO BLOK & GAMBAR */}
              <div className="flex-1 flex flex-col sm:flex-row gap-8 p-8 border-b md:border-b-0 md:border-r border-[#D9B35A]/20">
                {/* Thumbnail Gambar */}
                <div className="w-full sm:w-40 h-40 rounded-none overflow-hidden border border-[#D9B35A]/30 bg-white p-2 shadow-inner flex-shrink-0 flex items-center justify-center transition-transform duration-1000 group-hover:scale-105">
                  {block.img ? (
                    <img src={getImageUrl(block.img)} className="w-full h-full object-cover mix-blend-multiply" alt={block.title} />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center opacity-50">
                      <svg className="w-8 h-8 text-[#D9B35A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[#8B7355]">Tanpa Visual</span>
                    </div>
                  )}
                </div>
                
                {/* Konten Text */}
                <div className="flex-1 flex flex-col">
                  {block.subtitle && <p className="text-[10px] uppercase font-bold text-[#8B7355] tracking-[0.3em] mb-2">{block.subtitle}</p>}
                  <h4 className="text-2xl font-serif font-medium text-[#2D1A11] mb-3 leading-tight">{block.title}</h4>
                  {block.description && <p className="text-sm text-[#8B7355] leading-relaxed line-clamp-3 mb-6 font-light">{block.description}</p>}
                  
                  {/* Tombol Aksi Blok */}
                  <div className="flex gap-4 mt-auto">
                    <button onClick={() => { setBlockForm({ ...block, img: null }); setIsBlockModalOpen(true); }} className="px-6 py-2.5 bg-white text-[9px] font-bold uppercase tracking-[0.2em] text-[#D9B35A] border border-[#D9B35A]/40 hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[0_5px_15px_-3px_rgba(217,179,90,0.4)] transition-all duration-500 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      Perbarui Narasi
                    </button>
                    <button onClick={() => handleDeleteBlock(block.id)} className="px-6 py-2.5 bg-white text-[9px] font-bold uppercase tracking-[0.2em] text-rose-500 border border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 transition-all duration-500 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: DAFTAR FITUR (Gaya Sertifikat/Editorial) */}
              <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col bg-white">
                
                {/* Header Fitur */}
                <div className="flex justify-between items-center p-6 border-b border-[#D9B35A]/10 bg-[#FAFAFA]">
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] tracking-[0.2em]">Poin Spesifikasi ({block.features?.length || 0})</span>
                  <button 
                    onClick={() => { setFeatureForm({ block_id: block.id, title: '' }); setIsFeatureModalOpen(true); }}
                    className="w-8 h-8 flex items-center justify-center text-[#D9B35A] bg-[#D9B35A]/10 hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-all duration-300 rounded-none shadow-sm"
                    title="Tambah Poin"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>

                {/* List Fitur */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-[#D9B35A]/30">
                  {block.features && block.features.length > 0 ? (
                    <ul className="space-y-4">
                      {block.features.map((feat: any) => (
                        <li key={feat.id} className="flex justify-between items-start gap-3 group/feat border-b border-dashed border-[#D9B35A]/20 pb-3 last:border-0 last:pb-0">
                          <div className="flex gap-3 items-start pt-0.5">
                            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-none rotate-45 mt-1 flex-shrink-0"></span>
                            <span className="text-sm text-[#2D1A11] font-medium leading-snug">{feat.title}</span>
                          </div>
                          <button onClick={() => handleDeleteFeature(feat.id)} className="text-rose-400 opacity-0 group-hover/feat:opacity-100 transition-opacity hover:text-rose-600 p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-50 py-4">
                       <svg className="w-8 h-8 text-[#8B7355] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                      <p className="text-[10px] uppercase tracking-widest text-[#8B7355] text-center">Spesifikasi Kosong</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* RENDER MODAL DI LUAR DOM TREE (PORTAL) */}
      {mounted && isBlockModalOpen && createPortal(blockModalContent, document.body)}
      {mounted && isFeatureModalOpen && createPortal(featureModalContent, document.body)}

    </div>
  );
}