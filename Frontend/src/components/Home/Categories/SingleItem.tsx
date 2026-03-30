import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <a href="#" className="group flex flex-col items-center">
      
      {/* --- LINGKARAN KATEGORI (LUXURY PODIUM) --- */}
      <div className="max-w-[130px] w-full h-[130px] bg-[#F5EFE6] border border-[#C5A059]/20 rounded-full flex items-center justify-center mb-5 shadow-[0_5px_15px_rgba(45,26,17,0.05)] group-hover:shadow-[0_10px_25px_-5px_rgba(197,160,89,0.3)] group-hover:border-[#C5A059]/50 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
        
        {/* Efek kilau cahaya (glow) halus di dalam lingkaran saat di-hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C5A059]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
        
        <Image 
          src={item.img} 
          alt="Category" 
          width={82} 
          height={62} 
          className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 relative z-10"
        />
      </div>

      {/* --- TEKS JUDUL KATEGORI --- */}
      <div className="flex justify-center">
        <h3 className="inline-block font-serif text-lg tracking-wide font-medium text-center text-[#2D1A11] bg-gradient-to-r from-[#C5A059] to-[#C5A059] bg-[length:0px_1.5px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_1.5px] group-hover:text-[#C5A059]">
          {item.title}
        </h3>
      </div>

    </a>
  );
};

export default SingleItem;