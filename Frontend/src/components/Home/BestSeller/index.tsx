"use client";
import React from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import shopData from "@/components/Shop/shopData";

const BestSeller = () => {
  return (
    <section className="relative overflow-hidden bg-[#F8F3E9] py-16 lg:py-24">
      
      {/* ================= ORNAMEN BACKGROUND MEWAH ================= */}
      
      {/* Siluet Gunungan Pudar di Kanan */}
      <div 
        className="absolute right-[-10%] top-[10%] w-[600px] h-[800px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top'
        }}
      ></div>

      {/* Siluet Wayang Pudar di Kiri */}
      <div 
        className="absolute left-[-5%] bottom-0 w-[400px] h-[700px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom'
        }}
      ></div>

      {/* Glow Emas Halus di Tengah (Pencahayaan dramatis di belakang judul) */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C5A059] blur-[120px] opacity-[0.15] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 relative z-10">
        
        {/* */}
        <div className="mb-16 flex flex-col items-center justify-center text-center relative z-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]"></div>
            <span className="flex items-center gap-3 font-sans font-bold tracking-[0.3em] text-[#C5A059] text-[10px] uppercase">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={14}
                height={14}
                className="opacity-80 drop-shadow-sm"
              />
              Sorotan Bulan Ini
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]"></div>
          </div>
          
          <h2 className="font-serif font-light text-4xl lg:text-5xl text-[#2D1A11] uppercase tracking-[0.15em] drop-shadow-sm">
            Mahakarya <span className="text-[#C5A059] font-medium italic">Terlaris</span>
          </h2>
        </div>

        {/* */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 relative z-10">
          {/* */}
          {shopData.slice(1, 7).map((item, key) => (
            <div key={key} className="relative group transition-transform duration-500 hover:-translate-y-2">
              {/* Efek Glow Aura Emas di belakang kartu produk saat di-hover */}
              <div className="absolute inset-[-10px] bg-gradient-to-b from-[#C5A059]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none -z-10"></div>
              
              <SingleItem item={item} />
            </div>
          ))}
        </div>

        {/* */}
        <div className="text-center mt-20 relative z-10">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex items-center justify-center font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-[#F8F3E9] rounded-full bg-[#2D1A11] border border-[#C5A059]/40 py-4 px-12 ease-out duration-300 hover:bg-[#C5A059] hover:text-[#2D1A11] hover:border-transparent shadow-[0_10px_20px_rgba(45,26,17,0.15)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.3)] transition-all"
          >
            Lihat Semua Koleksi
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BestSeller;