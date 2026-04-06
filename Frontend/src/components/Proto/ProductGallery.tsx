"use client";
import React from "react";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  if (!images || images.length === 0) return null;

  // Fallback images menggunakan unsplash (online) tidak masalah tetap format default, 
  // tapi kalau kamu punya fallback lokal, pastikan pakai .webp
  const fallbackImages = [
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1974&auto=format&fit=crop",
  ];

  return (
    <section className="w-full bg-[#F8F3E9] py-20 lg:py-28 relative overflow-hidden">
      
      {/* ================= ORNAMEN BACKGROUND ================= */}
      
      {/* Siluet Gunungan Raksasa (Watermark Tengah) */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 opacity-[0.05] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Siluet Wayang Pudar di Kiri Atas */}
      <div 
        className="absolute left-[-5%] top-[10%] w-[350px] h-[500px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left top'
        }}
      ></div>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER MEWAH */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <span 
            className="text-[#C5A059] text-[11px] tracking-[0.3em] font-bold uppercase mb-4 block"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            KOLEKSI VISUAL
          </span>
          <h3 
            className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#2D1A11] tracking-wide relative" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pratinjau <span className="text-[#C5A059] font-bold">Produk</span>
            <div className="w-16 h-[1px] bg-[#C5A059] absolute -bottom-5 left-1/2 -translate-x-1/2"></div>
          </h3>
        </div>
        
        {/* GRID GAMBAR MEWAH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 pt-6">
          {images.map((src, index) => (
            <div key={index} className="relative group">
              
              {/* Bingkai Cokelat Tua */}
              <div className="relative aspect-[4/3] w-full rounded-[2rem] bg-[#2D1A11] p-3 shadow-[0_15px_30px_rgba(45,26,17,0.15)] group-hover:shadow-[0_25px_50px_-10px_rgba(197,160,89,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-[#C5A059]/30">

                {/* Inner Card */}
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-[#EFE8DC] border border-[#C5A059]/40 group-hover:border-[#C5A059] transition-colors duration-500 shadow-inner">
                  <img
                    src={src}
                    alt={`Preview Penggunaan ${productName} - ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2.5s] ease-out opacity-95 group-hover:opacity-100"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                    }}
                  />
                  
                  {/* Overlay Gradien */}
                  <div className="absolute inset-0 bg-black/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                  {/* Aksen Sudut Emas */}
                  <div className="absolute top-5 left-5 w-7 h-7 border-t border-l border-[#C5A059] pointer-events-none transition-all duration-500 z-10"></div>
                  <div className="absolute top-5 right-5 w-7 h-7 border-t border-r border-[#C5A059] pointer-events-none transition-all duration-500 z-10"></div>
                  <div className="absolute bottom-5 left-5 w-7 h-7 border-b border-l border-[#C5A059] pointer-events-none transition-all duration-500 z-10"></div>
                  <div className="absolute bottom-5 right-5 w-7 h-7 border-b border-r border-[#C5A059] pointer-events-none transition-all duration-500 z-10"></div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}