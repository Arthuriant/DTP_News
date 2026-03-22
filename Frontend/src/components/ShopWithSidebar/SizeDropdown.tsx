"use client";
import React, { useState } from "react";

const SizeDropdown = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  
  // State untuk melacak ukuran yang aktif (default: "M")
  const [activeSize, setActiveSize] = useState("M");

  // Daftar ukuran untuk mempermudah perulangan (mapping)
  const sizes = ["M", "L", "XL", "XXL"];

  return (
    <div className="bg-[#Fdfbf7] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.06)] border border-[#E5D7C1]/50 rounded-[1.25rem] overflow-hidden relative group/dropdown">
      
      {/* Inner Frame */}
      <div className="absolute inset-1 border border-[#E5D7C1]/30 rounded-xl pointer-events-none z-10 transition-colors duration-500 group-hover/dropdown:border-[#C5A059]/20"></div>

      {/* Header Dropdown */}
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-4 pl-6 pr-5 relative z-20 transition-all duration-300 ${
          toggleDropdown ? "border-b border-[#E5D7C1]/40 bg-[#Fdfbf7]" : "bg-[#Fdfbf7]"
        }`}
      >
        <p className="font-serif font-medium text-lg text-[#2D1A11]">Ukuran</p>
        
        {/* Panah Dropdown */}
        <button
          aria-label="tombol untuk dropdown ukuran"
          className={`text-[#C5A059] ease-[cubic-bezier(0.25,1,0.5,1)] duration-500 transform ${
            toggleDropdown ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            className="fill-current w-5 h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
            />
          </svg>
        </button>
      </div>

      {/* Area Pilihan Ukuran */}
      <div
        className={`flex-wrap gap-3 py-6 pl-6 pr-5 relative z-20 transition-all duration-500 origin-top overflow-hidden ${
          toggleDropdown ? "flex max-h-[500px] opacity-100" : "hidden max-h-0 opacity-0"
        }`}
      >
        {sizes.map((size) => (
          <label
            key={size}
            htmlFor={`size${size}`}
            className="cursor-pointer select-none"
          >
            <div className="relative">
              <input 
                type="radio" 
                name="size" 
                id={`size${size}`} 
                className="sr-only" 
                onChange={() => setActiveSize(size)}
                checked={activeSize === size}
              />
              
              {/* Kotak Ukuran Mewah */}
              <div 
                className={`flex items-center justify-center min-w-[3rem] h-10 px-4 rounded-lg border transition-all duration-300 ${
                  activeSize === size 
                    ? "bg-[#2D1A11] border-[#2D1A11] text-[#C5A059] shadow-md scale-105" 
                    : "bg-transparent border-[#E5D7C1] text-[#6B442A] hover:border-[#C5A059] hover:text-[#2D1A11]"
                }`}
              >
                <span className="font-sans font-bold text-xs tracking-widest uppercase">
                  {size}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SizeDropdown;