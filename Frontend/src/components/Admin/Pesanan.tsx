"use client";
import React, { useState } from 'react';

export default function Pesanan() {
  const [orders, setOrders] = useState([
    { id: '#TRX-001', cust: 'Siti Sarah', tipe: 'Tote Bag', status: 'Validasi' },
    { id: '#TRX-002', cust: 'Charly', tipe: 'Sling Bag', status: 'Assign' },
    { id: '#TRX-003', cust: 'Macko', tipe: 'Backpack', status: 'Proses' },
  ]);

  const advanceStatus = (id: string, current: string) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        if (current === 'Validasi') return { ...o, status: 'Assign' };
        if (current === 'Assign') return { ...o, status: 'Proses' };
        if (current === 'Proses') return { ...o, status: 'Selesai' };
      }
      return o;
    }));
  };

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-slate-700">
      <h1 className="text-3xl font-bold text-slate-800">Alur Pesanan Custom</h1>

      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 p-8">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-slate-400 border-b border-white/50">
             <tr><th className="pb-4">Invoice</th><th className="pb-4">Customer</th><th className="pb-4">Tipe Tas</th><th className="pb-4 text-center">Status</th><th className="pb-4 text-center">Tindakan Cepat</th></tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-white/40 transition">
                <td className="py-4 font-bold text-blue-500">{o.id}</td><td className="py-4 font-bold text-slate-800">{o.cust}</td><td className="py-4">{o.tipe}</td>
                <td className="py-4 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${o.status === 'Validasi' ? 'bg-orange-100 text-orange-500' : o.status === 'Assign' ? 'bg-cyan-100 text-cyan-500' : o.status === 'Proses' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-4 text-center">
                  {o.status !== 'Selesai' && (
                    <button onClick={() => advanceStatus(o.id, o.status)} className="bg-white border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 transition-all">
                      {o.status === 'Validasi' ? '✔ Validasi Bayar' : o.status === 'Assign' ? '🧑‍🎨 Assign Pengrajin' : '📦 Tandai Selesai'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}