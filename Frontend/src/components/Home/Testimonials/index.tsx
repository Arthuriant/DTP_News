"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import testimonialsData from "./testimonialsData";
import Image from "next/image";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem"; 
// Pastikan komponen SingleItem sudah diupdate ke versi Mewah (background putih, glow emas, icon kutipan, dll)

const Testimonials = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    // @ts-ignore
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    // @ts-ignore
    sliderRef.current.swiper.slideNext();
  }, []);

  // URL Ornamen untuk latar belakang
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";
  const wayangUrl = "https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg";

  return (
    <section className="relative overflow-hidden bg-[#F8F3E9] py-20 lg:py-28 selection:bg-[#C5A059] selection:text-[#F8F3E9]">
      
      {/* ================= ORNAMEN BACKGROUND LUAR ================= */}
      {/* Siluet Gunungan Pudar di Kanan */}
      <div 
        className="absolute right-[-10%] top-[10%] w-[600px] h-[800px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('${gununganUrl}')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center'
        }}
      ></div>

      {/* Siluet Wayang Pudar di Kiri */}
      <div 
        className="absolute left-[-5%] bottom-[-5%] w-[400px] h-[700px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('${wayangUrl}')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center'
        }}
      ></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 relative z-10 antialiased">
        
        {/* Wrapper Swiper dengan padding biar shadow kartu gak kepotong */}
        <div className="swiper testimonial-carousel common-carousel p-4 sm:p-6 -m-4 sm:-m-6">
          
          {/* ================= SECTION HEADER & NAV BUTTONS ================= */}
          <div className="mb-14 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#C5A059]/30">
            
            {/* Title */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="flex items-center gap-3 font-sans font-bold tracking-[0.3em] text-[#C5A059] text-[10px] uppercase mb-3">
                <Image
                  src="/images/icons/icon-08.svg" 
                  alt="icon"
                  width={14}
                  height={14}
                  className="opacity-80 drop-shadow-sm"
                />
                Mahakarya Kami di Mata Mereka
              </span>
              <h2 className="font-serif font-light text-3xl lg:text-4xl text-[#2D1A11] uppercase tracking-[0.1em] drop-shadow-sm">
                Ulasan <span className="text-[#C5A059] font-medium italic">Pelanggan</span> Eksklusif
              </h2>
            </div>

            {/* Premium Navigation Buttons */}
            <div className="flex items-center gap-3 relative z-20">
              
              {/* Prev Button */}
              <button 
                onClick={handlePrev} 
                aria-label="Previous Slide"
                className="flex items-center justify-center w-12 h-10 rounded-full border border-[#C5A059]/60 text-[#C5A059] bg-transparent ease-out duration-300 hover:bg-[#2D1A11] hover:text-[#F8F3E9] hover:border-[#2D1A11] shadow-sm hover:shadow-lg group"
              >
                <svg
                  className="fill-current w-5 h-5 transition-transform group-hover:-translate-x-0.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button 
                onClick={handleNext} 
                aria-label="Next Slide"
                className="flex items-center justify-center w-12 h-10 rounded-full border border-[#C5A059]/60 text-[#C5A059] bg-transparent ease-out duration-300 hover:bg-[#2D1A11] hover:text-[#F8F3E9] hover:border-[#2D1A11] shadow-sm hover:shadow-lg group"
              >
                <svg
                  className="fill-current w-5 h-5 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                  />
                </svg>
              </button>

            </div>
          </div>

          {/* ================= SWIPER CAROUSEL ================= */}
          <Swiper
            ref={sliderRef}
            slidesPerView={3}
            spaceBetween={30} // Spasi dilebarkan agar shadow kartu tidak berdesakan
            grabCursor={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1000: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="!overflow-visible" // Penting: agar efek shadow pada kartu SingleItem (saat dihover) tidak terpotong
          >
            {testimonialsData.map((item, key) => (
              <SwiperSlide key={key} className="h-auto">
                <SingleItem testimonial={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
      </div>
    </section>
  );
};

export default Testimonials;