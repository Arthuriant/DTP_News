"use client";
import React, { useState } from 'react';

export default function Pengrajin() {
  const [pengrajin, setPengrajin] = useState([
    { id: 1, nama: "Bapak Budi", keahlian: "Tote Bag", status: "Tersedia" },
    { id: 2, nama: "Mas Andi", keahlian: "Sling Bag", status: "Penuh" },
  ]);

  const toggleStatus = (id: number) => {
    setPengrajin(pengrajin.map(p => p.id === id ? { ...p, status: p.status === 'Tersedia' ? 'Penuh' : 'Tersedia' } : p));
  };

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-slate-700">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold text-slate-800">Mitra Pengrajin</h1>
        <button onClick={() => setPengrajin([...pengrajin, { id: Date.now(), nama: "Pengrajin Baru", keahlian: "All", status: "Tersedia" }])} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-200 hover:-translate-y-1 transition-all">
          + Tambah Mitra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pengrajin.map(p => (
          <div key={p.id} className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 p-6 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-200">{p.nama.charAt(0)}</div>
             <h3 className="font-bold text-xl text-slate-800">{p.nama}</h3>
             <p className="text-blue-500 text-sm font-medium mb-4">{p.keahlian}</p>
             <button onClick={() => toggleStatus(p.id)} className={`w-full py-2.5 rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md ${p.status === 'Tersedia' ? 'bg-white text-green-500 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
               Status: {p.status}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}