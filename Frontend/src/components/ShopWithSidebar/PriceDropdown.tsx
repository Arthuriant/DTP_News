"use client";
import { useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const PriceDropdown = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const [selectedPrice, setSelectedPrice] = useState({
    from: 0,
    to: 1000000, 
  });

  return (
    <>
      {/* Custom CSS untuk Memaksa Slider Menjadi Emas & Cokelat */}
      <style jsx global>{`
        /* Warna Jalur Aktif (Tengah) */
        #range-slider-gradient .range-slider__range {
          background: #C5A059 !important; 
        }
        
        /* Warna Jalur Pasif (Background) */
        #range-slider-gradient .range-slider__track {
          background: #E5D7C1 !important;
        }

        /* Warna Bulatan Pegangan (Thumb) - DIUBAH JADI COKELAT GELAP */
        #range-slider-gradient .range-slider__thumb {
          background: #2D1A11 !important; 
          background-color: #2D1A11 !important; /* Force background */
          border: 3px solid #C5A059 !important; /* Border Emas sedikit ditebalkan */
          box-shadow: 0 2px 5px rgba(45,26,17,0.3) !important; /* Efek shadow mewah */
        }

        /* Mematikan efek biru bawaan jika ada pseudo-element */
        #range-slider-gradient .range-slider__thumb::before,
        #range-slider-gradient .range-slider__thumb::after {
          background: #2D1A11 !important;
        }
      `}</style>

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
          <p className="font-serif font-medium text-lg text-[#2D1A11]">Harga</p>
          
          {/* Panah Dropdown */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToggleDropdown(!toggleDropdown);
            }}
            id="price-dropdown-btn"
            aria-label="tombol untuk dropdown harga"
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

        {/* Content Dropdown */}
        <div 
          className={`relative z-20 transition-all duration-500 origin-top overflow-hidden ${
            toggleDropdown ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6">
            <div id="pricingOne">
              <div className="price-range">
                
                {/* Range Slider */}
                <RangeSlider
                  id="range-slider-gradient"
                  className="margin-lg mb-8"
                  step={'any'}
                  min={0}
                  max={1000000}
                  defaultValue={[0, 1000000]}
                  onInput={(e: any) =>
                    setSelectedPrice({
                      from: Math.floor(e[0]),
                      to: Math.ceil(e[1]),
                    })
                  }
                />

                {/* Indikator Angka Harga */}
                <div className="price-amount flex items-center justify-between gap-4">
                  
                  {/* Kotak Harga MIN */}
                  <div className="flex w-full items-center rounded-lg border border-[#E5D7C1] bg-white overflow-hidden shadow-sm transition-colors duration-300 hover:border-[#C5A059]">
                    <span className="flex items-center justify-center bg-[#F8F3E9] text-[#C5A059] font-sans font-bold text-[10px] tracking-widest px-3 py-2.5 border-r border-[#E5D7C1]">
                      Rp
                    </span>
                    <span id="minAmount" className="block px-3 py-2.5 font-sans font-medium text-xs text-[#2D1A11] w-full text-center">
                      {selectedPrice.from.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Garis Pemisah (Strip) */}
                  <div className="w-3 h-[2px] bg-[#E5D7C1] rounded-full flex-shrink-0"></div>

                  {/* Kotak Harga MAX */}
                  <div className="flex w-full items-center rounded-lg border border-[#E5D7C1] bg-white overflow-hidden shadow-sm transition-colors duration-300 hover:border-[#C5A059]">
                    <span className="flex items-center justify-center bg-[#F8F3E9] text-[#C5A059] font-sans font-bold text-[10px] tracking-widest px-3 py-2.5 border-r border-[#E5D7C1]">
                      Rp
                    </span>
                    <span id="maxAmount" className="block px-3 py-2.5 font-sans font-medium text-xs text-[#2D1A11] w-full text-center">
                      {selectedPrice.to.toLocaleString("id-ID")}
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceDropdown;