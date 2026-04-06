"use client";
import React from "react";

interface ProductSpecification {
  label: string;
  value: string;
}

interface ProductDimensionsProps {
  productName: string;
  image?: string;
  specifications?: ProductSpecification[];
}

export default function ProductDimensions({ productName, image, specifications }: ProductDimensionsProps) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <section className="w-full bg-[#F8F3E9] py-20 lg:py-28 relative overflow-hidden" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
      
      {/* ================= ORNAMEN BACKGROUND UTAMA (WATERMARK) ================= */}
      
      {/* 1. Siluet Gunungan Raksasa (Tengah Belakang) */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 opacity-[0.05] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* 2. Siluet Wayang Pudar (Kiri Atas & Kanan Bawah) */}
      <div 
        className="absolute left-[-5%] top-[5%] w-[350px] h-[500px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left top'
        }}
      ></div>
      <div 
        className="absolute right-[-5%] bottom-[-5%] w-[400px] h-[600px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right bottom'
        }}
      ></div>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Dimensi Mewah */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <span className="text-[#C5A059] text-[10px] tracking-[0.4em] font-bold uppercase mb-3 font-sans block drop-shadow-sm">
            Spesifikasi Teknis
          </span>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#2D1A11] tracking-wide relative drop-shadow-sm">
            Detail <span className="text-[#C5A059] font-bold">Dimensi</span>
            <div className="w-20 h-[1.5px] bg-[#C5A059] absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full"></div>
          </h3>
        </div>
        
        {/* === CARD DIMENSI (BINGKAI GANDA) === */}
        <div className="bg-[#2D1A11] rounded-[2.5rem] p-2 md:p-3 shadow-[0_20px_40px_rgba(45,26,17,0.15)] group transition-all duration-700 hover:shadow-[0_30px_60px_-10px_rgba(197,160,89,0.3)] hover:-translate-y-2 relative overflow-hidden">
          
          {/* Inner Card (Cream Area) */}
          <div className="relative bg-[#F5EFE6] rounded-[2rem] overflow-hidden border border-[#C5A059]/40 flex flex-col h-full z-10">

            {/* --- AREA GAMBAR DIMENSI (Atas) --- */}
            <div className="flex-grow p-8 md:p-16 lg:p-20 flex flex-col items-center justify-center relative z-20">
              <img
                src={image || `/assets/products/default-dimensions.webp`}
                alt={`Dimensi ${productName}`}
                className="max-w-full md:max-w-md h-auto mix-blend-multiply opacity-95 transition-transform duration-[1.5s] group-hover:scale-105 relative z-10 drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  e.currentTarget.nextElementSibling?.classList.add('flex');
                  e.currentTarget.nextElementSibling?.classList.add('flex');
                }}
              />
              
              {/* Fallback ilustrasi tas/kotak jika gambar tidak ditemukan */}
              <div className="hidden flex-col items-center gap-4 text-[#2D1A11] p-10 bg-white/40 rounded-full border border-[#C5A059]/30 backdrop-blur-sm shadow-inner relative z-10">
                <div className="w-24 h-24 flex items-center justify-center text-[#C5A059] drop-shadow-md">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <rect x="4" y="8" width="16" height="11" rx="2" ry="2" />
                    <path d="M8 8V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
                  </svg>
                </div>
                <p className="text-xs font-medium tracking-wide text-[#6B442A] uppercase font-sans text-center">
                  Ilustrasi Dimensi <br/> Tertunda
                </p>
              </div>
            </div>

            {/* --- AREA TABEL SPESIFIKASI (Bawah) --- */}
            <div className="relative bg-[#2D1A11] px-8 py-10 md:px-16 md:py-12 border-t-[3px] border-[#C5A059] mt-auto">
                
                {/* Ornamen Batik Khusus di Panel Bawah */}
                <div 
                  className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
                  style={{ 
                    backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`,
                    backgroundSize: '150px',
                    backgroundRepeat: 'repeat'
                  }}
                ></div>

                {/* Tabel Konten Spesifikasi */}
                <div className="flex flex-col max-w-4xl mx-auto relative z-10">
                  {specifications.map((spec, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-5 border-b border-[#C5A059]/20 gap-3 group/row transition-all duration-500 hover:bg-[#C5A059]/10 px-4 rounded-lg -mx-4"
                    >
                      {/* Label Kiri dengan Diamond List */}
                      <span className="text-[#EFE8DC] font-serif text-sm md:text-lg tracking-wide flex items-center gap-4 group-hover/row:translate-x-2 transition-transform duration-500">
                        <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.8)] group-hover/row:scale-150 transition-all duration-300"></div>
                        {spec.label}
                      </span>
                      
                      {/* Value Kanan (Warna Emas) */}
                      <span className="font-semibold text-[#C5A059] font-serif capitalize text-sm md:text-lg sm:text-right group-hover/row:-translate-x-2 transition-transform duration-500">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}