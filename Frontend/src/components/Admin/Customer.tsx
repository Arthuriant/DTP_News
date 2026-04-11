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
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <p className="text-[#C5A059] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Manajemen Data</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2D1A11]">Direktori Pelanggan</h1>
          <p className="text-gray-500 font-sans text-sm mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span>
            Daftar lengkap mitra dan pelanggan setia UpToYou
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-[#C5A059]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Cari pelanggan..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="bg-white/80 backdrop-blur-md border border-gray-100 text-[#2D1A11] pl-12 pr-6 py-4 rounded-full shadow-[0_5px_15px_rgba(45,26,17,0.03)] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] w-full transition-all font-sans text-sm placeholder:text-gray-400 group-hover:shadow-[0_8px_20px_rgba(197,160,89,0.1)]"
          />
        </div>
      </div>

      {/* ================= MAIN DATA SECTION ================= */}
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

        <div className="overflow-x-auto px-2">
          <table className="w-full text-sm whitespace-nowrap relative z-10 font-sans border-separate" style={{ borderSpacing: '0 16px' }}>
            
            {/* ================= TABLE HEADER MEWAH ================= */}
            <thead className="text-[#C5A059] uppercase text-[11px] font-bold tracking-[0.25em] shadow-xl">
               <tr>
                 <th 
                    className="py-5 pl-8 pr-4 text-left rounded-l-2xl w-[30%]"
                    style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.94), rgba(45, 26, 17, 0.94)), url('${brownBatikUrl}')`, backgroundSize: '250px' }}
                 >
                    Profil Pelanggan
                 </th>
                 <th 
                    className="py-5 px-4 text-left w-[20%]"
                    style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.94), rgba(45, 26, 17, 0.94)), url('${brownBatikUrl}')`, backgroundSize: '250px' }}
                 >
                    Kontak Utama
                 </th>
                 <th 
                    className="py-5 px-4 text-center w-[15%]"
                    style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.94), rgba(45, 26, 17, 0.94)), url('${brownBatikUrl}')`, backgroundSize: '250px' }}
                 >
                    Total Pesanan
                 </th>
                 <th 
                    className="py-5 px-4 text-center w-[15%]"
                    style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.94), rgba(45, 26, 17, 0.94)), url('${brownBatikUrl}')`, backgroundSize: '250px' }}
                 >
                    Pendaftaran
                 </th>
                 <th 
                    className="py-5 px-4 text-center w-[10%]"
                    style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.94), rgba(45, 26, 17, 0.94)), url('${brownBatikUrl}')`, backgroundSize: '250px' }}
                 >
                    Status
                 </th>
                 <th 
                    className="py-5 pr-8 pl-4 text-right rounded-r-2xl w-[10%]"
                    style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.94), rgba(45, 26, 17, 0.94)), url('${brownBatikUrl}')`, backgroundSize: '250px' }}
                 >
                    Kelola Data
                 </th>
               </tr>
            </thead>
            
            {/* ================= TABLE BODY ================= */}
            <tbody>
              {filtered.length > 0 ? filtered.map((c) => (
                <tr key={c.id} className="group transition-all duration-300 hover:-translate-y-1">

                  <td className="py-4 pl-8 pr-4 text-left bg-white rounded-l-2xl shadow-[0_5px_20px_rgba(45,26,17,0.03)] group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.1)] transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-[#F8F3E9] border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold shadow-inner shrink-0">
                        {c.nama.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[#2D1A11] text-base block truncate max-w-[200px] xl:max-w-[250px]">{c.nama}</span>
                        <span className="text-gray-400 text-[10px] font-bold tracking-widest mt-0.5 block uppercase">ID: UTS-{String(c.id).padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 text-left bg-white text-gray-500 font-medium shadow-[0_5px_20px_rgba(45,26,17,0.03)] group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.1)] transition-shadow">
                    {c.email}
                  </td>

                  <td className="py-4 px-4 text-center bg-white shadow-[0_5px_20px_rgba(45,26,17,0.03)] group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.1)] transition-shadow">
                      <span className="font-black text-[#C5A059] text-lg bg-[#C5A059]/5 px-4 py-1.5 rounded-lg border border-[#C5A059]/10">
                        {c.pesanan}
                      </span>
                  </td>

                  <td className="py-4 px-4 text-center bg-white text-gray-400 font-medium shadow-[0_5px_20px_rgba(45,26,17,0.03)] group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.1)] transition-shadow">
                    {c.joined || "-"}
                  </td>
                  
                  <td className="py-4 px-4 text-center bg-white shadow-[0_5px_20px_rgba(45,26,17,0.03)] group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.1)] transition-shadow">
                      <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border ${
                        c.status === 'Aktif' 
                          ? 'bg-green-50/50 text-green-600 border-green-200' 
                          : 'bg-red-50/50 text-red-500 border-red-100'
                      }`}>
                          {c.status === 'Aktif' ? (
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                          )}
                          {c.status}
                      </div>
                  </td>

                  <td className="py-4 pr-8 pl-4 text-right bg-white rounded-r-2xl shadow-[0_5px_20px_rgba(45,26,17,0.03)] group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.1)] transition-shadow">
                    <button 
                      onClick={() => toggleStatus(c.id)} 
                      className={`ml-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 w-[110px] ${
                          c.status === 'Aktif' 
                            ? 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50' 
                            : 'bg-[#C5A059] border border-[#C5A059] text-white hover:bg-[#a88647] hover:shadow-lg hover:shadow-[#C5A059]/20'
                        }`}
                    >
                      {c.status === 'Aktif' ? 'Bekukan' : 'Pulihkan'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center bg-white rounded-3xl shadow-sm border border-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl mb-4 opacity-40">𓍯</span>
                      <p className="text-[#2D1A11] font-bold text-xl font-serif">Tidak Ada Data Pelanggan</p>
                      <p className="text-gray-400 mt-2 font-sans text-sm">Coba sesuaikan kata kunci pencarian Anda.</p>
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