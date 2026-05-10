"use client";
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/AdminService';
import { useRouter } from 'next/navigation';
import { AlertService } from '@/services/AlertService';

export default function Pesanan() {
  const router = useRouter();
  
  // --- STATES ---
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // States untuk Search, Filter & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah pesanan per halaman

  const goToDetail = (orderId: string) => {
    router.push(`/admin/pesanan/${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await AdminService.getAllOrders();
        setOrders(data);
      } catch (error: any) {
        console.error("Gagal mengambil data pesanan:", error);
        AlertService.error("Gagal Memuat Data", "Tidak dapat mengambil data pesanan dari server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatusValue: string, newStatusLabel: string) => {
    const isConfirmed = await AlertService.confirm(
      "Ubah Status Pesanan?",
      `Apakah Anda yakin ingin mengubah status pesanan ini menjadi ${newStatusLabel.toUpperCase()}?`,
      "Ya, Ubah!"
    );

    if (isConfirmed) {
      try {
        await AdminService.updateOrderStatus(id, newStatusValue);
        setOrders(orders.map(o => {
          if (o.id === id) {
            return { ...o, status: newStatusValue };
          }
          return o;
        }));

        AlertService.success("Berhasil", "Status pesanan berhasil disimpan ke database.");
      } catch (error) {
        console.error("Gagal mengubah status:", error);
        AlertService.error("Gagal", "Gagal menyimpan perubahan ke server. Coba lagi.");
      }
    }
  };

  // --- LOGIKA FILTER BERLAPIS ---
  const filteredOrders = orders.filter(o => {
    const namaUser = o.user?.name || o.created_by || '';
    const matchesSearch = namaUser.toLowerCase().includes(search.toLowerCase()) || 
                          String(o.id).toLowerCase().includes(search.toLowerCase());
    
    const currentStatus = o.status?.toLowerCase() || 'pending';
    const matchesStatus = statusFilter === 'semua' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  const getStatusStyle = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "pending";
    switch(normalizedStatus) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'confirmed': return 'bg-sky-50 text-sky-600 border-sky-200';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'delivered': return 'bg-teal-50 text-teal-600 border-teal-200';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filterTabs = [
    { value: 'semua', label: 'Semua Transaksi' },
    { value: 'pending', label: 'Tunggu Pembayaran' },
    { value: 'confirmed', label: 'Tunggu Konfirmasi' },
    { value: 'processing', label: 'Sedang Diproses' },
    { value: 'shipped', label: 'Sedang Diantar' },
    { value: 'delivered', label: 'Pesanan Tiba' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  const statusOptions = filterTabs.filter(tab => tab.value !== 'semua');

  const getStatusLabel = (statusValue: string) => {
    const found = statusOptions.find(opt => opt.value === statusValue?.toLowerCase());
    return found ? found.label : statusValue;
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
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-2 px-2">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Manajemen Transaksi</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2D1A11]">Daftar Pesanan</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full shrink-0"></span>
            Pantau dan kelola pesanan tas kustom pelanggan Anda.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative group w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-[#D9B35A]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="Cari ID atau Nama..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} // Reset page saat mencari
            className="bg-white/60 backdrop-blur-xl border border-white/50 text-[#2D1A11] pl-12 pr-6 py-4 rounded-full shadow-[0_5px_15px_rgba(45,26,17,0.05),inner_0_1px_2px_rgba(255,255,255,0.8)] focus:outline-none focus:border-[#D9B35A]/50 focus:ring-1 focus:ring-[#D9B35A]/50 w-full transition-all font-sans text-sm placeholder:text-gray-400 group-hover:shadow-[0_8px_20px_rgba(217,179,90,0.15)]"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-4 px-2 border-b border-[#D9B35A]/30 font-sans">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setCurrentPage(1); }} // Reset page saat filter
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border shrink-0 ${
              statusFilter === tab.value 
                ? "bg-[#D9B35A] text-[#2D1A11] border-[#D9B35A] shadow-md" 
                : "bg-white/60 text-[#8B7355] border-[#D9B35A]/20 hover:bg-white hover:border-[#D9B35A]/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN DATA SECTION */}
      <div className="relative w-full pb-10">
        <div className="absolute -right-10 -bottom-10 w-96 h-72 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}></div>

        <div className="overflow-x-auto px-4 -mx-4 pb-12"> 
          <table className="w-full min-w-[1100px] text-sm whitespace-nowrap relative z-10 font-sans border-separate" style={{ borderSpacing: '0 16px' }}>
            
            <thead className="text-[#D9B35A] uppercase text-[11px] font-bold tracking-[0.25em] shadow-xl">
               <tr className="bg-[#2D1A11] shadow-[0_10px_20px_rgba(45,26,17,0.2)]" style={{ backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.95), rgba(45, 26, 17, 0.95)), url('${brownBatikUrl}')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}>
                 <th className="py-5 pl-8 pr-4 text-left rounded-l-2xl w-[20%] border-y border-l border-[#D9B35A]/20">ID & Tanggal</th>
                 <th className="py-5 px-4 text-left w-[25%] border-y border-[#D9B35A]/20">Informasi Pelanggan</th>
                 <th className="py-5 px-4 text-right w-[20%] border-y border-[#D9B35A]/20">Pembayaran & Resi</th>
                 <th className="py-5 px-4 text-center w-[15%] border-y border-[#D9B35A]/20">Status</th>
                 <th className="py-5 pr-8 pl-4 text-right rounded-r-2xl w-[20%] border-y border-r border-[#D9B35A]/20">Aksi Pesanan</th>
               </tr>
            </thead>
            
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((o) => {
                  const userName = o.user?.name || "Pelanggan Guest";
                  const userEmail = o.user?.email || "-";
                  const itemsCount = o.details ? o.details.length : 0;
                  const currentStatus = o.status?.toLowerCase() || 'pending';
                  
                  const isDropdownOpen = openDropdownId === o.id;
                  
                  return (
                    <tr key={o.id} className={`group transition-all duration-300 ${isDropdownOpen ? 'relative z-[99]' : 'relative z-10 hover:-translate-y-1.5'}`}>
                      
                      <td className="py-5 pl-8 pr-4 text-left bg-white/60 backdrop-blur-xl rounded-l-2xl border-y border-l border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08)]">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#2D1A11] text-base block max-w-[150px] truncate" title={o.id}>{String(o.id).split('-')[0]}-...</span>
                          <span className="text-[#8B7355] text-xs font-medium mt-0.5 flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>{formatDate(o.created_at)}</span>
                        </div>
                      </td>

                      <td className="py-5 px-4 text-left bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FFFDF5] border border-[#D9B35A]/30 flex items-center justify-center text-[#D9B35A] font-bold shadow-sm shrink-0">{userName.charAt(0).toUpperCase()}</div>
                          <div>
                            <span className="font-bold text-[#2D1A11] text-sm block">{userName}</span>
                            <span className="text-[#8B7355] text-[11px] block">{userEmail}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-4 text-right bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08)]">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-[#D9B35A] text-lg block">Rp {Number(o.total_amount).toLocaleString('id-ID')}</span>
                          <span className="text-[#8B7355] text-[10px] font-bold tracking-widest mt-0.5 block uppercase">{o.payment_method} • {itemsCount} Item</span>
                          {o.resi && (
                            <span className="mt-1.5 inline-block bg-[#D9B35A]/10 text-[#D9B35A] border border-[#D9B35A]/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                              RESI: {o.resi}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className={`py-5 px-4 text-center bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08)] ${isDropdownOpen ? 'relative z-[100]' : ''}`}>
                          
                          <div className="relative inline-block w-full max-w-[140px] text-left">
                            <button 
                              type="button"
                              onClick={() => setOpenDropdownId(isDropdownOpen ? null : o.id)}
                              className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#D9B35A]/50 ${getStatusStyle(currentStatus)}`}
                            >
                              <span className="truncate">{getStatusLabel(currentStatus)}</span>
                              <svg className={`w-3 h-3 transition-transform duration-200 ml-2 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {isDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-[#D9B35A]/30 rounded-xl shadow-2xl z-50 overflow-hidden py-1 origin-top">
                                  {statusOptions.map((opt) => (
                                    <button
                                      key={opt.value}
                                      onClick={() => {
                                        handleStatusChange(o.id, opt.value, opt.label);
                                        setOpenDropdownId(null);
                                      }}
                                      className={`block w-full text-left px-5 py-3 text-[11px] font-bold tracking-widest uppercase transition-colors ${
                                        currentStatus === opt.value 
                                          ? 'bg-[#D9B35A]/10 text-[#D9B35A]' 
                                          : 'text-[#2D1A11] hover:bg-[#FFFDF5] hover:text-[#D9B35A]'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                      </td>
                      
                      <td className="py-5 pr-8 pl-4 bg-white/60 backdrop-blur-xl rounded-r-2xl border-y border-r border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08)]">
                        <div className="flex justify-end items-center gap-2">
                          {/* ✅ Sembunyikan tombol kalau status pending */}
                         {!['pending', 'cancelled'].includes(currentStatus) && (
                          <button 
                            onClick={() => goToDetail(o.id)} 
                            className="bg-white text-[#D9B35A] border border-[#D9B35A] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-all shadow-sm whitespace-nowrap"
                          >
                            Detail Pesanan
                          </button>
                        )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08)] border border-white/40">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl mb-4 opacity-40 text-[#8B7355]">𓍯</span>
                      <p className="text-[#2D1A11] font-bold text-xl font-serif">Tidak Ada Pesanan</p>
                      <p className="text-[#8B7355] mt-2 font-sans text-sm">Tidak ditemukan data pesanan untuk filter yang Anda pilih.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4 font-sans">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full border border-[#D9B35A]/50 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C5A059] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                  currentPage === page 
                    ? "bg-[#C5A059] text-white shadow-md" 
                    : "bg-white border border-[#E5D7C1] text-[#8B7355] hover:border-[#C5A059] hover:text-[#C5A059]"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-10 h-10 rounded-full border border-[#D9B35A]/50 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C5A059] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}