"use client";
import React from "react";
import Image from "next/image";

const PromoBanner = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-[#F8F3E9]">
      
      {/* ================= ORNAMEN BACKGROUND LUAR (SECTION) ================= */}
      {/* Siluet Gunungan Pudar di Kanan Atas */}
      <div 
        className="absolute right-[-5%] top-[-10%] w-[500px] h-[800px] pointer-events-none z-0 opacity-[0.1] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top'
        }}
      ></div>
      {/* Siluet Wayang Pudar di Kiri Bawah */}
      <div 
        className="absolute left-[-2%] bottom-[-10%] w-[400px] h-[700px] pointer-events-none z-0 opacity-[0.05] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom'
        }}
      ></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 relative z-10">
        
        {/* ================= 1. KARTU PROMO UTAMA (TAS KERJA) - DARK MODE Mewah ================= */}
        <div className="relative z-1 overflow-hidden rounded-3xl bg-[#2D1A11] py-16 lg:py-20 xl:py-24 px-6 sm:px-10 lg:px-16 xl:px-20 mb-10 shadow-2xl border border-[#C5A059]/30 group">
          
          {/* Hiasan Gunungan Mewah di dalam Kartu (Sangat Samar) */}
          <div 
            className="absolute left-[-10%] bottom-[-20%] w-[600px] h-[600px] pointer-events-none z-0 opacity-[0.1] mix-blend-screen grayscale contrast-125"
            style={{ 
              backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left bottom'
            }}
          ></div>

          {/* Efek Cahaya Emas di Sudut Kartu saat Hover */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] blur-[120px] opacity-0 group-hover:opacity-[0.15] transition-opacity duration-1000 rounded-full pointer-events-none"></div>

          <div className="max-w-[550px] w-full relative z-10">
            <span className="block font-sans font-bold tracking-[0.3em] text-[#C5A059] text-[10px] uppercase mb-4">
              Koleksi Eksekutif
            </span>

            <h2 className="font-serif font-normal text-[#F8F3E9] text-3xl lg:text-4xl xl:text-5xl mb-6 leading-tight">
              DISKON HINGGA <span className="text-[#C5A059] font-medium italic">30%</span>
            </h2>

            <p className="font-sans text-[#E5D7C1] text-sm leading-relaxed mb-10">
              Tas kerja kulit Full Grain dengan kompartemen laptop empuk dan strap bahu yang nyaman. Mahakarya buatan tangan untuk daya tahan seumur hidup.
            </p>

            <a
              href="#"
              className="inline-flex items-center justify-center font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-[#2D1A11] rounded-full bg-[#C5A059] py-4 px-10 ease-out duration-300 hover:bg-[#F8F3E9] shadow-lg border border-transparent hover:border-[#C5A059]"
            >
              Beli Sekarang
            </a>
          </div>

          <Image
            src="/images/promo/promo-01.png"
            alt="premium leather briefcase promo"
            className="hidden md:block absolute bottom-0 right-6 lg:right-20 z-1 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
            width={350}
            height={450}
          />
        </div>

        {/* ================= GRID KARTU PROMO KECIL ================= */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            
            {/* ================= 2. KARTU PROMO DOMPET - Krem Mewah ================= */}
            <div className="relative z-1 overflow-hidden rounded-3xl bg-[#E5D7C1] py-12 xl:py-16 px-6 sm:px-10 flex items-center justify-end border border-[#2D1A11]/10 shadow-lg group">
              
              {/* Hiasan Wayang Kulit di Belakang Gambar (Samar Cokelat) */}
              <div 
                className="absolute left-[5%] top-[10%] w-[350px] h-[350px] pointer-events-none z-0 opacity-[0.05] mix-blend-multiplygrayscale contrast-125"
                style={{ 
                  backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
                  backgroundSize: 'contain', 
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left center'
                }}
              ></div>

              <Image
                src="/images/promo/promo-02.png"
                alt="slim leather wallet promo"
                className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-10 z-1 drop-shadow-[0_15px_30px_rgba(45,26,17,0.3)] transform group-hover:scale-105 transition-transform duration-700"
                width={260}
                height={260}
              />
              
              <div className="text-right relative z-10 max-w-[60%] flex flex-col items-end">
                <span className="block font-sans font-bold tracking-[0.2em] text-[#6B442A] text-[10px] uppercase mb-3">
                  Aksesori Esensial
                </span>

                <h2 className="font-serif font-normal text-[#2D1A11] text-2xl lg:text-3xl mb-4 leading-snug">
                  Desain <span className="italic font-medium text-[#C5A059]">Ramping</span>
                </h2>
                
                <p className="font-serif font-medium text-4xl text-[#2D1A11] mb-8">
                  -20%
                </p>
                
                <a
                  href="#"
                  className="inline-flex items-center justify-center font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-[#F8F3E9] rounded-full bg-[#2D1A11] py-3.5 px-8 ease-out duration-300 hover:bg-[#C5A059] hover:text-[#2D1A11] shadow-md border border-transparent hover:border-[#C5A059]"
                >
                  Ambil Sekarang
                </a>
              </div>
            </div>

            {/* ================= 3. KARTU PROMO TAS TRAVEL - Cokelat Medium Mewah ================= */}
            <div className="relative z-1 overflow-hidden rounded-3xl bg-[#6B442A] py-12 xl:py-16 px-6 sm:px-10 border border-[#C5A059]/30 shadow-lg group">
              
              {/* Hiasan Gunungan di Sudut Kartu */}
              <div 
                className="absolute left-[-10%] top-[-10%] w-[300px] h-[300px] pointer-events-none z-0 opacity-[0.1] mix-blend-screen grayscale contrast-125"
                style={{ 
                  backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
                  backgroundSize: 'contain', 
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left top'
                }}
              ></div>

              <Image
                src="/images/promo/promo-03.png"
                alt="leather travel bag promo"
                className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 z-1 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-700"
                width={240}
                height={240}
              />

              <div className="relative z-10 max-w-[60%]">
                <span className="block font-sans font-bold tracking-[0.2em] text-[#E5D7C1] text-[10px] uppercase mb-3">
                  Teman Perjalanan
                </span>

                <h2 className="font-serif font-normal text-[#F8F3E9] text-2xl lg:text-3xl mb-6 leading-snug">
                  Hemat Hingga <span className="font-medium text-[#C5A059] italic">40%</span> 
                </h2>

                <p className="max-w-[285px] font-sans text-[#E5D7C1] text-xs leading-relaxed mb-10">
                  Kapasitas luas untuk perjalanan akhir pekan Anda dengan material kulit asli premium tahan cuaca.
                </p>

                <a
                  href="#"
                  className="inline-flex items-center justify-center font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-[#2D1A11] rounded-full bg-[#C5A059] py-3.5 px-8 ease-out duration-300 hover:bg-[#F8F3E9] shadow-md border border-transparent hover:border-[#C5A059]"
                >
                  Pesan Sekarang
                </a>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;