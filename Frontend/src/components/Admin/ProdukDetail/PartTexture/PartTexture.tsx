"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductService } from '@/services/ProductService'; 

export default function PartTexture() {
  const params = useParams();
  const router = useRouter();
  
  const productId = params.id as string;
  const partId = params.partId as string;
  const variantId = params.variantId as string; // Menangkap ID Varian!

  const [textures, setTextures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    price: 0,
    top: null as File | null,
    back: null as File | null,
    front: null as File | null,
    thumb: null as File | null,
  });

  const fetchTextures = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getTextures(variantId);
      setTextures(data || []);
    } catch (error) {
      console.error("Gagal mengambil data tekstur:", error);
    } finally {
      setIsLoading(false);
    }
  }, [variantId]);

  useEffect(() => {
    if (variantId) fetchTextures();
  }, [fetchTextures, variantId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('part_id', partId);
    formData.append('variant_id', variantId);
    formData.append('name', editForm.name);
    formData.append('price', editForm.price.toString());

    // Hanya tambahkan file jika ada (Penting saat Update!)
    if (editForm.top) formData.append('top', editForm.top);
    if (editForm.back) formData.append('back', editForm.back);
    if (editForm.front) formData.append('front', editForm.front);
    if (editForm.thumb) formData.append('thumb', editForm.thumb);

    try {
      if (editForm.id) {
        await ProductService.updateTexture(editForm.id, formData);
      } else {
        await ProductService.createTexture(formData);
      }
      await fetchTextures();
      setIsModalOpen(false);
    } catch (error: any) {
      alert("Gagal Menyimpan Tekstur: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus tekstur beserta gambarnya secara permanen?")) {
      try {
        await ProductService.deleteTexture(id);
        setTextures(textures.filter(t => t.id !== id));
      } catch (error: any) {
        alert("Gagal menghapus tekstur: " + error.message);
      }
    }
  };

  const openNewModal = () => {
    setEditForm({ id: '', name: '', price: 0, top: null, back: null, front: null, thumb: null });
    setIsModalOpen(true);
  };

  // Helper untuk menampilkan gambar yang benar dari Database
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.jpg';
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <button 
          onClick={() => router.push(`/admin/produk/${productId}/part/${partId}`)}
          className="group flex items-center justify-center w-12 h-12 bg-white border border-[#D9B35A]/30 rounded-full shadow-sm hover:bg-[#D9B35A] transition-all duration-300"
        >
          <svg className="w-5 h-5 text-[#D9B35A] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className="flex-grow">
          <p className="text-[#D9B35A] font-sans text-[10px] tracking-[0.2em] uppercase mb-2 font-bold flex items-center gap-2">
            <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/produk/${productId}`)}>Detail Part</span>
            <span>/</span>
            <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/produk/${productId}/part/${partId}`)}>Varian</span>
            <span>/</span>
            <span className="text-[#8B7355]">Kelola Tekstur</span>
          </p>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight">Pustaka Tekstur</h1>
            <button onClick={openNewModal} className="px-6 py-3 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] font-sans text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:-translate-y-0.5 transition-all">
              + Unggah Tekstur
            </button>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="relative w-full min-h-[500px] bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_15px_40px_-15px_rgba(45,26,17,0.08)] p-8 font-sans">
        
        {isLoading ? (
          <div className="text-center py-20 text-[#8B7355]">Memuat pustaka tekstur...</div>
        ) : textures.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#D9B35A]/30 rounded-2xl bg-white/50">
            <p className="text-[#8B7355]">Belum ada tekstur. Silakan unggah warna atau material pertama (cth: Hitam Solid).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {textures.map((t) => (
              <div
  key={t.id}
  className="bg-white/90 border border-[#D9B35A]/20 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col xl:flex-row items-stretch gap-6 min-h-[140px]"
>

  {/* Aksen Garis */}
  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#EAC135] to-[#DFB121]"></div>

  {/* 1. INFO */}
  <div className="flex items-center gap-4 w-full xl:w-1/3 pl-2">
    <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D9B35A]/30 bg-[#FFFDF5] p-1.5 flex-shrink-0 shadow-sm">
      <img src={getImageUrl(t.img_thumb)} className="w-full h-full object-contain rounded-lg" />
    </div>
    <div>
      <h4 className="text-lg font-bold text-[#2D1A11] leading-tight">{t.name}</h4>
      <p className="text-xs text-[#8B7355] mt-1.5">
        Harga Tambahan:<br />
        <span className="text-[#D9B35A] font-black text-sm">
          Rp {Number(t.price).toLocaleString('id-ID')}
        </span>
      </p>
    </div>
  </div>

  {/* 2. PREVIEW */}
  <div className="flex-grow flex justify-center gap-6 border-y xl:border-y-0 xl:border-x border-[#D9B35A]/10 py-4 xl:px-6 w-full">

  {[
    { label: "Front", img: t.img_front },
    { label: "Back", img: t.img_back },
    { label: "Top", img: t.img_top }
  ].map((item, i) => (
    
    <div key={i} className="flex flex-col items-center group/preview">

      <span className="text-[10px] uppercase font-bold text-[#8B7355] mb-2">
        {item.label}
      </span>

      {item.img ? (
        <div className="
          w-20 h-20 
          rounded-xl 
          border border-[#D9B35A]/30 
          overflow-hidden 
          bg-white 
          shadow-sm 
          transition-all duration-300
          group-hover/preview:scale-150 
          group-hover/preview:shadow-xl 
          group-hover/preview:z-20
          origin-bottom
          cursor-zoom-in
        ">
          <img 
            src={getImageUrl(item.img)} 
            className="w-full h-full object-cover" 
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl border border-dashed border-rose-200 bg-rose-50 flex items-center justify-center text-[10px] font-bold text-rose-400">
          KOSONG
        </div>
      )}

    </div>

  ))}

</div>

  {/* 3. ACTION BUTTON */}
  <div className="flex flex-row xl:flex-col gap-3 w-full xl:w-32 justify-center">

    <button
      onClick={() => {
        setEditForm({
          id: t.id,
          name: t.name,
          price: Number(t.price),
          top: null,
          back: null,
          front: null,
          thumb: null
        });
        setIsModalOpen(true);
      }}
      className="w-full py-3 bg-white text-[11px] font-bold text-[#D9B35A] rounded-xl border border-[#D9B35A]/40 hover:bg-[#D9B35A] hover:text-white transition-all shadow-sm"
    >
      Ubah Data
    </button>

    <button
      onClick={() => handleDelete(t.id)}
      className="w-full py-3 bg-white text-[11px] font-bold text-rose-500 rounded-xl border border-rose-200 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
    >
      Hapus
    </button>

  </div>

</div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#2D1A11] mb-6 border-b border-[#D9B35A]/20 pb-3">
              {editForm.id === '' ? 'Unggah Tekstur Baru' : 'Edit Data Tekstur'}
            </h2>
            <form onSubmit={handleSave} className="space-y-5 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Nama Tekstur / Warna</label>
                  <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Harga (Rp)</label>
                  <input required type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none" />
                </div>
              </div>

              {/* UPLOAD AREA - WAJIB WEBP SESUAI BACKEND */}
              <div className="bg-[#FFFDF5] border border-dashed border-[#D9B35A]/50 rounded-xl p-5 space-y-4">
                <p className="text-xs text-center text-[#8B7355] font-bold mb-2">Unggah File (Wajib .webp, Maks 2MB)</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-1">1. Gambar Depan (Front)</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, front: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-1">2. Gambar Belakang (Back)</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, back: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-1">3. Gambar Atas (Top)</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, top: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-1">4. Ikon Thumbnail</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, thumb: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A]" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-[#8B7355] font-bold text-xs uppercase tracking-widest">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-md">Simpan Tekstur</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}