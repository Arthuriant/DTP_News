"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const CustomerMap = dynamic(() => import("./CustomerMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100 animate-pulse text-slate-400">Memuat Peta Persebaran...</div>
});

export default function Customer() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Detail dan Modal
  const [selectedData, setSelectedData] = useState<{customer: any, address: any} | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk Form Edit Alamat
  const [editForm, setEditForm] = useState({
    id: '',
    recipient_name: '',
    phone_number: '',
    street: '',
    region: ''
  });

  // Fungsi fetch dipisah agar bisa dipanggil ulang setelah edit/hapus
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/customers", {
        credentials: "include",
        headers: { Accept: "application/json" }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        console.error("Gagal mengambil data customer");
      }
    } catch (error) {
      console.error("Error jaringan:", error);
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

  // --- FUNGSI HAPUS ALAMAT ---
  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Yakin ingin menghapus alamat ini dari sistem?")) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        setSelectedData(null); // Tutup detail card
        fetchCustomers(); // Refresh data tabel & peta
      } else {
        alert("Gagal menghapus alamat.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // --- FUNGSI BUKA MODAL EDIT ---
  const openEditModal = (address: any) => {
    setEditForm({
      id: address.id,
      recipient_name: address.recipient_name || '',
      phone_number: address.phone_number || '',
      street: address.street || '',
      region: address.region || ''
    });
    setIsEditModalOpen(true);
  };

  // --- FUNGSI SIMPAN EDIT ALAMAT ---
  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/addresses/${editForm.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json" 
        },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setSelectedData(null); // Tutup detail card agar data diperbarui saat diklik lagi
        fetchCustomers(); // Refresh data
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan perubahan alamat.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto text-slate-700 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Customer</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau lokasi dan kelola informasi alamat pelanggan Anda.</p>
        </div>
        <input type="text" placeholder="Cari nama..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-72 text-sm" />
      </div>

      <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/80 p-2 relative overflow-hidden h-[350px]">
        <CustomerMap customers={customers} onSelectCustomer={handleSelectCustomer} />
      </div>

      {/* --- KARTU DETAIL CUSTOMER & ALAMAT --- */}
      {selectedData && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 text-white flex items-center justify-between animate-fadeIn relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-2xl font-bold relative">
              {selectedData.customer.name.charAt(0)}
              {selectedData.customer.is_online && (
                <span className="absolute bottom-1 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {selectedData.customer.name}
              </h3>
              <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                {selectedData.customer.email}
              </p>
            </div>
          </div>
          
          <div className="text-right max-w-sm flex flex-col items-end">
            <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">Lokasi Pengiriman Utama</p>
            <p className="text-sm font-medium">{selectedData.address.street}</p>
            <p className="text-xs text-blue-100 mt-0.5 mb-3">{selectedData.address.region}</p>
            
            {/* 👇 TOMBOL AKSI ADMIN 👇 */}
            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(selectedData.address)} 
                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-colors border border-white/30"
              >
                Ubah Alamat
              </button>
              <button 
                onClick={() => handleDeleteAddress(selectedData.address.id)} 
                className="px-4 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-colors border border-rose-400/50"
              >
                Hapus
              </button>
            </div>
          </div>

          <button onClick={() => setSelectedData(null)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5 text-white/70 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {/* --- TABEL CUSTOMER (Kode Anda Tetap Sama) --- */}
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
                <tr key={c.id} className={`transition cursor-pointer ${selectedData?.customer.id === c.id ? 'bg-blue-50/50' : 'hover:bg-white/40'}`} onClick={() => primaryAddress && handleSelectCustomer(c, primaryAddress)}>
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

      {/* --- MODAL EDIT ALAMAT --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Ubah Alamat Customer</h3>
              <p className="text-sm text-slate-500 mt-1">Perbarui detail lokasi pengiriman pelanggan.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Penerima</label>
                <input type="text" value={editForm.recipient_name} onChange={e => setEditForm({...editForm, recipient_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Telepon</label>
                <input type="text" value={editForm.phone_number} onChange={e => setEditForm({...editForm, phone_number: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jalan / Detail Lokasi</label>
                <textarea value={editForm.street} onChange={e => setEditForm({...editForm, street: e.target.value})} rows={2} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Wilayah (Kota/Provinsi)</label>
                <input type="text" value={editForm.region} onChange={e => setEditForm({...editForm, region: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
              <button onClick={handleSaveEdit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-70">
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}