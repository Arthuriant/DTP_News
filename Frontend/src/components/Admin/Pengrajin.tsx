"use client";
import React, { useState } from 'react';

export default function Pengrajin() {
  const [pengrajin, setPengrajin] = useState([
    { id: 1, nama: "Bapak Budi", keahlian: "Kriya Tote Bag", status: "Tersedia", joinDate: "12 Mar 2021" },
    { id: 2, nama: "Mas Andi", keahlian: "Kriya Sling Bag", status: "Penuh", joinDate: "05 Jun 2022" },
    { id: 3, nama: "Ibu Kartini", keahlian: "Kriya Clutch", status: "Tersedia", joinDate: "20 Sep 2023" },
  ]);

  const toggleStatus = (id: number) => {
    setPengrajin(pengrajin.map(p => p.id === id ? { ...p, status: p.status === 'Tersedia' ? 'Penuh' : 'Tersedia' } : p));
  };

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D4AF37]/30 pb-6 px-2">
        <div>
          <p className="text-[#D4AF37] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Kemitraan Eksklusif</p>
          <h1 className="text-4xl font-bold text-[#1F1F1F] tracking-tight">Seniman Kriya</h1>
          <p className="text-gray-600 font-sans text-sm mt-2 flex items-center gap-2 max-w-md">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0"></span>
            Jejaring maestri pengrajin lokal untuk setiap mahakarya UpToYou.
          </p>
        </div>

        <button 
          onClick={() => setPengrajin([...pengrajin, { id: Date.now(), nama: "Seniman Baru", keahlian: "Multi Kriya", status: "Tersedia", joinDate: "Hari Ini" }])} 
          className="group relative bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] hover:shadow-[0_10px_25px_rgba(234,193,53,0.4)] text-[#1A1A1A] px-10 py-4 rounded-full font-serif font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2.5 overflow-hidden shadow-[0_5px_15px_rgba(234,193,53,0.3)] border border-[#FFF6C5]/50"
        >
          <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          
          <span className="relative z-10 flex items-center gap-2.5 tracking-wide text-[15px]">
            <svg className="w-4 h-4 text-[#1A1A1A]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
            </svg>
            Rekrut Seniman
          </span>
        </button>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="relative w-full overflow-hidden pb-10 pt-2">
        
        <div 
          className="absolute -right-10 -bottom-10 w-96 h-72 opacity-[0.04] pointer-events-none"
          style={{ 
              backgroundImage: `url('${megaMendungUrl}')`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right bottom'
          }}
        ></div>

        {/* ================= GRID KARTU PENGRAJIN ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 pt-2 relative z-10">
          {pengrajin.map(p => (
            <div 
              key={p.id} 
              className="group bg-white/50 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-8 shadow-[0_20px_50px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_30px_70px_-10px_rgba(212,175,55,0.25),inner_0_2px_4px_rgba(255,255,255,0.9)] hover:border-[#D4AF37]/40 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>

              <div 
                className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"
                style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
              ></div>

              <div className="absolute top-6 left-6 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#D4AF37]/30 z-0 pointer-events-none transition-colors group-hover:border-[#D4AF37]/60"></div>

              <div className="relative w-20 h-20 mb-6 z-10 mt-2">
                <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#1A100B] via-[#4A3122] to-[#3E2723] flex items-center justify-center text-[#D4AF37] text-3xl font-black shadow-[0_10px_20px_rgba(45,26,17,0.3),inner_0_2px_4px_rgba(255,255,255,0.2)] border border-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-500">
                  {p.nama.charAt(0)}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
                </div>
              </div>

              <h3 className="font-bold text-2xl text-[#1F1F1F] mb-1 z-10 drop-shadow-sm">{p.nama}</h3>
              <p className="text-[#D4AF37] text-xs font-sans font-bold uppercase tracking-widest mb-6 z-10 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 shadow-[inner_0_1px_2px_rgba(255,255,255,0.4)]">
                {p.keahlian}
              </p>

              <div className="w-full border-t border-gray-200/50 pt-4 mb-6 z-10 font-sans flex justify-between px-2">
                <div className="text-left">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Mitra ID</p>
                  <p className="text-xs font-semibold text-gray-600">SM-{String(p.id).padStart(3, '0')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Sejak</p>
                  <p className="text-xs font-semibold text-gray-600">{p.joinDate || "N/A"}</p>
                </div>
              </div>

              <button 
                onClick={() => toggleStatus(p.id)} 
                className={`w-full py-3.5 rounded-2xl text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.05),inner_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center gap-2 z-10 group/btn border
                  ${p.status === 'Tersedia' 
                    ? 'bg-gradient-to-b from-white to-emerald-50/50 text-emerald-600 border-emerald-200 hover:border-emerald-400 hover:shadow-[0_10px_20px_rgba(16,185,129,0.2)]' 
                    : 'bg-gradient-to-b from-white to-rose-50/50 text-rose-600 border-rose-200 hover:border-rose-400 hover:shadow-[0_10px_20px_rgba(244,63,94,0.2)]'
                  }
                `}
              >
                {p.status === 'Tersedia' ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Menerima Karya
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 bg-rose-400 rounded-full shadow-inner"></span>
                    Kapasitas Penuh
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}