"use client";
import React from "react";

const Newsletter = () => {
  // URL Ornamen Latar Belakang
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  return (
    <section className="overflow-hidden py-10 lg:py-16 antialiased bg-[#F8F3E9]">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-1 overflow-hidden rounded-[2rem] bg-[#2D1A11] shadow-[0_20px_50px_-15px_rgba(45,26,17,0.3)] border border-[#C5A059]/30 group">
          
          {/* ================= ORNAMEN BACKGROUND KARTU ================= */}
          {/* Tekstur Batik Tipis */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.05] mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `url('${brownBatikUrl}')`,
              backgroundSize: '200px',
              backgroundRepeat: 'repeat'
            }}
          ></div>

          {/* Siluet Gunungan Emas Pudar di Kanan */}
          <div 
            className="absolute right-[-10%] top-[-30%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] pointer-events-none z-0 opacity-10 mix-blend-screen grayscale contrast-125 transition-transform duration-1000 group-hover:scale-105"
            style={{ 
              backgroundImage: `url('${gununganUrl}')`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center'
            }}
          ></div>

          {/* Inner Frame Emas Tipis */}
          <div className="absolute inset-2 sm:inset-3 border border-[#C5A059]/15 rounded-[1.5rem] pointer-events-none z-10 transition-colors duration-700 group-hover:border-[#C5A059]/30"></div>

          {/* ================= KONTEN UTAMA ================= */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 px-6 sm:px-10 xl:pl-16 xl:pr-14 py-16 relative z-20">
            
            {/* Bagian Teks */}
            <div className="max-w-[491px] w-full text-center lg:text-left mx-auto lg:mx-0">
              <span className="block font-sans font-bold tracking-[0.3em] text-[#C5A059] text-[10px] uppercase mb-4">
                Akses Eksklusif
              </span>
              <h2 className="max-w-[420px] mx-auto lg:mx-0 text-[#Fdfbf7] font-serif font-light text-3xl sm:text-4xl xl:text-[40px] mb-4 leading-tight drop-shadow-sm">
                Jangan Lewatkan <span className="font-medium text-[#C5A059] italic">Tren & Penawaran</span> Terbaru
              </h2>
              <p className="text-[#E5D7C1]/80 font-sans text-sm leading-relaxed max-w-[400px] mx-auto lg:mx-0">
                Daftar untuk mendapatkan informasi rilis mahakarya terbaru, undangan acara khusus, & kode diskon eksklusif.
              </p>
            </div>

            {/* Bagian Formulir */}
            <div className="max-w-[477px] w-full mx-auto lg:mx-0">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 relative">
                  
                  {/* Input Field Glassmorphism */}
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Masukkan Email Anda"
                    className="w-full h-14 sm:h-16 bg-[#Fdfbf7]/5 border border-[#C5A059]/40 outline-none rounded-full sm:rounded-full placeholder:text-[#E5D7C1]/50 text-[#Fdfbf7] py-3 px-6 sm:pl-8 sm:pr-44 focus:border-[#C5A059] focus:bg-[#Fdfbf7]/10 transition-all duration-300 backdrop-blur-sm font-sans text-sm shadow-inner"
                    required
                  />
                  
                  {/* Tombol Subscribe Mewah */}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center h-14 sm:h-[52px] w-full sm:w-auto sm:absolute sm:right-1.5 sm:top-1.5 py-3 px-8 text-[#2D1A11] bg-[#C5A059] font-sans font-bold text-[10px] tracking-[0.2em] uppercase rounded-full ease-out duration-300 hover:bg-[#Fdfbf7] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:-translate-y-0.5"
                  >
                    Berlangganan
                  </button>

                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;