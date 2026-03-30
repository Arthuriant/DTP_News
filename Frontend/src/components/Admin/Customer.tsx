"use client";
import React, { useState } from 'react';

export default function Customer() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([
    { id: 1, nama: "Charly Dues", email: "charly@mail.com", pesanan: 3, status: "Aktif" },
    { id: 2, nama: "Rina Ananda", email: "rina@mail.com", pesanan: 1, status: "Aktif" },
  ]);

  const toggleStatus = (id: number) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, status: c.status === 'Aktif' ? 'Suspend' : 'Aktif' } : c));
  };

  const filtered = customers.filter(c => c.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-slate-700">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold text-slate-800">Data Customer</h1>
        <input type="text" placeholder="Cari nama..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-72" />
      </div>

      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 p-8">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-slate-400 border-b border-white/50">
             <tr><th className="pb-4">Nama</th><th className="pb-4">Email</th><th className="pb-4">Total Pesanan</th><th className="pb-4 text-center">Status</th><th className="pb-4 text-center">Aksi</th></tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-white/40 transition">
                <td className="py-4 font-bold text-slate-800">{c.nama}</td><td className="py-4">{c.email}</td><td className="py-4 font-bold text-blue-500">{c.pesanan} Tas</td>
                <td className="py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'Aktif' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{c.status}</span></td>
                <td className="py-4 text-center">
                  <button onClick={() => toggleStatus(c.id)} className="bg-white shadow-sm px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:shadow-md transition">
                    {c.status === 'Aktif' ? 'Suspend' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}