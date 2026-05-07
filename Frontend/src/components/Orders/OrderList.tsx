"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { OrderService } from "@/services/OrderService"; 
import Link from "next/link";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // States untuk Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [activeSubTab, setActiveSubTab] = useState("Semua Berlangsung");
  const [selectedDate, setSelectedDate] = useState(""); // BARU: State untuk Tanggal
  const [currentPage, setCurrentPage] = useState(1);
  const [trackingModal, setTrackingModal] = useState<{open: boolean, resi: string | null}>({open: false, resi: null}); // ← tambah di sini
  const ITEMS_PER_PAGE = 15;

  const TABS = ["Semua", "Menunggu Konfirmasi", "Berlangsung", "Berhasil", "Tidak Berhasil"];
  const SUB_TABS = [
    { label: "Semua Berlangsung", value: "all" },
    { label: "Menunggu Pembayaran", value: "pending" },
    { label: "Sedang Diproses", value: "processing" },
    { label: "Sedang Diantar", value: "shipped" },
    { label: "Pesanan Tiba", value: "delivered" },
  ];

  const getInitialTab = () => {
    if (statusParam === "confirmed") return "Menunggu Konfirmasi";
    if (["pending", "processing", "shipped", "delivered"].includes(statusParam || "")) return "Berlangsung";
    return "Semua";
  };

  const getInitialSubTab = () => {
    if (statusParam === "pending") return "Menunggu Pembayaran";
    if (statusParam === "processing") return "Sedang Diproses";
    if (statusParam === "shipped") return "Sedang Diantar";
    if (statusParam === "delivered") return "Pesanan Tiba";
    return "Semua Berlangsung";
  };

  
  

  // BARU: fetchOrders dibungkus useCallback agar bisa dipanggil ulang tanpa peringatan linter
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mengirim selectedDate ke service
      const response = await OrderService.getMyOrders(selectedDate);
      const data = Array.isArray(response) ? response : response.data || [];
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // BARU: Trigger fetchOrders setiap kali selectedDate berubah
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (statusParam) {
      if (statusParam === "confirmed") {
        setActiveTab("Menunggu Konfirmasi");
        setActiveSubTab("Semua Berlangsung");
      } else if (["pending", "processing", "shipped", "delivered"].includes(statusParam)) {
        setActiveTab("Berlangsung");
        if (statusParam === "pending") setActiveSubTab("Menunggu Pembayaran");
        else if (statusParam === "processing") setActiveSubTab("Sedang Diproses");
        else if (statusParam === "shipped") setActiveSubTab("Sedang Diantar");
        else if (statusParam === "delivered") setActiveSubTab("Pesanan Tiba");
      } else {
        setActiveTab("Semua");
        setActiveSubTab("Semua Berlangsung");
      }
      setCurrentPage(1);
    }
  }, [statusParam]);

  const handleConfirmDelivery = async (id: string) => {
    // 1. Popup Konfirmasi
    const result = await Swal.fire({
      title: "Konfirmasi Penerimaan",
      text: "Apakah Anda yakin telah menerima mahakarya ini dengan baik?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Selesai!",
      cancelButtonText: "Batal",
      background: "#FFFDF5", 
      color: "#2D1A11",      
      reverseButtons: true,
      buttonsStyling: false, 
      customClass: {
        confirmButton: "bg-[#C5A059] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-[#2D1A11] transition-all ml-3",
        cancelButton: "bg-transparent border border-[#8B7355] text-[#8B7355] px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-[#8B7355] hover:text-white transition-all"
      }
    });

    if (!result.isConfirmed) return;

    setUpdatingId(id);
    try {
      await OrderService.confirmDelivery(id);
      await fetchOrders();
      
      Swal.fire({
        title: "Pesanan Selesai!",
        text: "Terima kasih telah mempercayakan mahakarya Anda kepada kami.",
        icon: "success",
        confirmButtonText: "Oke, Tutup",
        background: "#FFFDF5",
        color: "#2D1A11",
        buttonsStyling: false, 
        customClass: {
          confirmButton: "bg-[#C5A059] text-white px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-[#2D1A11] transition-all"
        }
      });

    } catch (error) {
      console.error("Gagal menyelesaikan pesanan:", error);
    
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan sistem saat mencoba menyelesaikan pesanan.",
        icon: "error",
        confirmButtonText: "Tutup",
        background: "#FFFDF5",
        color: "#2D1A11",
        buttonsStyling: false, 
        customClass: {
          confirmButton: "bg-red-600 text-white px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-red-800 transition-all"
        }
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusCategory = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "confirmed") return "Menunggu Konfirmasi";
    if (["pending", "processing", "shipped", "delivered"].includes(s)) return "Berlangsung";
    if (["completed", "finished", "success"].includes(s)) return "Berhasil"; 
    if (["cancelled", "failed", "returned"].includes(s)) return "Tidak Berhasil";
    return "Berlangsung"; 
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    switch (s) {
      case "pending": return { text: "Menunggu Pembayaran", classes: "bg-orange-100 text-orange-800 border-orange-200" };
      case "confirmed": return { text: "Menunggu Konfirmasi", classes: "bg-blue-100 text-blue-800 border-blue-200" };
      case "processing": return { text: "Sedang Diproses", classes: "bg-indigo-100 text-indigo-800 border-indigo-200" };
      case "shipped": return { text: "Sedang Diantar", classes: "bg-cyan-100 text-cyan-800 border-cyan-200" };
      case "delivered": return { text: "Pesanan Tiba", classes: "bg-teal-100 text-teal-800 border-teal-200" };
      case "completed": 
      case "finished":
      case "success": return { text: "Selesai", classes: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "cancelled": return { text: "Dibatalkan", classes: "bg-red-100 text-red-800 border-red-200" };
      default: return { text: status, classes: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderStatus = order.status?.toLowerCase() || "";
      const category = getStatusCategory(orderStatus);
      const matchTab = activeTab === "Semua" || category === activeTab;

      let matchSubTab = true;
      if (activeTab === "Berlangsung" && activeSubTab !== "Semua Berlangsung") {
        const selectedSubTabObj = SUB_TABS.find(t => t.label === activeSubTab);
        if (selectedSubTabObj) matchSubTab = orderStatus === selectedSubTabObj.value;
      }

      const query = searchQuery.toLowerCase();
      const matchSearch = 
        order.id.toLowerCase().includes(query) || 
        order.details?.some((d: any) => d.product?.name?.toLowerCase().includes(query));

      return matchTab && matchSubTab && matchSearch;
    });
  }, [orders, activeTab, activeSubTab, searchQuery]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full font-sans text-[#2D1A11]">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#D9B35A]/30 mb-8 relative z-10">
        
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan invoice atau nama mahakarya..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-[#FFFDF5] border border-[#E5D7C1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9B35A]/50 focus:border-[#D9B35A] transition-all text-[#2D1A11] placeholder-[#8B7355]/60"
            />
          </div>

          {/* BARU: Input Date yang berfungsi */}
          <div className="relative md:w-64">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { 
                setSelectedDate(e.target.value); 
                setCurrentPage(1); 
              }}
              className="w-full px-4 py-3 bg-[#FFFDF5] border border-[#E5D7C1] rounded-xl text-sm text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#D9B35A]/50 focus:border-[#D9B35A] hover:border-[#D9B35A] transition-all uppercase tracking-wider cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
          <span className="text-sm font-bold text-[#2D1A11] mr-2 shrink-0">Status</span>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setActiveSubTab("Semua Berlangsung"); setCurrentPage(1); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all border shrink-0 ${
                activeTab === tab ? "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]" : "bg-white text-[#8B7355] border-[#E5D7C1] hover:bg-[#FFFDF5] hover:border-[#D9B35A]/50"
              }`}
            >
              {tab}
            </button>
          ))}
          
          {/* BARU: Reset filter sekarang juga mengosongkan selectedDate */}
          {(searchQuery || activeTab !== "Semua" || selectedDate) && (
            <button 
              onClick={() => { setSearchQuery(""); setActiveTab("Semua"); setActiveSubTab("Semua Berlangsung"); setSelectedDate(""); setCurrentPage(1); }}
              className="ml-auto text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#2D1A11] transition-colors pl-4 shrink-0"
            >
              Reset Filter
            </button>
          )}
        </div>

        {activeTab === "Berlangsung" && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar mt-4 pt-4 border-t border-[#E5D7C1]/50">
            {SUB_TABS.map((subTab) => (
              <button
                key={subTab.label}
                onClick={() => { setActiveSubTab(subTab.label); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 ${
                  activeSubTab === subTab.label ? "bg-[#2D1A11] text-[#C5A059] border-[#2D1A11]" : "bg-[#FFFDF5] text-[#8B7355] border-[#E5D7C1] hover:border-[#C5A059]/50"
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#E5D7C1] border-t-[#C5A059] rounded-full animate-spin mb-4"></div>
          <p className="text-[#8B7355] font-serif text-lg animate-pulse">Menarik lembar riwayat...</p>
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-[#D9B35A]/30 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-[#FFFDF5] rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-[#C5A059]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2D1A11] mb-2">Belum ada riwayat transaksi</h3>
          <p className="text-[#8B7355] mb-8">Tidak ditemukan data pesanan untuk filter yang Anda pilih.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const invoiceId = `INV/${order.id.split('-')[0].toUpperCase()}`;
            const orderDate = new Date(order.order_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            
            const mainDetail = order.details?.[0];
            const product = mainDetail?.product;
            const productImg = product?.img_full_url || (product?.img ? `http://127.0.0.1:8000/storage/${product.img}` : '/images/placeholder.jpg');
            const additionalItemsCount = (order.details?.length || 1) - 1;

            return (
              <div key={order.id} className="bg-white border border-[#E5D7C1] rounded-2xl p-6 shadow-sm hover:shadow-[0_15px_30px_-15px_rgba(197,160,89,0.2)] hover:border-[#D9B35A]/50 transition-all duration-300">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-[#E5D7C1] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span className="font-bold text-[#2D1A11] text-sm">Belanja</span>
                    <span className="text-sm text-[#8B7355]">{orderDate}</span>
                  </div>
                  <div className="flex items-center gap-3 sm:ml-auto">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.classes}`}>
                      {badge.text}
                    </span>
                    <span className="text-sm font-mono text-[#8B7355]">{invoiceId}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-1 gap-4">
                    <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-[#E5D7C1] bg-[#FFFDF5] p-2">
                      <img src={productImg} alt={product?.name || "Produk"} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-base text-[#2D1A11] mb-1">{product?.name || "Kustom Mahakarya"}</h4>
                      <p className="text-sm text-[#8B7355] mb-2">
                        {mainDetail?.qty} barang x Rp {parseFloat(mainDetail?.price || 0).toLocaleString('id-ID')}
                      </p>
                      {additionalItemsCount > 0 && (
                        <span className="text-xs font-semibold text-[#C5A059] bg-[#C5A059]/10 px-2 py-1 rounded-md inline-block self-start">
                          +{additionalItemsCount} mahakarya lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="md:w-[200px] md:border-l md:border-[#E5D7C1] md:pl-6 flex flex-col justify-center">
                    <span className="text-xs text-[#8B7355] mb-1 font-semibold uppercase tracking-wider">Total Investasi</span>
                    <span className="text-lg font-bold text-[#2D1A11]">
                      Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4 mt-6 pt-5 border-t border-[#E5D7C1]/50">
                  <Link href={`/admin/order-details/${order.id}`} className="text-xs font-bold text-[#C5A059] hover:text-[#2D1A11] transition-colors mr-auto sm:mr-0">
                    Lihat Detail Transaksi
                  </Link>
                  
                 {order.status === 'pending' ? (
                  <Link 
                    href="/order/history"
                    className="inline-block px-8 py-2.5 bg-[#C5A059] text-[#2D1A11] text-xs text-center font-bold uppercase tracking-widest rounded-lg shadow-md hover:bg-[#2D1A11] hover:text-[#C5A059] transition-all"
                  >
                    Bayar
                  </Link>
                ) : order.status === 'confirmed' || order.status === 'processing' ? (
                  <button 
                    onClick={() => window.open('https://wa.me/6283154577112', '_blank')}
                    className="px-8 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all"
                  >
                    Hubungi Admin
                  </button>
                ) : order.status === 'shipped' ? (
                  <button 
                    onClick={() => setTrackingModal({ open: true, resi: order.resi || null })}
                    className="px-8 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all"
                  >
                    Lacak
                  </button>
                ) : order.status === 'delivered' ? (
                  <button 
                    onClick={() => handleConfirmDelivery(order.id)}
                    disabled={updatingId === order.id}
                    className="px-8 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all disabled:opacity-50"
                  >
                    {updatingId === order.id ? 'Memproses...' : 'Selesai'}
                  </button>
                ) : order.status === 'completed' || order.status === 'cancelled' ? (
                  <button className="px-8 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all">
                    Beli Lagi
                  </button>
                ) : null}

                  
                  <button className="p-2.5 border border-[#E5D7C1] text-[#8B7355] rounded-lg hover:border-[#C5A059] hover:text-[#C5A059] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-10 h-10 rounded-full border border-[#D9B35A]/50 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C5A059] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                currentPage === page ? "bg-[#C5A059] text-white shadow-md" : "bg-white border border-[#E5D7C1] text-[#8B7355] hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-10 h-10 rounded-full border border-[#D9B35A]/50 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C5A059] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      )}
        {trackingModal.open && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-[#FFFDF5] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#D9B35A]/30 shadow-2xl">
                <h3 className="font-bold text-xl text-[#2D1A11] mb-6 font-serif">Informasi Pengiriman</h3>
                            
                  {trackingModal.resi ? (
                    <div className="space-y-4">
                      <div className="bg-[#D9B35A]/5 border border-[#D9B35A]/30 rounded-xl p-5">
                          <p className="text-[#8B7355] text-xs uppercase font-bold tracking-widest mb-2">Nomor Resi</p>
                          <p className="font-mono font-black text-2xl text-[#2D1A11] tracking-widest">{trackingModal.resi}</p>
                            </div>
                              <p className="text-[#8B7355] text-sm">Gunakan nomor resi di atas untuk melacak paket Anda melalui website kurir.</p>
                            </div>
                           ) : (
                          <p className="text-[#8B7355] text-sm">Nomor resi belum tersedia. Pesanan Anda sedang dalam proses pengiriman.</p>
                        )}

                      <button
                    onClick={() => setTrackingModal({ open: false, resi: null })}
                className="mt-6 w-full py-3 bg-[#2D1A11] text-[#D9B35A] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-all"
              >
                 Tutup
              </button>
        </div>
      </div>
    )}
    </div>
  );
}