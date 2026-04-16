"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CustomerService } from '@/services/CustomerService';

const CustomerMap = dynamic(() => import("./CustomerMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100 animate-pulse text-slate-400">Memuat Peta Persebaran...</div>
});

export default function Customer() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Detail Card
  const [selectedData, setSelectedData] = useState<{customer: any, address: any} | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await CustomerService.getCustomers();
      setCustomers(data);
    } catch (error: any) {
      console.error("Gagal mengambil data customer:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSelectCustomer = (customer: any, address: any) => {
    setSelectedData({ customer, address });
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto text-slate-700 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Customer</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau lokasi dan sebaran alamat pelanggan Anda.</p>
        </div>
        <input type="text" placeholder="Cari nama..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-72 text-sm" />
      </div>

      <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/80 p-2 relative overflow-hidden h-[350px]">
        <CustomerMap customers={customers} onSelectCustomer={handleSelectCustomer} />
      </div>


      {/* --- TABEL CUSTOMER --- */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-white/80 p-8">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-slate-400 border-b border-white/50">
             <tr>
               <th className="pb-4">Nama Pelanggan</th>
               <th className="pb-4">Email</th>
               <th className="pb-4">Wilayah Utama</th>
               <th className="pb-4 text-center">Tgl. Bergabung</th>
               <th className="pb-4 text-center">Status Aktivitas</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {isLoading ? (
               <tr><td colSpan={5} className="py-10 text-center text-slate-400">Memuat data pelanggan...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={5} className="py-10 text-center text-slate-400">Tidak ada pelanggan ditemukan.</td></tr>
            ) : filtered.map(c => {
              const primaryAddress = c.addresses?.find((a: any) => a.is_primary) || c.addresses?.[0];
              
              return (
                <tr key={c.id} className={`transition cursor-pointer ? 'bg-blue-50/50' : 'hover:bg-white/40'}`} onClick={() => primaryAddress && handleSelectCustomer(c, primaryAddress)}>
                  <td className="py-4 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">{c.name.charAt(0)}</div>
                    {c.name}
                  </td>
                  <td className="py-4">{c.email}</td>
                  <td className="py-4 text-xs">
                    {primaryAddress ? (
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg> {primaryAddress.region.split(',')[0]}</span>
                    ) : <span className="text-slate-400 italic">Belum ada alamat</span>}
                  </td>
                  <td className="py-4 text-center">{new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="py-4 text-center">
                    {c.is_online ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span> Inactive
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}