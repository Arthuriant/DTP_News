"use client";
import React, { useState } from "react";

const ColorsDropdwon = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [activeColor, setActiveColor] = useState("blue");

  // Nilai ini dibiarkan dalam bahasa Inggris karena digunakan langsung untuk CSS background/border color
  const colors = ["red", "blue", "orange", "pink", "purple"];

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
        <p className="font-serif font-medium text-lg text-[#2D1A11]">Warna</p>
        
        {/* Panah Dropdown */}
        <button
          aria-label="tombol untuk dropdown warna"
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

      {/* Area Pilihan Warna */}
      <div
        className={`flex-wrap gap-3 py-6 pl-6 pr-5 relative z-20 transition-all duration-500 origin-top overflow-hidden ${
          toggleDropdown ? "flex max-h-[500px] opacity-100" : "hidden max-h-0 opacity-0"
        }`}
      >
        {colors.map((color, key) => (
          <label
            key={key}
            htmlFor={color}
            className="cursor-pointer select-none flex items-center group/color"
          >
            <div className="relative">
              <input
                type="radio"
                name="color"
                id={color}
                className="sr-only"
                onChange={() => setActiveColor(color)}
                checked={activeColor === color}
              />
              
              {/* Outer Ring (Cincin Emas Mewah) */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  activeColor === color 
                    ? "border-[#C5A059] shadow-sm scale-110" 
                    : "border-transparent group-hover/color:border-[#E5D7C1]"
                }`}
              >
                {/* Inner Color Dot */}
                <span
                  className="block w-5 h-5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300"
                  style={{ backgroundColor: `${color}` }}
                ></span>
              </div>

            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorsDropdwon;