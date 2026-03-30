"use client";
import React, { useState, useEffect, useRef } from "react";

const CustomSelect = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const selectRef = useRef(null);

  // Function to close the dropdown when a click occurs outside the component
  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  return (
    <div
      className="custom-select custom-select-2 flex-shrink-0 relative z-50 antialiased"
      ref={selectRef}
    >
      {/* ================= TOMBOL DROPDOWN (KAPSUL MEWAH) ================= */}
      <div
        className={`select-selected whitespace-nowrap flex items-center justify-between gap-4 px-6 py-2.5 rounded-full border cursor-pointer ease-out duration-300 shadow-sm hover:shadow-md transition-all ${
          isOpen 
            ? "bg-[#2D1A11] border-[#2D1A11] text-[#C5A059]" // Saat terbuka (Dark/Gold)
            : "bg-[#Fdfbf7] border-[#E5D7C1] text-[#2D1A11] hover:border-[#C5A059]" // Saat tertutup (Krem/Brown)
        }`}
        onClick={toggleDropdown}
      >
        <span className="font-sans text-sm font-medium tracking-wide">
          {selectedOption.label}
        </span>
        
        {/* Ikon Panah (Mulus berputar) */}
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#C5A059]" : "text-[#6B442A]"}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {/* ================= DAFTAR OPSI (MUNCUL MENGAMBANG) ================= */}
      <div 
        className={`select-items absolute left-0 top-full mt-2 min-w-[220px] w-full bg-[#Fdfbf7] border border-[#E5D7C1]/60 rounded-2xl shadow-[0_15px_30px_-10px_rgba(45,26,17,0.15)] overflow-hidden transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none select-hide"
        }`}
      >
        <div className="flex flex-col py-2">
          {options.slice(1).map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`select-item px-6 py-3 cursor-pointer font-sans text-sm transition-colors duration-200 ${
                selectedOption.value === option.value 
                  ? "bg-[#C5A059]/10 text-[#C5A059] font-semibold same-as-selected" 
                  : "text-[#6B442A] hover:bg-[#F8F3E9] hover:text-[#2D1A11]"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default CustomSelect;