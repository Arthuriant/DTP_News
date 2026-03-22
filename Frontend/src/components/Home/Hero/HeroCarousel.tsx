"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3500, // Dibuat sedikit lebih lama agar transisi terasa lebih elegan
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              {/* Warna Emas & Font Serif untuk Angka Diskon */}
              <span className="block font-serif font-medium text-5xl sm:text-6xl text-[#C5A059]">
                30%
              </span>
              <span className="block text-[#6B442A] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">
                Potongan<br />Harga
              </span>
            </div>

            {/* Judul menggunakan Font Serif & Warna Cokelat Tua */}
            <h1 className="font-serif font-normal text-[#2D1A11] text-2xl sm:text-3xl mb-4 leading-snug">
              <a href="#" className="hover:text-[#C5A059] transition-colors">Tas Selempang Kulit Buatan Tangan Premium</a>
            </h1>

            <p className="text-[#6B442A] text-sm leading-relaxed mb-8">
             Rasakan perpaduan sempurna antara kemewahan dan daya tahan dengan koleksi kulit asli berkualitas tinggi 100% kami.
            </p>

            {/* Tombol Oval Mewah */}
            <a
              href="#"
              className="inline-flex font-bold text-[10px] tracking-[0.2em] uppercase text-[#F8F3E9] rounded-full bg-[#2D1A11] py-3.5 px-8 ease-out duration-300 hover:bg-[#C5A059] hover:text-[#2D1A11] shadow-lg border border-transparent hover:border-[#C5A059]"
            >
              Belanja Sekarang
            </a>
          </div>

          <div className="flex-1 flex justify-center items-center relative">
            {/* Efek Cahaya Halus di Belakang Tas */}
            <div className="absolute inset-0 bg-[#C5A059] blur-[60px] opacity-20 rounded-full w-3/4 h-3/4 m-auto"></div>
            <Image
              src="/images/hero/hero-01.png" // Pastikan ganti file ini dengan gambar tas kulit
              alt="premium leather bag"
              width={351}
              height={358}
              className="relative z-10 drop-shadow-[0_20px_30px_rgba(45,26,17,0.3)]"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-serif font-medium text-5xl sm:text-6xl text-[#C5A059]">
                30%
              </span>
              <span className="block text-[#6B442A] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">
                Potongan<br />Harga
              </span>
            </div>

            <h1 className="font-serif font-normal text-[#2D1A11] text-2xl sm:text-3xl mb-4 leading-snug">
              <a href="#" className="hover:text-[#C5A059] transition-colors">Tas Kerja Klasik dari Kulit Asli</a>
            </h1>

            <p className="text-[#6B442A] text-sm leading-relaxed mb-8">
             Profesional, elegan, dan tak lekang oleh waktu. Tingkatkan gaya perjalanan kerja harian Anda dengan koleksi tas kulit vintage signature kami.
            </p>

            <a
              href="#"
              className="inline-flex font-bold text-[10px] tracking-[0.2em] uppercase text-[#F8F3E9] rounded-full bg-[#2D1A11] py-3.5 px-8 ease-out duration-300 hover:bg-[#C5A059] hover:text-[#2D1A11] shadow-lg border border-transparent hover:border-[#C5A059]"
            >
              Belanja Sekarang
            </a>
          </div>

          <div className="flex-1 flex justify-center items-center relative">
            {/* Efek Cahaya Halus di Belakang Tas */}
            <div className="absolute inset-0 bg-[#C5A059] blur-[60px] opacity-20 rounded-full w-3/4 h-3/4 m-auto"></div>
            <Image
              src="/images/hero/hero-02.png" // Sesuaikan path gambar slide kedua
              alt="vintage leather briefcase"
              width={351}
              height={358}
              className="relative z-10 drop-shadow-[0_20px_30px_rgba(45,26,17,0.3)]"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;