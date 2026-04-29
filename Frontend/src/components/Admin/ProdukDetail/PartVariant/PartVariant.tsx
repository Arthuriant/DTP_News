"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductService } from '@/services/ProductService'; 

export default function PartVariant() {
  const params = useParams();
  const router = useRouter();
  
  const productId = params.id as string;
  const partId = params.partId as string;

  // State Data
  const [variants, setVariants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    variant_code: '', // tambah
    price: 0,
  });

  // Fungsi Fetching Data
  const fetchVariants = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getPartVariants(partId);
      // Asumsikan backend mengembalikan array varian untuk part ini
      setVariants(data || []);
    } catch (error) {
      console.error("Gagal mengambil data varian:", error);
    } finally {
      setIsLoading(false);
    }
  }, [partId]);

  useEffect(() => {
    if (partId) fetchVariants();
  }, [fetchVariants, partId]);

  // Fungsi Simpan (Create & Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      product_id: productId,
      part_id: partId,
      name: editForm.name,
      variant_code: editForm.variant_code, // tambah
      price: editForm.price,
    };

    try {
      if (editForm.id) {
        await ProductService.updatePartVariant(editForm.id, payload);
      } else {
        await ProductService.createPartVariant(payload);
      }
      await fetchVariants();
      setIsModalOpen(false);
    } catch (error: any) {
      alert("Gagal Menyimpan Varian: " + error.message);
    }
  };

  // Fungsi Edit
  const handleEdit = (variant: any) => {
    setEditForm({
      id: variant.id,
      name: variant.name,
      variant_code: variant.variant_code, // tambah
      price: Number(variant.price),
    });
    setIsModalOpen(true);
  };

  // Fungsi Hapus
  const handleDelete = async (id: string) => {
    if (confirm("Hapus varian ini secara permanen?")) {
      try {
        await ProductService.deletePartVariant(id);
        setVariants(variants.filter(v => v.id !== id));
      } catch (error: any) {
        alert("Gagal menghapus varian: " + error.message);
      }
    }
  };

  const openNewModal = () => {
    setEditForm({ id: '', name: '', variant_code: '', price: 0 }); // tambah
  setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= BREADCRUMBS & HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2 relative z-10">
        <button 
          onClick={() => router.push(`/admin/produk/${productId}`)}
          className="group flex items-center justify-center w-12 h-12 bg-white border border-[#D9B35A]/30 rounded-full shadow-sm hover:bg-[#D9B35A] transition-all duration-300"
        >
          <svg className="w-5 h-5 text-[#D9B35A] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className="flex-grow">
          <p className="text-[#D9B35A] font-sans text-[10px] tracking-[0.2em] uppercase mb-2 font-bold flex items-center gap-2">
            <span className="cursor-pointer hover:underline" onClick={() => router.push('/admin/produk')}>Produk</span>
            <span>/</span>
            <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/produk/${productId}`)}>Detail</span>
            <span>/</span>
            <span className="text-[#8B7355]">Kelola Varian Part</span>
          </p>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight">Manajemen Varian</h1>
            <button 
              onClick={openNewModal}
              className="px-6 py-3 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] font-sans text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:-translate-y-0.5 transition-all"
            >
              + Tambah Varian
            </button>
          </div>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full"></span>
            ID Part: <span className="font-mono">{partId.split('-')[0]}...</span>
          </p>
        </div>
      </div>

      {/* ================= AREA KERJA VARIAN ================= */}
      <div className="relative w-full min-h-[500px] bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_15px_40px_-15px_rgba(45,26,17,0.08)] p-8 md:p-12 font-sans">
        
        {isLoading ? (
          <div className="text-center py-20 text-[#8B7355]">Memuat data varian...</div>
        ) : variants.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#D9B35A]/30 rounded-2xl bg-white/50">
            <h3 className="text-xl font-bold text-[#2D1A11] mb-2">Belum ada Varian</h3>
            <p className="text-[#8B7355] text-sm">Tambahkan varian pertama untuk part ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <div key={variant.id} className="bg-white border border-[#D9B35A]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#D9B35A]"></div>
                <h4 className="text-xl font-bold text-[#2D1A11] mb-1">{variant.name}</h4>
                <p className="text-sm font-medium text-[#8B7355] mb-4">
                  Harga Tambahan: <span className="text-[#D9B35A] font-black">Rp {Number(variant.price).toLocaleString('id-ID')}</span>
                </p>
                
                <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-100">
                  {/* TOMBOL BARU MENUJU HALAMAN TEXTURE */}
                  <button 
                    onClick={() => router.push(`/admin/produk/${productId}/part/${partId}/variant/${variant.id}`)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-lg transition-all mb-2"
                  >
                    🖼️ Kelola Tekstur
                  </button>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(variant)} className="flex-1 py-2 bg-gray-50 text-xs font-bold text-[#D9B35A] hover:bg-[#D9B35A]/10 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => handleDelete(variant.id)} className="flex-1 py-2 bg-gray-50 text-xs font-bold text-rose-400 hover:bg-rose-50 rounded-lg transition-colors">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL CRUD ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2D1A11] mb-6 border-b border-[#D9B35A]/20 pb-3">
              {editForm.id === '' ? 'Tambah Varian Baru' : 'Edit Varian Part'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4 font-sans">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Nama Varian (cth: Kulit Asli)</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
              </div>
              <div>
              <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Kode Varian (Cth: VAR-TALI-ORIGINAL)</label>
              <input required type="text" value={editForm.variant_code} onChange={e => setEditForm({...editForm, variant_code: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
            </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Harga Tambahan (Rp)</label>
                <input required type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-50 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#c4a150] transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}