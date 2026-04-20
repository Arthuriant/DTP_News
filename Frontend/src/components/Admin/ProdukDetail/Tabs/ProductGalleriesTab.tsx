"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';

export default function GaleriTab() {
  const params = useParams();
  const productId = params.id as string;

  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Data Galeri
  const fetchGalleries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getGalleries(productId);
      setGalleries(data || []);
    } catch (error) {
      console.error("Gagal mengambil data galeri:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchGalleries();
  }, [fetchGalleries, productId]);

  // Fungsi untuk mendapatkan URL gambar lengkap
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.jpg';
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  // Upload Gambar Multiple
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('product_id', productId);
    
    // Append setiap file ke dalam array 'images[]'
    Array.from(e.target.files).forEach((file) => {
      formData.append('images[]', file);
    });

    try {
      await ProductService.uploadGalleries(formData);
      // Reset input file agar bisa digunakan lagi untuk file yang sama
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchGalleries(); // Refresh data
    } catch (error: any) {
      alert("Gagal mengunggah gambar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Hapus Gambar
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      try {
        await ProductService.deleteGallery(id);
        setGalleries(galleries.filter(g => g.id !== id));
      } catch (error: any) {
        alert("Gagal menghapus gambar: " + error.message);
      }
    }
  };

  // Fungsi sederhana untuk memindahkan posisi gambar (kiri/kanan)
  const moveImage = async (index: number, direction: 'left' | 'right') => {
    if ((direction === 'left' && index === 0) || (direction === 'right' && index === galleries.length - 1)) return;

    // Duplikat array agar state utama tidak berubah secara langsung (imutabilitas)
    const newGalleries = [...galleries];
    const swapIndex = direction === 'left' ? index - 1 : index + 1;

    // Tukar posisi elemen di dalam array
    const temp = newGalleries[index];
    newGalleries[index] = newGalleries[swapIndex];
    newGalleries[swapIndex] = temp;

    // Perbarui nilai sort_order berdasarkan posisi baru
    const ordersPayload = newGalleries.map((g, idx) => ({
      id: g.id,
      sort_order: idx // sort_order dimulai dari 0 atau 1, tidak masalah asal berurutan
    }));

    // Optimistic UI Update (Perbarui tampilan langsung agar terasa cepat)
    setGalleries(newGalleries);

    // Kirim perubahan ke backend secara asinkron
    try {
      await ProductService.reorderGalleries(ordersPayload);
    } catch (error) {
      console.error("Gagal mengurutkan:", error);
      // Jika gagal, kembalikan ke kondisi semula
      fetchGalleries(); 
    }
  };

  return (
    <div className="font-sans animate-fadeIn">
      
      {/* Header Tab */}
      <div className="flex justify-between items-center mb-6 border-b border-[#D9B35A]/20 pb-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2D1A11]">Galeri Visual</h3>
          <p className="text-[#8B7355] text-sm mt-1">Unggah dan atur urutan foto-foto produk. Gambar pertama akan menjadi thumbnail utama.</p>
        </div>
        
        {/* Tombol Upload (Menyembunyikan input file asli) */}
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload} 
            multiple 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`px-5 py-2.5 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-full shadow-md transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isUploading ? 'Mengunggah...' : '+ Unggah Gambar'}
          </button>
        </div>
      </div>

      {/* Konten Utama */}
      {isLoading ? (
        <div className="py-20 text-center text-[#8B7355]">Memuat galeri...</div>
      ) : galleries.length === 0 ? (
        <div className="py-20 text-center bg-white/50 rounded-2xl border border-dashed border-[#D9B35A]/50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#D9B35A]/10 text-[#D9B35A] rounded-full flex items-center justify-center mb-4 text-2xl">📸</div>
          <h4 className="text-lg font-bold text-[#2D1A11] mb-1">Belum Ada Gambar</h4>
          <p className="text-[#8B7355] text-sm">Klik tombol "Unggah Gambar" di atas untuk menambahkan foto produk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleries.map((item, index) => (
            <div key={item.id} className="group bg-white border border-[#D9B35A]/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative aspect-square">
              
              {/* Badge Urutan */}
              <div className="absolute top-2 left-2 bg-[#D9B35A] text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">
                #{index + 1}
              </div>

              {/* Gambar Utama */}
              <div className="w-full h-full bg-[#FFFDF5] p-2 flex items-center justify-center">
                 {/* Asumsi kolom path di DB bernama 'img' */}
                <img src={getImageUrl(item.img)} alt={`Gallery ${index}`} className="w-full h-full object-contain mix-blend-multiply" />
              </div>

              {/* Overlay Aksi (Muncul saat Hover) */}
              <div className="absolute inset-0 bg-[#2D1A11]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                
                {/* Tombol Hapus (Kanan Atas) */}
                <div className="flex justify-end">
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-white/90 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm">
                    🗑️
                  </button>
                </div>

                {/* Tombol Geser Posisi (Tengah Bawah) */}
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => moveImage(index, 'left')} 
                    disabled={index === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${index === 0 ? 'bg-white/30 text-white/50 cursor-not-allowed' : 'bg-white text-[#D9B35A] hover:bg-[#D9B35A] hover:text-white'}`}
                  >
                    ◀
                  </button>
                  <button 
                    onClick={() => moveImage(index, 'right')} 
                    disabled={index === galleries.length - 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${index === galleries.length - 1 ? 'bg-white/30 text-white/50 cursor-not-allowed' : 'bg-white text-[#D9B35A] hover:bg-[#D9B35A] hover:text-white'}`}
                  >
                    ▶
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}