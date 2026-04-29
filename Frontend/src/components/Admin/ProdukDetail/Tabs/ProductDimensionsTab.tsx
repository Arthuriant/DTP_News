"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';
// 1. Import Alert Service
import { AlertService } from '@/services/AlertService';

export default function ProductDimensionsTab() {
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasData, setHasData] = useState(false);

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

  // Asset Gunungan
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";

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
      setPreviewImg(URL.createObjectURL(file)); 
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
      setNewImgFile(null);
      setPreviewImg(null);
      fetchDimension(); 
      
      // 2. Tambahkan Notifikasi Sukses
      AlertService.success("Berhasil", "Spesifikasi dimensi mahakarya berhasil disimpan.");
    } catch (error: any) {
      // 3. Ganti alert bawaan dengan AlertService Error
      AlertService.error("Gagal Menyimpan", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    // 4. Ganti confirm bawaan dengan AlertService Confirm
    const isConfirmed = await AlertService.confirm(
      "Hapus Spesifikasi?",
      "Seluruh data spesifikasi & gambar dimensi ini akan dihapus dari mahakarya secara permanen.",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await ProductService.deleteDimension(productId);
        setFormData({ product_style: '', total_volumes: '', weight: '' });
        setExistingImg(null);
        setNewImgFile(null);
        setPreviewImg(null);
        setHasData(false);
        
        // 5. Tambahkan Notifikasi Sukses Hapus
        AlertService.success("Terhapus!", "Data spesifikasi dimensi berhasil dihilangkan.");
      } catch (error: any) {
        // 6. Ganti alert bawaan dengan AlertService Error
        AlertService.error("Gagal Menghapus", error.message);
      }
    }
  };

  if (isLoading) return (
    <div className="py-32 flex justify-center items-center">
      <div className="w-10 h-10 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="font-sans animate-fadeIn relative z-10">
      
      {/* HEADER TAB */}
      <div className="flex justify-between items-center mb-10 border-b border-[#D9B35A]/30 pb-6">
        <div>
          <h3 className="text-3xl font-serif font-medium text-[#2D1A11] tracking-wide flex items-center gap-3">
            Spesifikasi Dimensi
          </h3>
          <p className="text-[#8B7355] text-sm mt-2 font-light tracking-wide">
            Lengkapi arsitektur teknis, ukuran, berat, dan karakter gaya mahakarya.
          </p>
        </div>
      </div>

      {/* FORM CONTAINER MEWAH - Dengan Hover Shadow Elevasi */}
      <div className="relative bg-[#FFFDF5] border border-[#D9B35A]/30 rounded-none p-8 md:p-12 shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(45,26,17,0.15)] transition-shadow duration-1000 flex flex-col lg:flex-row gap-12 overflow-hidden group/container">
        
        {/* Watermark Gunungan Halus */}
        <div 
          className="absolute -right-20 -bottom-20 w-[600px] h-[600px] opacity-[0.03] pointer-events-none grayscale sepia mix-blend-multiply transition-transform duration-1000 group-hover/container:scale-110"
          style={{ 
            backgroundImage: `url('${gununganUrl}')`, 
            backgroundSize: 'contain', 
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat' 
          }}
        ></div>

        {/* KOLOM KIRI: FORM TEKS */}
        <div className="flex-1 space-y-8 relative z-10">
          
          {/* Input: Gaya Produk */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-semibold text-[#2D1A11] tracking-[0.2em] block flex items-center gap-2">
              <span className="w-2 h-[1px] bg-[#D9B35A]"></span> Gaya Produk (Style)
            </label>
            <input 
              type="text" 
              placeholder="Cth: Eksklusif, Klasik, Urban..."
              value={formData.product_style} 
              onChange={e => setFormData({...formData, product_style: e.target.value})} 
              className="w-full bg-white/50 border border-[#D9B35A]/30 px-5 py-4 rounded-none text-sm outline-none focus:border-[#D9B35A] focus:bg-white focus:shadow-[0_0_20px_rgba(217,179,90,0.15)] hover:border-[#D9B35A]/70 hover:bg-white hover:shadow-[0_5px_15px_-3px_rgba(217,179,90,0.1)] transition-all duration-500 placeholder:text-[#8B7355]/40 text-[#2D1A11]" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input: Volume */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-semibold text-[#2D1A11] tracking-[0.2em] block flex items-center gap-2">
                <span className="w-2 h-[1px] bg-[#D9B35A]"></span> Kapasitas Volume
              </label>
              <div className="relative group/input">
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.total_volumes} 
                  onChange={e => setFormData({...formData, total_volumes: e.target.value})} 
                  className="w-full bg-white/50 border border-[#D9B35A]/30 pl-5 pr-14 py-4 rounded-none text-sm outline-none focus:border-[#D9B35A] focus:bg-white focus:shadow-[0_0_20px_rgba(217,179,90,0.15)] hover:border-[#D9B35A]/70 hover:bg-white hover:shadow-[0_5px_15px_-3px_rgba(217,179,90,0.1)] transition-all duration-500 text-[#2D1A11]" 
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-[#8B7355] group-focus-within/input:text-[#D9B35A] transition-colors">LITER</span>
              </div>
            </div>
            
            {/* Input: Berat */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-semibold text-[#2D1A11] tracking-[0.2em] block flex items-center gap-2">
                <span className="w-2 h-[1px] bg-[#D9B35A]"></span> Bobot Kosong
              </label>
              <div className="relative group/input">
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.weight} 
                  onChange={e => setFormData({...formData, weight: e.target.value})} 
                  className="w-full bg-white/50 border border-[#D9B35A]/30 pl-5 pr-14 py-4 rounded-none text-sm outline-none focus:border-[#D9B35A] focus:bg-white focus:shadow-[0_0_20px_rgba(217,179,90,0.15)] hover:border-[#D9B35A]/70 hover:bg-white hover:shadow-[0_5px_15px_-3px_rgba(217,179,90,0.1)] transition-all duration-500 text-[#2D1A11]" 
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-[#8B7355] group-focus-within/input:text-[#D9B35A] transition-colors">GRAM</span>
              </div>
            </div>
          </div>

          {/* TOMBOL AKSI EKSKLUSIF */}
          <div className="pt-8 flex gap-5 border-t border-[#D9B35A]/20 mt-10">
            <button 
              type="button" 
              onClick={handleSave}
              disabled={isSaving}
              className={`relative group flex-1 flex items-center justify-center gap-3 py-4 bg-[#2D1A11] border border-[#D9B35A]/80 text-[#D9B35A] text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:-translate-y-1 transition-all duration-700 ease-out overflow-hidden ${isSaving ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-[0_15px_30px_-10px_rgba(217,179,90,0.5)]'}`}
            >
              {isSaving ? (
                <span className="animate-pulse">Menyimpan...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Simpan Spesifikasi
                </>
              )}
            </button>
            
            {hasData && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="px-8 py-4 bg-transparent border border-rose-900/30 text-rose-800 text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(159,18,57,0.2)] transition-all duration-500 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: GAMBAR DIMENSI/SKETSA */}
        <div className="w-full lg:w-[420px] flex flex-col relative z-10">
          <label className="text-[10px] uppercase font-semibold text-[#2D1A11] tracking-[0.2em] block flex items-center gap-2 mb-3">
            <span className="w-2 h-[1px] bg-[#D9B35A]"></span> Blueprint / Sketsa Dimensi
          </label>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[350px] border border-[#D9B35A]/30 flex flex-col items-center justify-center p-6 transition-all duration-700 cursor-pointer overflow-hidden relative group rounded-none shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(45,26,17,0.3)] hover:-translate-y-2 ${
              (previewImg || existingImg) ? 'bg-white' : 'bg-white/40 hover:bg-white hover:border-[#D9B35A]'
            }`}
          >
            {(previewImg || existingImg) ? (
              <>
                <img 
                  src={previewImg || getImageUrl(existingImg!)} 
                  alt="Dimensi" 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" 
                />
                {/* Overlay saat hover pada gambar yang sudah ada */}
                <div className="absolute inset-0 bg-[#2D1A11]/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-[#D9B35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  <span className="text-[#D9B35A] text-[10px] font-bold tracking-[0.2em] uppercase border-b border-[#D9B35A]/50 pb-1">Ganti Sketsa</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-[#8B7355] group-hover:text-[#D9B35A] transition-colors duration-500">
                <svg className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-center leading-relaxed">
                  Unggah Sketsa<br/>Blueprint Dimensi
                </span>
              </div>
            )}
          </div>
          
          {/* Indikator Status Gambar */}
          <div className="h-4 mt-3 flex justify-center">
            {previewImg && (
              <p className="text-[10px] text-[#D9B35A] font-bold uppercase tracking-[0.2em] flex items-center gap-2 animate-pulse">
                <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full"></span> Sketsa siap disimpan
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}