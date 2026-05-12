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
  const [selectedDate, setSelectedDate] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [trackingModal, setTrackingModal] = useState<{open: boolean, resi: string | null}>({open: false, resi: null});
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

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const extractPath = (url: string) => {
    if (!url) return "";
    const parts = url.split("/storage/");
    if (parts.length > 1) {
      return "/storage/" + parts[parts.length - 1];
    }
    return url;
  };

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getMyOrders(selectedDate);
      const data = Array.isArray(response) ? response : response.data || [];
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

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
            const productInfo = mainDetail?.product;
            const customConfig = mainDetail?.custom_configuration;
            
            let productImg = "/placeholder.png"; 
            if (productInfo?.img) {
                productImg = extractPath(productInfo.img);
            } else if (customConfig?.image_preview) {
                productImg = extractPath(customConfig.image_preview);
            }

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
                      <img src={productImg} alt={productInfo?.name || "Produk"} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-base text-[#2D1A11] mb-1">{productInfo?.name || "Kustom Mahakarya"}</h4>
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
                      className="inline-block text-center px-8 py-2.5 bg-[#C5A059] text-[#2D1A11] text-xs font-bold uppercase tracking-widest rounded-lg shadow-md hover:bg-[#2D1A11] hover:text-[#C5A059] transition-all"
                    >
                      Bayar
                    </Link>
                  ) : order.status === 'confirmed' || order.status === 'processing' ? (
                    <a 
                      href={`https://wa.me/6283154577112?text=Halo%20Admin%20UpToYou,%20saya%20ingin%20bertanya%20mengenai%20pesanan%20saya%20dengan%20Invoice:%20${invoiceId}.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-white transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      Hubungi Admin
                    </a>
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
                      className="px-8 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId === order.id ? 'Memproses...' : 'Selesai'}
                    </button>
                  )  : order.status === 'completed' || order.status === 'cancelled' ? (
                    <Link 
                      href="/shop-with-sidebar" 
                      className="inline-block text-center px-8 py-2.5 bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all"
                    >
                      Beli Lagi
                    </Link>
                  ) : null}

                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                      className={`p-2.5 border rounded-lg transition-colors ${
                        openDropdownId === order.id 
                          ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10" 
                          : "border-[#E5D7C1] text-[#8B7355] hover:border-[#C5A059] hover:text-[#C5A059]"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>

                    {openDropdownId === order.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-[#E5D7C1] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] py-2 z-50 animate-fadeIn">
                        <button 
                          onClick={() => {
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#2D1A11] hover:bg-[#FFFDF5] hover:text-[#C5A059] transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          Unduh Invoice PDF
                        </button>
                        <a 
                          href="https://wa.me/6283154577112"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpenDropdownId(null)}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#2D1A11] hover:bg-[#FFFDF5] hover:text-[#C5A059] transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Pusat Bantuan
                        </a>
                      </div>
                    )}
                  </div>
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