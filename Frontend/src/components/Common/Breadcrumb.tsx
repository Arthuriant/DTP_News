import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="relative overflow-hidden bg-[#Fdfbf7] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.03)] pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px] antialiased">
      
      {/* Efek Glow Emas Tipis di Latar Belakang */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/[0.03] to-transparent pointer-events-none"></div>

      {/* Border atas diubah jadi warna krem/emas tipis */}
      <div className="border-t border-[#E5D7C1]/60 relative z-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-8 xl:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            
            {/* Judul Halaman (Font Serif Cokelat Tua) */}
            <h1 className="font-serif font-medium text-[#2D1A11] text-3xl sm:text-4xl tracking-wide drop-shadow-sm">
              {title}
            </h1>

            {/* Breadcrumb Links (Font Sans, Uppercase, Tracking Wide) */}
            <ul className="flex items-center gap-2 font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
              <li className="text-[#6B442A] hover:text-[#C5A059] transition-colors duration-300">
                <Link href="/">
                  Beranda <span className="text-[#C5A059]/50 font-light text-sm mx-1">/</span>
                </Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li 
                    className="text-[#6B442A] last:text-[#C5A059] transition-colors duration-300" 
                    key={key}
                  >
                    {page} 
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;