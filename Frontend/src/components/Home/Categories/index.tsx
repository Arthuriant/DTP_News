"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import data from "./categoryData";
import Image from "next/image";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Categories = () => {
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F8F3E9] pt-20 pb-10" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
      
      {/* ================= ORNAMEN BACKGROUND (SILUET GUNUNGAN) ================= */}
      {/* Siluet Gunungan besar di tengah, tanpa batik */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none z-0 opacity-[0.05] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-16 border-b border-[#C5A059]/20 relative z-10">
        <div className="swiper categories-carousel common-carousel">
          
          {/* */}
          <div className="mb-14 flex items-end justify-between border-b border-[#C5A059]/30 pb-6 relative">
            
            {/* Garis Emas Bawah Judul (Aksen) */}
            <div className="absolute -bottom-[1px] left-0 w-32 h-[2px] bg-[#C5A059]"></div>

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-3 font-sans text-[10px] tracking-[0.3em] font-bold uppercase text-[#C5A059]">
                {/* Ikon Diamond Emas */}
                <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.8)]"></div>
                Koleksi Mahakarya
              </span>
              <h2 className="font-normal text-3xl md:text-4xl text-[#2D1A11] tracking-wide">
                Jelajahi <span className="font-bold text-[#C5A059]">Kategori</span>
              </h2>
            </div>

            {/* --- TOMBOL NAVIGASI (NEXT/PREV) MEWAH --- */}
            <div className="flex items-center gap-3 pb-2">
              
              {/* Tombol Previous */}
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#C5A059]/50 text-[#C5A059] bg-transparent hover:bg-[#C5A059] hover:text-white hover:shadow-[0_5px_15px_rgba(197,160,89,0.4)] transition-all duration-300"
              >
                <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z" />
                </svg>
              </button>

              {/* Tombol Next */}
              <button 
                onClick={handleNext} 
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#C5A059]/50 text-[#C5A059] bg-transparent hover:bg-[#C5A059] hover:text-white hover:shadow-[0_5px_15px_rgba(197,160,89,0.4)] transition-all duration-300"
              >
                <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z" />
                </svg>
              </button>

            </div>
          </div>

          {/* */}
          <Swiper
            ref={sliderRef}
            slidesPerView={6}
            spaceBetween={20} // Menambahkan jarak antar item kategori agar lebih elegan
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1000: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
            }}
          >
            {data.map((item, key) => (
              <SwiperSlide key={key} className="pb-4 pt-2">
                <SingleItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;