"use client";
import React, { useState } from 'react';

export default function Customer() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([
    { id: 1, nama: "Charly Dues", email: "charly@mail.com", pesanan: 3, status: "Aktif", joined: "20 Okt 2023" },
    { id: 2, nama: "Rina Ananda", email: "rina@mail.com", pesanan: 1, status: "Aktif", joined: "15 Nov 2023" },
    { id: 3, nama: "Budi Santoso", email: "budi.s@mail.com", pesanan: 0, status: "Suspend", joined: "01 Des 2023" },
  ]);

  const toggleStatus = (id: number) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, status: c.status === 'Aktif' ? 'Suspend' : 'Aktif' } : c));
  };

  const filtered = customers.filter(c => c.nama.toLowerCase().includes(search.toLowerCase()));

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";


  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Manajemen Data</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2D1A11]">Direktori Pelanggan</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full shrink-0"></span>
            Daftar lengkap mitra dan pelanggan setia UpToYou.
          </p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-[#D9B35A]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Cari pelanggan..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="bg-white/60 backdrop-blur-xl border border-white/50 text-[#2D1A11] pl-12 pr-6 py-4 rounded-full shadow-[0_5px_15px_rgba(45,26,17,0.05),inner_0_1px_2px_rgba(255,255,255,0.8)] focus:outline-none focus:border-[#D9B35A]/50 focus:ring-1 focus:ring-[#D9B35A]/50 w-full transition-all font-sans text-sm placeholder:text-gray-400 group-hover:shadow-[0_8px_20px_rgba(217,179,90,0.15)]"
          />
        </div>
      </div>

      {/* ================= MAIN DATA SECTION ================= */}
      <div className="relative w-full pb-10 pt-2">
        
        <div 
          className="absolute -right-10 -bottom-10 w-96 h-72 opacity-[0.04] pointer-events-none"
          style={{ 
              backgroundImage: `url('${megaMendungUrl}')`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right bottom'
          }}
        ></div>

        <div className="overflow-x-auto px-4 -mx-4">
          <table className="w-full min-w-[1000px] text-sm whitespace-nowrap relative z-10 font-sans border-separate" style={{ borderSpacing: '0 16px' }}>
            
            {/* ================= TABLE HEADER MEWAH (Coklat Kopi Pekat #2D1A11) ================= */}
            <thead className="text-[#D9B35A] uppercase text-[11px] font-bold tracking-[0.25em] shadow-xl">
               <tr 
                 className="bg-[#2D1A11] shadow-[0_10px_20px_rgba(45,26,17,0.2)]"
                 style={{
                   backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.95), rgba(45, 26, 17, 0.95)), url('${brownBatikUrl}')`,
                   backgroundSize: '250px',
                   backgroundRepeat: 'repeat'
                 }}
               >
                 <th className="py-5 pl-8 pr-4 text-left rounded-l-2xl w-[25%] border-y border-l border-[#D9B35A]/20">Profil Pelanggan</th>
                 <th className="py-5 px-4 text-left w-[20%] border-y border-[#D9B35A]/20">Kontak Utama</th>
                 <th className="py-5 px-4 text-center w-[15%] border-y border-[#D9B35A]/20">Total Pesanan</th>
                 <th className="py-5 px-4 text-center w-[15%] border-y border-[#D9B35A]/20">Pendaftaran</th>
                 <th className="py-5 px-4 text-center w-[10%] border-y border-[#D9B35A]/20">Status</th>
                 <th className="py-5 pr-8 pl-4 text-right rounded-r-2xl w-[15%] border-y border-r border-[#D9B35A]/20">Kelola Data</th>
               </tr>
            </thead>
            
            {/* ================= TABLE BODY (FLOATING CARDS GLOSSY) ================= */}
            <tbody>
              {filtered.length > 0 ? filtered.map((c) => (
                <tr key={c.id} className="group transition-all duration-300 hover:-translate-y-1.5">

                  <td className="py-5 pl-8 pr-4 text-left bg-white/60 backdrop-blur-xl rounded-l-2xl border-y border-l border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-[#FFFDF5] border border-[#D9B35A]/30 flex items-center justify-center text-[#D9B35A] font-bold shadow-[inner_0_2px_4px_rgba(0,0,0,0.05)] shrink-0 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/10 to-transparent"></div>
                         <span className="relative z-10">{c.nama.charAt(0)}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#2D1A11] text-base block truncate max-w-[200px] xl:max-w-[250px]">{c.nama}</span>
                        <span className="text-[#8B7355] text-[10px] font-bold tracking-widest mt-0.5 block uppercase">ID: UTS-{String(c.id).padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-4 text-left bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <span className="text-[#8B7355] font-medium">{c.email}</span>
                  </td>

                  <td className="py-5 px-4 text-center bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                      <span className="font-black text-[#D9B35A] text-lg bg-[#D9B35A]/10 px-4 py-1.5 rounded-lg border border-[#D9B35A]/20 shadow-[inner_0_1px_2px_rgba(255,255,255,0.5)]">
                        {c.pesanan}
                      </span>
                  </td>

                  <td className="py-5 px-4 text-center bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <span className="text-[#8B7355] font-medium">{c.joined || "-"}</span>
                  </td>
                  
                  <td className="py-5 px-4 text-center bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                      <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border shadow-sm ${
                        c.status === 'Aktif' 
                          ? 'bg-emerald-50/80 text-emerald-600 border-emerald-200' 
                          : 'bg-rose-50/80 text-rose-500 border-rose-200'
                      }`}>
                          {c.status === 'Aktif' ? (
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span>
                          )}
                          {c.status}
                      </div>
                  </td>
                  
                  <td className="py-5 pr-8 pl-4 bg-white/60 backdrop-blur-xl rounded-r-2xl border-y border-r border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <div className="flex justify-end items-center">
                      <button 
                        onClick={() => toggleStatus(c.id)} 
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-2 w-[120px] group/btn ${
                            c.status === 'Aktif' 
                              ? 'bg-white border border-gray-200 text-gray-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:shadow-[0_5px_15px_rgba(244,63,94,0.15)]' 
                              : 'bg-gradient-to-r from-[#D9B35A] via-[#EBC17B] to-[#C5A059] border border-[#FFF6C5]/50 text-[#2D1A11] hover:shadow-[0_5px_15px_rgba(217,179,90,0.4)] hover:-translate-y-0.5'
                          }`}
                      >
                        {c.status === 'Aktif' ? (
                          <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                          </svg>
                        )}
                        
                        {c.status === 'Aktif' ? 'Bekukan' : 'Pulihkan'}
                      </button>
                    </div>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] border border-white/40">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl mb-4 opacity-40 text-[#8B7355]">𓍯</span>
                      <p className="text-[#2D1A11] font-bold text-xl font-serif">Tidak Ada Data Pelanggan</p>
                      <p className="text-[#8B7355] mt-2 font-sans text-sm">Coba sesuaikan kata kunci pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}