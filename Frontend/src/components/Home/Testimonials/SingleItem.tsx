"use client";
import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="relative group h-full flex flex-col p-2">
      
      {/* Efek Glow Aura Emas di belakang kartu saat di-hover (Murni dekorasi) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/15 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[2rem] pointer-events-none -z-10"></div>
      
      {/* Container Utama Kartu */}
      <div className="relative flex flex-col h-full bg-white rounded-[2rem] py-8 px-6 sm:px-10 border border-[#E5D7C1]/50 shadow-[0_15px_40px_-10px_rgba(45,26,17,0.06)] group-hover:shadow-[0_20px_60px_-15px_rgba(197,160,89,0.25)] group-hover:border-[#C5A059]/40 transition-all duration-700 overflow-hidden">
        
        {/* Bingkai Dalam Ala Lukisan (Inner Frame) */}
        <div className="absolute inset-2 border border-[#E5D7C1]/30 rounded-[1.5rem] pointer-events-none z-0 transition-colors duration-[800ms] group-hover:border-[#C5A059]/20"></div>

        {/* Deretan Bintang */}
        <div className="flex items-center gap-1.5 mb-6 relative z-10">
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} className="opacity-90" />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} className="opacity-90" />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} className="opacity-90" />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} className="opacity-90" />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} className="opacity-90" />
        </div>

        {/* Teks Ulasan */}
        <p className="flex-grow font-sans font-light text-sm sm:text-base text-[#6B442A] leading-relaxed tracking-wide mb-8 relative z-10 italic">
          "{testimonial.review}"
        </p>

        {/* Garis Pembatas Halus */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mb-6 relative z-10"></div>

        {/* Profil Penulis */}
        <a href="#" className="flex items-center gap-4 relative z-10 group/author">
          {/* Avatar Container */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#F8F3E9] group-hover:border-[#C5A059] shadow-sm transition-colors duration-500 flex-shrink-0">
            <Image
              src={testimonial.authorImg}
              alt="author"
              className="object-cover w-full h-full"
              width={56}
              height={56}
            />
          </div>

          <div>
            <h3 className="font-serif font-medium text-lg text-[#2D1A11] leading-tight group-hover/author:text-[#C5A059] transition-colors duration-300">
              {testimonial.authorName}
            </h3>
            <p className="font-sans font-bold text-[9px] tracking-[0.2em] uppercase text-[#C5A059] mt-1.5">
              {testimonial.authorRole}
            </p>
          </div>
        </a>

      </div>
    </div>
  );
};

export default SingleItem;