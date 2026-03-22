"use client";
import React from "react";
import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Gratis Pengiriman",
    description: "Untuk setiap pembelian minimal Rp2.000.000",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "1 Hari Pengembalian",
    description: "Pembatalan dapat dilakukan dalam waktu 1 hari setelah pemesanan.",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Pembayaran Aman",
    description: "Transaksi dijamin aman dan terenkripsi.",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Dukungan Eksklusif",
    description: "Layanan asisten pribadi siap membantu kapan saja.",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
      {/* Garis pemisah atas tipis dan elegan */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mb-10"></div>
      
      {/* Grid: 1 kolom (HP), 2 kolom (Tablet), 4 kolom (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-10 pb-8">
        {featureData.map((item, key) => (
          <div 
            className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-[#E5D7C1]/20 border border-transparent hover:border-[#C5A059]/20 group" 
            key={key}
          >
            {/* Lingkaran pembungkus ikon dengan aksen emas */}
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-[#F8F3E9] border border-[#C5A059]/40 shadow-sm group-hover:bg-[#2D1A11] transition-colors duration-500">
              <div className="group-hover:brightness-0 group-hover:invert transition-all duration-500">
                <Image src={item.img} alt={item.title} width={26} height={26} className="object-contain" />
              </div>
            </div>

            <div className="pt-1">
              <h3 className="font-serif font-semibold text-lg text-[#2D1A11] mb-1 leading-tight group-hover:text-[#C5A059] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-[#6B442A] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;