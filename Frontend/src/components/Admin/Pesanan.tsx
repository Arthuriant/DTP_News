"use client";
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/AdminService';
import { useRouter } from 'next/navigation';

export default function Pesanan() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const goToDetail = (orderId: string) => {
    router.push(`/admin/pesanan/${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await AdminService.getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const advanceStatus = (id: string) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        let nextStatus = o.status;
        if (o.status === 'pending') nextStatus = 'diproses';
        else if (o.status === 'diproses') nextStatus = 'dikirim';
        else if (o.status === 'dikirim') nextStatus = 'selesai';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const filtered = orders.filter(o => {
    const namaUser = o.user?.name || o.created_by || '';
    return namaUser.toLowerCase().includes(search.toLowerCase()) || 
           String(o.id).toLowerCase().includes(search.toLowerCase());
  });

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-amber-50/80 text-amber-600 border-amber-200';
      case 'diproses': return 'bg-blue-50/80 text-blue-600 border-blue-200';
      case 'dikirim': return 'bg-purple-50/80 text-purple-600 border-purple-200';
      case 'selesai': return 'bg-emerald-50/80 text-emerald-600 border-emerald-200';
      default: return 'bg-gray-50/80 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D9B35A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Manajemen Transaksi</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2D1A11]">Daftar Pesanan</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full shrink-0"></span>
            Pantau dan kelola pesanan tas kustom pelanggan Anda.
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
            placeholder="Cari ID atau Nama Pelanggan..." 
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
          style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}
        ></div>

        <div className="overflow-x-auto px-4 -mx-4">
          <table className="w-full min-w-[1100px] text-sm whitespace-nowrap relative z-10 font-sans border-separate" style={{ borderSpacing: '0 16px' }}>
            
            <thead className="text-[#D9B35A] uppercase text-[11px] font-bold tracking-[0.25em] shadow-xl">
               <tr className="bg-[#2D1A11] shadow-[0_10px_20px_rgba(45,26,17,0.2)]" style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.95), rgba(45, 26, 17, 0.95)), url('${brownBatikUrl}')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}>
                 <th className="py-5 pl-8 pr-4 text-left rounded-l-2xl w-[20%] border-y border-l border-[#D9B35A]/20">ID & Tanggal</th>
                 <th className="py-5 px-4 text-left w-[25%] border-y border-[#D9B35A]/20">Informasi Pelanggan</th>
                 <th className="py-5 px-4 text-right w-[20%] border-y border-[#D9B35A]/20">Pembayaran</th>
                 <th className="py-5 px-4 text-center w-[15%] border-y border-[#D9B35A]/20">Status</th>
                 <th className="py-5 pr-8 pl-4 text-right rounded-r-2xl w-[20%] border-y border-r border-[#D9B35A]/20">Aksi Pesanan</th>
               </tr>
            </thead>
            
            {/* 👇 PERBAIKAN SINTAKS TERNARY DI SINI 👇 */}
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((o) => {
                  // Menangani data relasi dengan aman
                  const userName = o.user?.name || "Pelanggan Guest";
                  const userEmail = o.user?.email || "-";
                  const itemsCount = o.details ? o.details.length : 0;
                  
                  return (
                    <tr key={o.id} className="group transition-all duration-300 hover:-translate-y-1.5">

                      <td className="py-5 pl-8 pr-4 text-left bg-white/60 backdrop-blur-xl rounded-l-2xl border-y border-l border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#2D1A11] text-base block max-w-[150px] truncate" title={o.id}>
                            {String(o.id).split('-')[0]}-...
                          </span>
                          <span className="text-[#8B7355] text-xs font-medium mt-0.5 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {formatDate(o.created_at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-5 px-4 text-left bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FFFDF5] border border-[#D9B35A]/30 flex items-center justify-center text-[#D9B35A] font-bold shadow-sm shrink-0">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-[#2D1A11] text-sm block">{userName}</span>
                            <span className="text-[#8B7355] text-[11px] block">{userEmail}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-4 text-right bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-[#D9B35A] text-lg block">
                            Rp {Number(o.total_amount).toLocaleString('id-ID')}
                          </span>
                          <span className="text-[#8B7355] text-[10px] font-bold tracking-widest mt-0.5 block uppercase">
                            {o.payment_method} • {itemsCount} Item
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-5 px-4 text-center bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                          <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border shadow-sm ${getStatusStyle(o.status)}`}>
                            {o.status === 'pending' && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 animate-pulse"></span>}
                            {o.status || 'Pending'}
                          </div>
                      </td>
                      
                      <td className="py-5 pr-8 pl-4 bg-white/60 backdrop-blur-xl rounded-r-2xl border-y border-r border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                        <div className="flex justify-end items-center gap-2">
                          <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#D9B35A] hover:border-[#D9B35A] transition-all flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                          
                          {o.status !== 'selesai' && (
                            <button 
                              onClick={() => goToDetail(o.id)} 
                              className="bg-[#D9B35A] text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#c29e4b] transition-colors"
                            >
                              Proses
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] border border-white/40">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl mb-4 opacity-40 text-[#8B7355]">𓍯</span>
                      <p className="text-[#2D1A11] font-bold text-xl font-serif">Tidak Ada Pesanan</p>
                      <p className="text-[#8B7355] mt-2 font-sans text-sm">Coba sesuaikan kata kunci pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {/* 👆 Selesai Perbaikan 👆 */}

          </table>
        </div>
      </div>
    </div>
  );
}