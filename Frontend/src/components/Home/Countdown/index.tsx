"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const CounDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "December, 31, 2026";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    if (time > 0) {
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  useEffect(() => {
    // @ts-ignore
    const interval = setInterval(() => getTime(deadline), 1000);
    return () => clearInterval(interval);
  }, []);

  // URL Batik untuk tekstur latar dalam kotak
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  return (
    <section className="relative overflow-hidden py-20 bg-[#F8F3E9]">
      
      {/* ================= ORNAMEN BACKGROUND LUAR ================= */}
      {/* Siluet Gunungan Pudar di Kanan */}
      <div 
        className="absolute right-[-5%] top-[-10%] w-[500px] h-[800px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center'
        }}
      ></div>
      {/* Siluet Wayang Pudar di Kiri */}
      <div 
        className="absolute left-[-5%] bottom-[-10%] w-[400px] h-[700px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center'
        }}
      ></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 relative z-10">
        
        {/* Kotak Utama - Dark Mode Mewah */}
        <div className="relative overflow-hidden z-1 rounded-[2rem] bg-[#2D1A11] p-6 sm:p-10 lg:p-14 xl:p-16 shadow-2xl border border-[#C5A059]/30 group">

          {/* Background Batik Transparan Full Card (Sangat Samar: opacity 3%) */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `url('${brownBatikUrl}')`,
              backgroundSize: '250px',
              backgroundRepeat: 'repeat'
            }}
          ></div>

          {/* Aksen Sudut Emas */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C5A059]/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#C5A059]/40 pointer-events-none"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#C5A059]/40 pointer-events-none"></div>

          <div className="max-w-[500px] w-full relative z-10">
            <span className="block font-sans font-bold tracking-[0.3em] text-[#C5A059] text-[10px] uppercase mb-4">
              Penawaran Terbatas
            </span>

            <h2 className="font-serif font-normal text-[#F8F3E9] text-3xl lg:text-4xl xl:text-5xl mb-5 leading-tight">
              Sempurnakan Penampilan Anda dengan Produk Kulit Premium
            </h2>

            <p className="font-sans text-[#E5D7C1] text-sm leading-relaxed mb-8">
              Tas kulit buatan tangan kami dirancang untuk ketahanan dan keanggunan. Pesan sekarang sebelum kehabisan mahakarya eksklusif ini.
            </p>

            {/* Area Countdown Timer */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
              
              <div className="flex flex-col items-center">
                <span className="w-16 h-16 sm:w-[72px] sm:h-[72px] font-serif font-medium text-2xl sm:text-3xl text-[#2D1A11] rounded-2xl flex items-center justify-center bg-[#F8F3E9] shadow-[inset_0_0_15px_rgba(197,160,89,0.2)] border border-[#C5A059]/40 mb-3">
                  {days < 10 ? "0" + days : days}
                </span>
                <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Hari</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="w-16 h-16 sm:w-[72px] sm:h-[72px] font-serif font-medium text-2xl sm:text-3xl text-[#2D1A11] rounded-2xl flex items-center justify-center bg-[#F8F3E9] shadow-[inset_0_0_15px_rgba(197,160,89,0.2)] border border-[#C5A059]/40 mb-3">
                  {hours < 10 ? "0" + hours : hours}
                </span>
                <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Jam</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="w-16 h-16 sm:w-[72px] sm:h-[72px] font-serif font-medium text-2xl sm:text-3xl text-[#2D1A11] rounded-2xl flex items-center justify-center bg-[#F8F3E9] shadow-[inset_0_0_15px_rgba(197,160,89,0.2)] border border-[#C5A059]/40 mb-3">
                  {minutes < 10 ? "0" + minutes : minutes}
                </span>
                <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Menit</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="w-16 h-16 sm:w-[72px] sm:h-[72px] font-serif font-medium text-2xl sm:text-3xl text-[#2D1A11] rounded-2xl flex items-center justify-center bg-[#F8F3E9] shadow-[inset_0_0_15px_rgba(197,160,89,0.2)] border border-[#C5A059]/40 mb-3">
                  {seconds < 10 ? "0" + seconds : seconds}
                </span>
                <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Detik</span>
              </div>

            </div>

            {/* Tombol Mewah */}
            <a
              href="#"
              className="inline-flex font-bold text-[10px] tracking-[0.2em] uppercase text-[#2D1A11] rounded-full bg-[#C5A059] py-4 px-10 ease-out duration-300 hover:bg-[#F8F3E9] shadow-lg border border-transparent hover:border-[#C5A059] mt-10"
            >
              Lihat Sekarang
            </a>
          </div>

          {/* Gambar Ornamen Bawaan (Diubah transparansinya agar membaur) */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="hidden sm:block absolute right-0 bottom-0 -z-1 opacity-[0.15] mix-blend-screen"
            width={737}
            height={482}
          />

          {/* Gambar Produk Tas */}
          <div className="hidden lg:flex absolute right-4 xl:right-16 top-0 bottom-0 items-center justify-center -z-1 w-[450px]">
            {/* Efek Cahaya Halus di Belakang Tas */}
            <div className="absolute bg-[#C5A059] blur-[80px] opacity-[0.15] rounded-full w-[350px] h-[350px] z-0 pointer-events-none"></div>
            
            <Image
              src="/images/countdown/countdown-01.png"
              alt="leather bag product"
              width={411}
              height={376}
              className="object-contain relative z-10 drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default CounDown;