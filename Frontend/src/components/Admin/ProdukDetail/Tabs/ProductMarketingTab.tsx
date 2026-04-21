"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';

export default function ProductMarketingTab() {
  const params = useParams();
  const productId = params.id as string;

  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State untuk Block Utama
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    id: '', title: '', subtitle: '', description: '', img: null as File | null
  });

  // Modal State untuk Feature (Fitur/List)
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [featureForm, setFeatureForm] = useState({ block_id: '', title: '' });

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
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  // --- HANDLER BLOCK ---
  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error: any) {
      alert("Gagal menyimpan blok: " + error.message);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (confirm("Hapus blok marketing beserta gambar dan semua fiturnya?")) {
      try {
        await ProductService.deleteMarketingBlock(id);
        fetchBlocks();
      } catch (error: any) {
        alert("Gagal menghapus blok: " + error.message);
      }
    }
  };

  // --- HANDLER FEATURE ---
  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProductService.createMarketingFeature({
        product_id: productId,
        block_id: featureForm.block_id,
        title: featureForm.title
      });
      setIsFeatureModalOpen(false);
      setFeatureForm({ block_id: '', title: '' }); // reset
      fetchBlocks(); // Refresh untuk melihat fitur baru di UI
    } catch (error: any) {
      alert("Gagal menyimpan fitur: " + error.message);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (confirm("Hapus fitur/poin ini?")) {
      try {
        await ProductService.deleteMarketingFeature(featureId);
        fetchBlocks();
      } catch (error: any) {
        alert("Gagal menghapus fitur: " + error.message);
      }
    }
  };

  return (
    <div className="font-sans animate-fadeIn">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-[#D9B35A]/20 pb-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2D1A11]">Nilai Jual (Marketing)</h3>
          <p className="text-[#8B7355] text-sm mt-1">Bangun narasi produk dengan blok gambar dan poin-poin fitur keunggulan.</p>
        </div>
        <button 
          onClick={() => { setBlockForm({ id: '', title: '', subtitle: '', description: '', img: null }); setIsBlockModalOpen(true); }}
          className="px-6 py-3 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:-translate-y-0.5 transition-all"
        >
          + Tambah Blok Konten
        </button>
      </div>

      {/* KONTEN UTAMA */}
      {isLoading ? (
        <div className="py-20 text-center text-[#8B7355] animate-pulse">Memuat data marketing...</div>
      ) : blocks.length === 0 ? (
        <div className="py-20 text-center bg-white/50 rounded-2xl border border-dashed border-[#D9B35A]/50 flex flex-col items-center">
          <span className="text-4xl mb-3">✨</span>
          <h4 className="text-lg font-bold text-[#2D1A11] mb-1">Belum Ada Blok Marketing</h4>
          <p className="text-[#8B7355] text-sm">Tambahkan narasi penawaran atau keunggulan utama produk Anda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="bg-white/90 border border-[#D9B35A]/20 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8">
              
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#EAC135] to-[#DFB121]"></div>

              {/* KOLOM KIRI: INFO BLOK & GAMBAR */}
              <div className="flex-1 flex gap-6 border-b md:border-b-0 md:border-r border-[#D9B35A]/10 pb-6 md:pb-0 md:pr-6">
                {block.img ? (
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-[#D9B35A]/30 bg-[#FFFDF5] flex-shrink-0 shadow-sm">
                    <img src={getImageUrl(block.img)} className="w-full h-full object-cover" alt={block.title} />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl border border-dashed border-[#D9B35A]/30 bg-[#FFFDF5] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#8B7355] text-center p-2">
                    Tanpa<br/>Gambar
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#2D1A11] mb-1">{block.title}</h4>
                  {block.subtitle && <p className="text-sm font-semibold text-[#D9B35A] mb-2">{block.subtitle}</p>}
                  {block.description && <p className="text-xs text-[#8B7355] leading-relaxed line-clamp-3 mb-4">{block.description}</p>}
                  
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => { setBlockForm({ ...block, img: null }); setIsBlockModalOpen(true); }} className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-[#D9B35A] rounded-lg border border-gray-100 hover:bg-[#D9B35A] hover:text-white transition-all">Ubah Blok</button>
                    <button onClick={() => handleDeleteBlock(block.id)} className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-rose-500 rounded-lg border border-gray-100 hover:bg-rose-500 hover:text-white transition-all">Hapus Blok</button>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: DAFTAR FITUR */}
              <div className="w-full md:w-[350px] flex-shrink-0 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest">Poin Keunggulan ({block.features?.length || 0})</span>
                  <button 
                    onClick={() => { setFeatureForm({ block_id: block.id, title: '' }); setIsFeatureModalOpen(true); }}
                    className="text-[10px] font-bold text-[#D9B35A] hover:text-[#2D1A11] transition-colors"
                  >
                    + Tambah Poin
                  </button>
                </div>

                <div className="bg-[#FFFDF5] rounded-xl p-4 border border-[#D9B35A]/10 flex-1 overflow-y-auto max-h-[140px] space-y-2">
                  {block.features && block.features.length > 0 ? (
                    block.features.map((feat: any) => (
                      <div key={feat.id} className="flex justify-between items-start gap-2 group">
                        <div className="flex gap-2">
                          <span className="text-[#D9B35A] mt-0.5">✦</span>
                          <span className="text-xs text-[#2D1A11] font-medium leading-relaxed">{feat.title}</span>
                        </div>
                        <button onClick={() => handleDeleteFeature(feat.id)} className="text-[10px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">✖</button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#8B7355] text-center py-4 italic">Belum ada poin keunggulan.</p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- MODAL BLOK MARKETING --- */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#2D1A11] mb-6 border-b border-[#D9B35A]/20 pb-3">
              {blockForm.id ? 'Edit Blok Marketing' : 'Tambah Blok Marketing Baru'}
            </h2>
            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Judul Utama (Maks 25)</label>
                  <input required maxLength={25} value={blockForm.title} onChange={e => setBlockForm({...blockForm, title: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Sub Judul (Opsional, Maks 50)</label>
                  <input maxLength={50} value={blockForm.subtitle} onChange={e => setBlockForm({...blockForm, subtitle: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Deskripsi Narasi (Opsional)</label>
                <textarea rows={3} value={blockForm.description} onChange={e => setBlockForm({...blockForm, description: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A] resize-none"></textarea>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Gambar Pendukung (Opsional)</label>
                <input type="file" accept="image/*" onChange={e => setBlockForm({...blockForm, img: e.target.files ? e.target.files[0] : null})} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#D9B35A]/10 file:text-[#D9B35A] hover:file:bg-[#D9B35A]/20" />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsBlockModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-200">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#c4a150]">Simpan Blok</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL POIN FITUR --- */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[1.5rem] shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-[#2D1A11] mb-4">Tambah Poin Keunggulan</h3>
            <form onSubmit={handleSaveFeature}>
              <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Teks Fitur (Maks 25 Karakter)</label>
              <input 
                required autoFocus maxLength={25} 
                value={featureForm.title} onChange={e => setFeatureForm({...featureForm, title: e.target.value})} 
                className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] mb-6" 
                placeholder="Cth: Tahan Air & Debu"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsFeatureModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-gray-100 text-[#8B7355] font-bold text-xs">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#D9B35A] text-white font-bold text-xs shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}