"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';

export default function ProductDimensionsTab() {
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasData, setHasData] = useState(false); // Untuk mengecek apakah tombol Hapus perlu muncul

  // State Form
  const [formData, setFormData] = useState({
    product_style: '',
    total_volumes: '',
    weight: '',
  });

  // State Gambar
  const [existingImg, setExistingImg] = useState<string | null>(null);
  const [newImgFile, setNewImgFile] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDimension = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getDimension(productId);
      if (data) {
        setFormData({
          product_style: data.product_style || '',
          total_volumes: data.total_volumes ? data.total_volumes.toString() : '',
          weight: data.weight ? data.weight.toString() : '',
        });
        setExistingImg(data.img);
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error("Gagal mengambil data dimensi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchDimension();
  }, [fetchDimension, productId]);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImgFile(file);
      setPreviewImg(URL.createObjectURL(file)); // Buat preview lokal langsung
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = new FormData();
    if (formData.product_style) payload.append('product_style', formData.product_style);
    if (formData.total_volumes) payload.append('total_volumes', formData.total_volumes);
    if (formData.weight) payload.append('weight', formData.weight);
    if (newImgFile) payload.append('img', newImgFile);

    try {
      await ProductService.saveDimension(productId, payload);
      alert("Spesifikasi Dimensi berhasil disimpan!");
      setNewImgFile(null);
      setPreviewImg(null);
      fetchDimension(); // Refresh data untuk mendapatkan path gambar baru dari backend
    } catch (error: any) {
      alert("Gagal menyimpan dimensi: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Hapus seluruh data spesifikasi & gambar dimensi ini?")) {
      try {
        await ProductService.deleteDimension(productId);
        setFormData({ product_style: '', total_volumes: '', weight: '' });
        setExistingImg(null);
        setNewImgFile(null);
        setPreviewImg(null);
        setHasData(false);
        alert("Data berhasil dihapus.");
      } catch (error: any) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  if (isLoading) return <div className="py-20 text-center text-[#8B7355] animate-pulse">Memuat spesifikasi...</div>;

  return (
    <div className="font-sans animate-fadeIn">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-[#D9B35A]/20 pb-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2D1A11]">Spesifikasi Dimensi</h3>
          <p className="text-[#8B7355] text-sm mt-1">Lengkapi informasi teknis ukuran, berat, dan gaya tas.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-xl border border-[#D9B35A]/20 rounded-[2rem] p-8 shadow-sm flex flex-col lg:flex-row gap-10">
        
        {/* KOLOM KIRI: FORM TEKS */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-2">Gaya Produk (Product Style)</label>
            <input 
              type="text" 
              placeholder="Cth: Casual, Classic, Sporty..."
              value={formData.product_style} 
              onChange={e => setFormData({...formData, product_style: e.target.value})} 
              className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 transition-all" 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-2">Total Volume (Liter/cm³)</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.total_volumes} 
                  onChange={e => setFormData({...formData, total_volumes: e.target.value})} 
                  className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 pl-4 pr-10 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] transition-all" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8B7355]">L</span>
              </div>
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-2">Berat Kosong (Gram)</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.weight} 
                  onChange={e => setFormData({...formData, weight: e.target.value})} 
                  className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 pl-4 pr-12 py-3 rounded-xl text-sm outline-none focus:border-[#D9B35A] transition-all" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8B7355]">Gram</span>
              </div>
            </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="pt-6 flex gap-4 border-t border-[#D9B35A]/10 mt-6">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 py-3.5 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {isSaving ? 'Menyimpan...' : '💾 Simpan Spesifikasi'}
            </button>
            
            {hasData && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="px-6 py-3.5 bg-white border border-rose-200 text-rose-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all"
              >
                Hapus Data
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: GAMBAR DIMENSI */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-2">Gambar / Sketsa Dimensi</label>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all cursor-pointer overflow-hidden relative group ${
              (previewImg || existingImg) ? 'border-[#D9B35A]/30 bg-[#FFFDF5]' : 'border-[#D9B35A]/50 bg-white hover:bg-[#FFFDF5]'
            }`}
          >
            {(previewImg || existingImg) ? (
              <>
                <img 
                  src={previewImg || getImageUrl(existingImg!)} 
                  alt="Dimensi" 
                  className="w-full h-full object-contain" 
                />
                <div className="absolute inset-0 bg-[#2D1A11]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-[#D9B35A] px-4 py-2 rounded-lg text-xs font-bold uppercase">Ganti Gambar</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-4xl mb-3">📏</span>
                <span className="text-xs font-bold text-[#8B7355] text-center">Klik untuk unggah<br/>gambar dimensi/sketsa</span>
              </>
            )}
          </div>
          {previewImg && <p className="text-[10px] text-emerald-600 font-bold mt-2 text-center">* Gambar siap disimpan</p>}
        </div>

      </form>
    </div>
  );
}