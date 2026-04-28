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

  // Asset Gunungan
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";

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

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.jpg';
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('product_id', productId);
    
    Array.from(e.target.files).forEach((file) => {
      formData.append('images[]', file);
    });

    try {
      await ProductService.uploadGalleries(formData);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchGalleries(); 
    } catch (error: any) {
      alert("Gagal mengunggah gambar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus mahakarya ini dari galeri?")) {
      try {
        await ProductService.deleteGallery(id);
        setGalleries(galleries.filter(g => g.id !== id));
      } catch (error: any) {
        alert("Gagal menghapus gambar: " + error.message);
      }
    }
  };

  const moveImage = async (index: number, direction: 'left' | 'right') => {
    if ((direction === 'left' && index === 0) || (direction === 'right' && index === galleries.length - 1)) return;

    const newGalleries = [...galleries];
    const swapIndex = direction === 'left' ? index - 1 : index + 1;

    const temp = newGalleries[index];
    newGalleries[index] = newGalleries[swapIndex];
    newGalleries[swapIndex] = temp;

    const ordersPayload = newGalleries.map((g, idx) => ({
      id: g.id,
      sort_order: idx 
    }));

    setGalleries(newGalleries);

    try {
      await ProductService.reorderGalleries(ordersPayload);
    } catch (error) {
      console.error("Gagal mengurutkan:", error);
      fetchGalleries(); 
    }
  };

  return (
    <div className="font-sans animate-fadeIn max-w-7xl mx-auto relative z-10">
      
      {/* Header Tab */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#D9B35A]/30 pb-6 gap-4 relative">
        <div>
          <h3 className="text-3xl font-serif font-medium text-[#2D1A11] tracking-wide flex items-center gap-3">
            Galeri Visual
          </h3>
          <p className="text-[#8B7355] text-sm mt-2 font-light tracking-wide">
            Kelola representasi visual produk. Urutan pertama akan tampil sebagai <span className="text-[#D9B35A] font-semibold">wajah utama mahakarya</span>.
          </p>
        </div>
        
        {/* Tombol Upload Premium - Efek Glow saat Hover */}
        <div className="relative group">
          {/* Efek Glow di belakang tombol */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D9B35A] to-[#8B7355] opacity-0 group-hover:opacity-30 blur transition-opacity duration-700"></div>
          
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
            className={`relative flex items-center gap-3 px-8 py-3.5 bg-[#2D1A11] border border-[#D9B35A]/80 text-[#D9B35A] text-xs font-semibold uppercase tracking-[0.2em] rounded-none hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[0_0_20px_rgba(217,179,90,0.4)] transition-all duration-700 ease-out ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <span className="animate-pulse tracking-[0.3em]">MENGUNGGAH...</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path>
                </svg>
                TAMBAH GAMBAR
              </>
            )}
          </button>
        </div>
      </div>

      {/* Konten Utama */}
      {isLoading ? (
        <div className="py-32 flex justify-center items-center">
          <div className="w-10 h-10 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : galleries.length === 0 ? (
        /* EMPTY STATE DENGAN GUNUNGAN BESAR */
        <div className="relative py-32 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF5] to-[#FDF9F1] border border-[#D9B35A]/30 rounded-sm overflow-hidden shadow-inner group">
          {/* Gunungan Background di Empty State */}
          <div 
            className="absolute inset-0 opacity-[0.04] grayscale sepia mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
            style={{ 
              backgroundImage: `url('${gununganUrl}')`, 
              backgroundSize: 'contain', 
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat' 
            }}
          ></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-14 h-14 text-[#D9B35A]/60 mb-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h4 className="text-2xl font-serif text-[#2D1A11] mb-2 tracking-wide font-medium">Kanvas Masih Kosong</h4>
            <p className="text-[#8B7355] text-sm font-light tracking-wider">Unggah gambar untuk memamerkan keindahan mahakarya ini.</p>
          </div>
        </div>
      ) : (
        /* GRID GALERI DENGAN SHADOW MEWAH */
        <div className="relative">
          {/* Watermark Gunungan halus di belakang grid */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none grayscale sepia mix-blend-multiply"
            style={{ 
              backgroundImage: `url('${gununganUrl}')`, 
              backgroundSize: 'contain', 
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat' 
            }}
          ></div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
            {galleries.map((item, index) => (
              <div key={item.id} className="group bg-[#FFFDF5] rounded-none overflow-hidden transition-all duration-700 relative aspect-[4/5] border border-[#D9B35A]/30 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(45,26,17,0.4)] hover:-translate-y-2 hover:border-[#D9B35A]">
                
                {/* Badge Urutan - Tampilan Pita Klasik */}
                <div className="absolute top-4 left-0 bg-[#2D1A11] text-[#D9B35A] text-[10px] font-bold px-4 py-1.5 z-10 tracking-[0.2em] shadow-md border-y border-r border-[#D9B35A]/50 group-hover:bg-[#D9B35A] group-hover:text-[#2D1A11] transition-colors duration-500">
                  {index === 0 ? 'UTAMA' : `NO. ${index + 1}`}
                </div>

                {/* Gambar Utama dengan Zoom Halus */}
                <div className="w-full h-full bg-white p-6 flex items-center justify-center transition-transform duration-1000 group-hover:scale-110">
                  <img src={getImageUrl(item.img)} alt={`Gallery ${index}`} className="w-full h-full object-contain mix-blend-multiply" />
                </div>

                {/* Overlay Aksi - Dark Glassmorphism */}
                <div className="absolute inset-0 bg-[#2D1A11]/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5">
                  
                  {/* Tombol Hapus - Mewah dan Tegas */}
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(item.id)} className="w-10 h-10 bg-rose-950/80 hover:bg-rose-600 backdrop-blur-md text-white/80 hover:text-white rounded-none flex items-center justify-center transition-all duration-300 border border-rose-500/30 hover:border-rose-300 shadow-lg hover:shadow-rose-500/50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Tombol Geser Posisi - Aksen Emas */}
                  <div className="flex justify-center gap-3 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <button 
                      onClick={() => moveImage(index, 'left')} 
                      disabled={index === 0}
                      className={`w-12 h-10 flex items-center justify-center backdrop-blur-md transition-all duration-300 rounded-none shadow-lg ${index === 0 ? 'bg-[#2D1A11]/40 border border-white/10 text-white/20 cursor-not-allowed' : 'bg-[#2D1A11]/90 border border-[#D9B35A]/50 text-[#D9B35A] hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[0_0_15px_rgba(217,179,90,0.5)]'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveImage(index, 'right')} 
                      disabled={index === galleries.length - 1}
                      className={`w-12 h-10 flex items-center justify-center backdrop-blur-md transition-all duration-300 rounded-none shadow-lg ${index === galleries.length - 1 ? 'bg-[#2D1A11]/40 border border-white/10 text-white/20 cursor-not-allowed' : 'bg-[#2D1A11]/90 border border-[#D9B35A]/50 text-[#D9B35A] hover:bg-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[0_0_15px_rgba(217,179,90,0.5)]'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}