"use client";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  // URL Batik untuk tekstur kartu promo
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  return (
    <section className="relative overflow-hidden bg-[#F8F3E9] pb-10 lg:pb-16 pt-32 sm:pt-40 lg:pt-48 xl:pt-52" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
      
      {/* ================= ORNAMEN BACKGROUND MEWAH ================= */}
      {/* Siluet Gunungan Pudar di Kanan */}
      <div 
        className="absolute right-[-10%] top-0 w-[600px] h-[800px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top'
        }}
      ></div>
      {/* Siluet Wayang Pudar di Kiri */}
      <div 
        className="absolute left-[-5%] bottom-10 w-[400px] h-[600px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom'
        }}
      ></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 xl:px-0 relative z-10">
        <div className="flex flex-wrap gap-6 lg:gap-8">
          
          {/* ================= BAGIAN KIRI: CAROUSEL UTAMA ================= */}
          <div className="xl:max-w-[750px] w-full">
            {/* Bingkai Ganda Mewah (Double Frame) */}
            <div className="relative z-10 rounded-[2rem] bg-[#2D1A11] p-2 sm:p-3 shadow-[0_20px_50px_rgba(45,26,17,0.15)] border border-[#C5A059]/30 transition-transform duration-700 hover:-translate-y-1">
              <div className="relative rounded-[1.5rem] bg-[#F5EFE6] overflow-hidden border border-[#C5A059]/40 h-full">
                
                {/* Ornamen Shape Bawaan (Diubah opacity agar lebih menyatu) */}
                <Image
                  src="/images/hero/hero-bg.png"
                  alt="hero bg shapes"
                  className="absolute right-0 bottom-0 -z-1 opacity-40 mix-blend-multiply"
                  width={534}
                  height={520}
                />

                {/* Tempat Komponen Carousel Anda */}
                <div className="relative z-20">
                  <HeroCarousel />
                </div>
                
                {/* Garis Siku Emas di Dalam Bingkai Carousel */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]/60 pointer-events-none z-30"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]/60 pointer-events-none z-30"></div>
              </div>
            </div>
          </div>

          {/* ================= BAGIAN KANAN: KARTU PROMO ================= */}
          <div className="xl:flex-1 w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-6">
              
              {/* --- Card 1: Tas Kulit Mewah --- */}
              <div className="w-full relative rounded-[1.5rem] bg-[#2D1A11] p-6 sm:p-8 shadow-lg border border-[#C5A059]/30 overflow-hidden group hover:shadow-[0_20px_40px_-10px_rgba(197,160,89,0.25)] hover:-translate-y-1 transition-all duration-500">
                
                {/* Background Batik Transparan */}
                <div 
                  className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
                  style={{
                    backgroundImage: `url('${brownBatikUrl}')`,
                    backgroundSize: '250px',
                    backgroundRepeat: 'repeat'
                  }}
                ></div>
                
                {/* Aksen Sudut Emas */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#C5A059]/20 to-transparent rounded-tr-[1.5rem]"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#C5A059]/60"></div>

                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    {/* BAGIAN FONT DIUBAH DI SINI: text-[#C5A059] */}
                    <h2 className="max-w-[160px] font-normal text-[#C5A059] text-2xl sm:text-3xl mb-8 leading-snug tracking-wide">
                      <a href="#" className="hover:text-white transition-colors"> Tas Kulit Mewah </a>
                    </h2>

                    <div>
                      {/* BAGIAN FONT DIUBAH DI SINI: text-[#C5A059] */}
                      <p className="font-sans font-semibold tracking-widest text-[#C5A059] text-[10px] uppercase mb-2">
                        Penawaran Terbatas
                      </p>
                      <div className="flex flex-col gap-1">
                        {/* BAGIAN FONT DIUBAH DI SINI: text-[#F8F3E9] */}
                        <span className="font-serif font-medium text-2xl text-[#F8F3E9]">
                          Rp 1.000.000
                        </span>
                        {/* BAGIAN FONT DIUBAH DI SINI: text-[#F8F3E9]/50 */}
                        <span className="font-sans font-medium text-sm text-[#F8F3E9]/50 line-through">
                          Rp 2.000.000
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 relative">
                    {/* Glow di belakang gambar tas */}
                    <div className="absolute inset-0 bg-[#C5A059] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                    <Image
                      src="/images/hero/hero-02.png" 
                      alt="leather tote bag"
                      width={140}
                      height={180}
                      className="object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* --- Card 2: Tas Travel Premium --- */}
              <div className="w-full relative rounded-[1.5rem] bg-[#2D1A11] p-6 sm:p-8 shadow-lg border border-[#C5A059]/30 overflow-hidden group hover:shadow-[0_20px_40px_-10px_rgba(197,160,89,0.25)] hover:-translate-y-1 transition-all duration-500">
                
                {/* Background Batik Transparan */}
                <div 
                  className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
                  style={{
                    backgroundImage: `url('${brownBatikUrl}')`,
                    backgroundSize: '250px',
                    backgroundRepeat: 'repeat'
                  }}
                ></div>

                {/* Aksen Sudut Emas */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#C5A059]/20 to-transparent rounded-tr-[1.5rem]"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#C5A059]/60"></div>

                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    {/* BAGIAN FONT DIUBAH DI SINI: text-[#C5A059] */}
                    <h2 className="max-w-[160px] font-normal text-[#C5A059] text-2xl sm:text-3xl mb-8 leading-snug tracking-wide">
                      <a href="#" className="hover:text-white transition-colors"> Tas Travel Premium </a>
                    </h2>

                    <div>
                      {/* BAGIAN FONT DIUBAH DI SINI: text-[#C5A059] */}
                      <p className="font-sans font-semibold tracking-widest text-[#C5A059] text-[10px] uppercase mb-2">
                        Penawaran Terbatas
                      </p>
                      <div className="flex flex-col gap-1">
                        {/* BAGIAN FONT DIUBAH DI SINI: text-[#F8F3E9] */}
                        <span className="font-serif font-medium text-2xl text-[#F8F3E9]">
                          Rp 1.000.000
                        </span>
                        {/* BAGIAN FONT DIUBAH DI SINI: text-[#F8F3E9]/50 */}
                        <span className="font-sans font-medium text-sm text-[#F8F3E9]/50 line-through">
                          Rp 1.500.000
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 relative">
                    {/* Glow di belakang gambar tas */}
                    <div className="absolute inset-0 bg-[#C5A059] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                    <Image
                      src="/images/hero/hero-01.png" 
                      alt="leather duffel bag"
                      width={140}
                      height={180}
                      className="object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Komponen Bawah Hero */}
      <div className="relative z-20 mt-10 lg:mt-16">
        <HeroFeature />
      </div>

    </section>
  );
};

export default Hero;