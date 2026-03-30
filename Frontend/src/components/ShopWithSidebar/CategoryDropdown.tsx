"use client";

import { useState } from "react";

const CategoryItem = ({ category }) => {
  const [selected, setSelected] = useState(category.isRefined || false); // Membaca state awal dari data jika ada
  
  return (
    <button
      className={`group flex w-full items-center justify-between ease-out duration-300 py-1 ${
        selected ? "text-[#C5A059]" : "text-[#6B442A] hover:text-[#C5A059]"
      }`}
      onClick={() => setSelected(!selected)}
    >
      <div className="flex items-center gap-3">
        {/* Custom Premium Checkbox */}
        <div
          className={`cursor-pointer flex items-center justify-center rounded-[4px] w-[18px] h-[18px] border transition-all duration-300 ${
            selected 
              ? "border-[#C5A059] bg-[#C5A059]" 
              : "bg-transparent border-[#E5D7C1] group-hover:border-[#C5A059]"
          }`}
        >
          <svg
            className={`transition-opacity duration-200 ${selected ? "opacity-100" : "opacity-0"}`}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="#2D1A11" /* Centang warna cokelat gelap agar kontras dengan kotak emas */
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="font-sans font-medium text-[15px] tracking-wide">{category.name}</span>
      </div>

      {/* Badge Jumlah Produk */}
      <span
        className={`inline-flex items-center justify-center min-w-[28px] h-6 rounded-full text-[10px] font-bold tracking-wider px-2 ease-out duration-300 border ${
          selected 
            ? "text-[#F8F3E9] bg-[#C5A059] border-[#C5A059]" 
            : "text-[#6B442A]/60 bg-transparent border-[#E5D7C1] group-hover:text-[#C5A059] group-hover:border-[#C5A059]"
        }`}
      >
        {category.products}
      </span>
    </button>
  );
};

const CategoryDropdown = ({ categories }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-[#Fdfbf7] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.06)] border border-[#E5D7C1]/50 rounded-[1.25rem] overflow-hidden relative group/dropdown">
      
      {/* Inner Frame */}
      <div className="absolute inset-1 border border-[#E5D7C1]/30 rounded-xl pointer-events-none z-10 transition-colors duration-500 group-hover/dropdown:border-[#C5A059]/20"></div>

      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-4 pl-6 pr-5 relative z-20 transition-all duration-300 ${
          toggleDropdown ? "border-b border-[#E5D7C1]/40 bg-[#Fdfbf7]" : "bg-[#Fdfbf7]"
        }`}
      >
        <p className="font-serif font-medium text-lg text-[#2D1A11]">Kategori Produk</p>
        
        {/* Panah Dropdown */}
        <button
          aria-label="button for category dropdown"
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

      {/* Dropdown Menu Content */}
      <div
        className={`flex-col gap-3.5 py-6 pl-6 pr-5 relative z-20 transition-all duration-500 origin-top overflow-hidden ${
          toggleDropdown ? "flex max-h-[500px] opacity-100" : "hidden max-h-0 opacity-0"
        }`}
      >
        {categories.map((category, key) => (
          <CategoryItem key={key} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;