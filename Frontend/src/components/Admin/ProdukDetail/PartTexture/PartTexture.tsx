"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductService } from '@/services/ProductService'; 
import Swal from 'sweetalert2'; // 👈 Import SweetAlert2

export default function PartTexture() {
  const params = useParams();
  const router = useRouter();
  
  const productId = params.id as string;
  const partId = params.partId as string;
  const variantId = params.variantId as string;

  const [textures, setTextures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    texture_code: '',
    price: 0,
    is_colorable: false, 
    colors: [] as { name: string, hex: string }[], 
    top: null as File | null,
    back: null as File | null,
    front: null as File | null,
    thumb: null as File | null,
    top_mask: null as File | null, 
    back_mask: null as File | null, 
    front_mask: null as File | null, 
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

  // Fungsi Dinamis untuk Warna
  const addColor = () => {
    setEditForm(prev => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#000000' }] }));
  };

  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    const newColors = [...editForm.colors];
    newColors[index][field] = value;
    setEditForm({ ...editForm, colors: newColors });
  };

  const removeColor = (index: number) => {
    const newColors = editForm.colors.filter((_, i) => i !== index);
    setEditForm({ ...editForm, colors: newColors });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (editForm.is_colorable && editForm.colors.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Jika opsi "Dapat Diwarnai" aktif, minimal harus ada 1 palet warna!',
        confirmButtonColor: '#D9B35A'
      });
      return;
    }

    // SweetAlert Loading
    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu sementara data sedang diunggah.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('part_id', partId);
    formData.append('variant_id', variantId);
    formData.append('name', editForm.name);
    formData.append('price', editForm.price.toString());
    formData.append('texture_code', editForm.texture_code);
    
    formData.append('is_colorable', editForm.is_colorable ? 'true' : 'false');
    
    if (editForm.is_colorable) {
      formData.append('colors', JSON.stringify(editForm.colors));
      if (editForm.top_mask) formData.append('top_mask', editForm.top_mask);
      if (editForm.back_mask) formData.append('back_mask', editForm.back_mask);
      if (editForm.front_mask) formData.append('front_mask', editForm.front_mask);
    }

    if (editForm.top) formData.append('top', editForm.top);
    if (editForm.back) formData.append('back', editForm.back);
    if (editForm.front) formData.append('front', editForm.front);
    if (editForm.thumb) formData.append('thumb', editForm.thumb);

    try {
      if (editForm.id) {
        await ProductService.updateTexture(editForm.id, formData);
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data tekstur berhasil diperbarui.', timer: 2000, showConfirmButton: false });
      } else {
        await ProductService.createTexture(formData);
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Tekstur baru berhasil ditambahkan.', timer: 2000, showConfirmButton: false });
      }
      await fetchTextures();
      setIsModalOpen(false);
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.message || 'Terjadi kesalahan saat menyimpan tekstur.', confirmButtonColor: '#D9B35A' });
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data tekstur dan gambar terkait akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#8B7355',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
          await ProductService.deleteTexture(id);
          setTextures(textures.filter(t => t.id !== id));
          Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Tekstur telah berhasil dihapus.', timer: 1500, showConfirmButton: false });
        } catch (error: any) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: error.message || 'Terjadi kesalahan saat menghapus tekstur.', confirmButtonColor: '#D9B35A' });
        }
      }
    });
  };

  const openNewModal = () => {
    setEditForm({ 
      id: '', name: '', texture_code: '', price: 0, 
      is_colorable: false, colors: [], 
      top: null, back: null, front: null, thumb: null,
      top_mask: null, back_mask: null, front_mask: null 
    }); 
    setIsModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditForm({
      id: t.id,
      name: t.name,
      texture_code: t.texture_code, 
      price: Number(t.price),
      is_colorable: Boolean(t.is_colorable),
      colors: Array.isArray(t.colors) ? t.colors : [],
      top: null, back: null, front: null, thumb: null,
      top_mask: null, back_mask: null, front_mask: null
    });
    setIsModalOpen(true);
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/150?text=No+Image'; // 👈 Fallback jika kosong
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <button 
          onClick={() => router.push(`/admin/produk/${productId}/part/${partId}`)}
          className="group flex items-center justify-center w-12 h-12 bg-white border border-[#D9B35A]/30 rounded-full shadow-sm hover:bg-[#D9B35A] transition-all duration-300 shrink-0"
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
          <div className="flex justify-between items-center flex-wrap gap-4">
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
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D9B35A]"></div>
          </div>
        ) : textures.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#D9B35A]/30 rounded-2xl bg-white/50">
            <p className="text-[#8B7355]">Belum ada tekstur. Silakan unggah warna atau material pertama.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {textures.map((t) => (
              <div
                key={t.id}
                className="bg-white/95 border border-[#D9B35A]/30 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col md:flex-row items-center md:items-stretch gap-8 overflow-hidden"
              >
                {/* Garis Aksen Kiri */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#EAC135] to-[#DFB121]"></div>

                {/* 1. INFO DETAIL (KIRI) */}
                <div className="flex items-center gap-5 w-full md:w-[35%] shrink-0 pl-3">
                  <div className="w-24 h-24 rounded-2xl border border-[#E5D7C1] bg-[#F9F6EE] p-2 flex-shrink-0 shadow-inner">
                    <img src={getImageUrl(t.img_thumb)} alt="Thumb" className="w-full h-full object-contain rounded-xl drop-shadow-sm" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h4 className="text-xl font-bold text-[#2D1A11] leading-tight mb-1">{t.name}</h4>
                    <p className="text-xs text-[#8B7355] mb-3">
                      Harga Tambahan:<br />
                      <span className="text-[#D9B35A] font-black text-sm">
                        Rp {Number(t.price).toLocaleString('id-ID')}
                      </span>
                    </p>
                    
                    {/* Badge & Palet Warna (Sudah Rapi) */}
                    {t.is_colorable && (
                      <div className="flex flex-col items-start gap-2">
                        <span className="inline-flex items-center px-3 py-1 bg-[#FDF8E7] text-[#D9B35A] border border-[#D9B35A]/30 text-[9px] font-bold uppercase rounded-full whitespace-nowrap shadow-sm">
                          ✨ Dapat Diwarnai
                        </span>
                        {t.colors && t.colors.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {t.colors.map((c: any, idx: number) => (
                              <div key={idx} className="w-5 h-5 rounded-full border border-[#E5D7C1] shadow-sm hover:scale-125 transition-transform" style={{backgroundColor: c.hex}} title={c.name} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. PREVIEW GAMBAR (TENGAH) */}
                <div className="flex-grow flex justify-center items-center gap-4 sm:gap-8 border-y md:border-y-0 md:border-x border-[#D9B35A]/20 py-5 md:px-8 w-full">
                  {[
                    { label: "Front", img: t.img_front },
                    { label: "Back", img: t.img_back },
                    { label: "Top", img: t.img_top }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center group/preview">
                      <span className="text-[10px] uppercase font-bold text-[#8B7355] mb-2">{item.label}</span>
                      {item.img ? (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#E5D7C1] bg-[#F9F6EE] shadow-sm transition-all duration-300 group-hover/preview:scale-[2] group-hover/preview:shadow-2xl group-hover/preview:z-50 origin-center cursor-zoom-in relative p-2">
                          {/* object-contain agar gambar strip kecil tidak aneh */}
                          <img src={getImageUrl(item.img)} className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-dashed border-rose-200 bg-rose-50 flex items-center justify-center text-[9px] font-bold text-rose-400">KOSONG</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 3. TOMBOL AKSI (KANAN) */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-36 justify-center shrink-0">
                  <button onClick={() => openEditModal(t)} className="w-full py-3 bg-[#FFFDF5] text-[11px] font-bold text-[#D9B35A] rounded-xl border border-[#D9B35A]/50 hover:bg-[#D9B35A] hover:text-[#FFFDF5] transition-all shadow-sm">
                    Ubah Data
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="w-full py-3 bg-[#FFFDF5] text-[11px] font-bold text-rose-500 rounded-xl border border-rose-200 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    Hapus
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL UPLOAD / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar scale-in-center">
            <div className="flex justify-between items-center border-b border-[#D9B35A]/20 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#2D1A11]">
                {editForm.id === '' ? 'Unggah Tekstur Baru' : 'Edit Data Tekstur'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Nama Tekstur / Warna</label>
                  <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A]/50 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Kode Tekstur</label>
                  <input required type="text" value={editForm.texture_code} onChange={e => setEditForm({...editForm, texture_code: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A]/50 transition-all" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Harga Tambahan (Rp)</label>
                  <input required type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A]/50 transition-all" />
                </div>
              </div>

              {/* CHECKBOX BISA DIWARNAI */}
              <div className={`p-4 rounded-xl border transition-colors ${editForm.is_colorable ? 'bg-[#D9B35A]/10 border-[#D9B35A]/50' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isColorable" 
                    checked={editForm.is_colorable}
                    onChange={e => setEditForm({...editForm, is_colorable: e.target.checked})}
                    className="w-5 h-5 accent-[#D9B35A] rounded cursor-pointer"
                  />
                  <label htmlFor="isColorable" className="text-sm font-bold text-[#2D1A11] cursor-pointer select-none">
                    Tekstur ini bisa diwarnai (Menggunakan Masking)
                  </label>
                </div>
                <p className="text-[10px] text-[#8B7355] mt-2 ml-8 leading-relaxed">
                  Centang opsi ini jika Anda ingin kustomer bisa mengganti warna secara kustom. Anda wajib menyediakan gambar <span className="font-bold text-indigo-500">Base</span> (abu-abu/hitam putih) dan <span className="font-bold text-indigo-500">Mask</span> (transparan pemotong) di bawah.
                </p>
              </div>

              {/* PALET WARNA */}
              {editForm.is_colorable && (
                <div className="bg-[#FFFDF5] border border-dashed border-[#D9B35A]/50 rounded-xl p-5 space-y-4 animate-soft-fade">
                  <div className="flex justify-between items-center border-b border-[#D9B35A]/20 pb-2">
                    <label className="text-xs uppercase font-bold text-[#8B7355] block">Daftar Palet Warna Tersedia</label>
                    <button type="button" onClick={addColor} className="text-[10px] bg-[#2D1A11] text-[#D9B35A] px-4 py-2 font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-colors">
                      + Tambah Warna
                    </button>
                  </div>
                  
                  {editForm.colors.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded-lg border border-rose-100 text-rose-500 text-xs font-bold">
                      ⚠️ Wajib tambahkan minimal 1 warna agar fitur ini berfungsi!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {editForm.colors.map((c, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-white p-2.5 rounded-xl border border-[#E5D7C1] shadow-sm group">
                           <input type="color" value={c.hex} onChange={(e) => updateColor(idx, 'hex', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none bg-transparent" />
                           <input type="text" value={c.name} placeholder="Nama Warna (cth: Merah Bata)" onChange={(e) => updateColor(idx, 'name', e.target.value)} className="flex-1 bg-transparent border-b border-dashed border-gray-300 focus:border-[#D9B35A] px-2 py-1 text-sm outline-none font-medium text-[#2D1A11]" required />
                           <button type="button" onClick={() => removeColor(idx)} className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* UPLOAD AREA */}
              <div className="bg-[#FFFDF5] border border-dashed border-[#D9B35A]/50 rounded-xl p-5 space-y-5">
                <div className="text-center">
                  <p className="text-xs text-[#2D1A11] font-bold uppercase tracking-widest">Unggah Aset Visual</p>
                  <p className="text-[10px] text-[#8B7355] mt-1">Wajib menggunakan format <span className="font-bold text-[#D9B35A]">.webp</span> dengan rasio 1:1.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Depan */}
                  <div className="bg-white border border-[#D9B35A]/20 p-4 rounded-xl shadow-sm">
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-2 uppercase">1. Depan (Front) - Base</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, front: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A] file:font-bold hover:file:bg-[#D9B35A] hover:file:text-white transition-all cursor-pointer" />
                    {editForm.is_colorable && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-soft-fade">
                        <label className="text-[10px] font-bold text-indigo-600 block mb-2 uppercase">Masking Depan</label>
                        <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, front_mask: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-bold hover:file:bg-indigo-600 hover:file:text-white transition-all cursor-pointer" />
                      </div>
                    )}
                  </div>

                  {/* Belakang */}
                  <div className="bg-white border border-[#D9B35A]/20 p-4 rounded-xl shadow-sm">
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-2 uppercase">2. Belakang (Back) - Base</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, back: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A] file:font-bold hover:file:bg-[#D9B35A] hover:file:text-white transition-all cursor-pointer" />
                    {editForm.is_colorable && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-soft-fade">
                        <label className="text-[10px] font-bold text-indigo-600 block mb-2 uppercase">Masking Belakang</label>
                        <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, back_mask: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-bold hover:file:bg-indigo-600 hover:file:text-white transition-all cursor-pointer" />
                      </div>
                    )}
                  </div>

                  {/* Atas */}
                  <div className="bg-white border border-[#D9B35A]/20 p-4 rounded-xl shadow-sm">
                    <label className="text-[10px] font-bold text-[#2D1A11] block mb-2 uppercase">3. Atas (Top) - Base</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, top: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A] file:font-bold hover:file:bg-[#D9B35A] hover:file:text-white transition-all cursor-pointer" />
                    {editForm.is_colorable && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-soft-fade">
                        <label className="text-[10px] font-bold text-indigo-600 block mb-2 uppercase">Masking Atas</label>
                        <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, top_mask: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-bold hover:file:bg-indigo-600 hover:file:text-white transition-all cursor-pointer" />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="bg-[#2D1A11] border border-[#D9B35A]/50 p-4 rounded-xl shadow-sm">
                    <label className="text-[10px] font-bold text-[#D9B35A] block mb-2 uppercase">4. Ikon Thumbnail</label>
                    <input type="file" accept=".webp" onChange={e => setEditForm({...editForm, thumb: e.target.files ? e.target.files[0] : null})} className="w-full text-[10px] text-white file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A] file:text-[#2D1A11] file:font-bold hover:file:bg-white transition-all cursor-pointer" />
                    <p className="text-[9px] text-[#8B7355] mt-2 italic">*Thumbnail tidak membutuhkan file mask.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-gray-100 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-4 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#2D1A11] hover:shadow-xl transition-all hover:-translate-y-1">Simpan Data Tekstur</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}