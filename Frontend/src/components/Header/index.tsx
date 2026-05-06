"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CustomSelect from "./CustomSelect";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { PRODUCTS_CONFIG } from "@/config/products";
import { AuthService } from "@/services/AuthService";
import { CartService } from "@/services/CartService";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transaksi');
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // 1. Tambahkan state untuk menyimpan data user
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  
  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch();
  const totalPrice = useSelector(selectTotalPrice);

  const handleOpenCartModal = () => {
    openCartModal();
  };

  const handleStickyMenu = () => {
    if (window.scrollY >= 50) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // 2. Fetch data user dari Laravel saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const userData = await AuthService.getUser(true);
        
        if (userData && userData.name) {
          setUserData(userData);
          const dbCartItems = await CartService.getCart();

          if (Array.isArray(dbCartItems)) {
            dbCartItems.forEach((dbItem: any) => {
              const baseProduct = PRODUCTS_CONFIG[dbItem.product_id];
              if (baseProduct) {
                dispatch(
                  addItemToCart({
                    id: dbItem.id, 
                    title: `Kustom ${baseProduct.name}`,
                    price: dbItem.price,
                    discountedPrice: dbItem.price,
                    quantity: dbItem.quantity,
                    imgs: {
                      previews: [baseProduct.gallery?.[0] || ""],
                      thumbnails: [baseProduct.gallery?.[0] || ""],
                    },
                    customizations: dbItem.customizations,
                  } as any)
                );
              }
            });
          }
        }
      } catch (error) {
        console.log("Pengunjung belum login (Guest Mode).");
      }
    };

    fetchUserData();
  }, [dispatch]);

  // 3. Fungsi untuk Logout
  const handleLogout = async () => {
    console.log("Tombol logout ditekan...");

    try {
      const res = await AuthService.logout();

      if (res.ok) {
        console.log("Logout berhasil! Membersihkan sesi...");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      } else {
        alert("Gagal logout dari server.");
      }
    } catch (error) {
      console.error("Error jaringan saat mencoba logout", error);
    }
  };

  const options = [
    { label: "All Categories", value: "0" },
    { label: "Desktop", value: "1" },
    { label: "Laptop", value: "2" },
    { label: "Monitor", value: "3" },
    { label: "Phone", value: "4" },
    { label: "Watch", value: "5" },
    { label: "Mouse", value: "6" },
    { label: "Tablet", value: "7" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-[9999] transition-all duration-500 border-b ${
        stickyMenu 
          ? "bg-[#F8F3E9]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(45,26,17,0.08)] border-[#C5A059]/30" 
          : "bg-[#F8F3E9] border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-7.5 xl:px-0">
        
        {/* ================= Header Top Section ================= */}
        <div
          className={`flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between transition-all duration-500 ${
            stickyMenu ? "py-3 lg:py-4" : "py-5 lg:py-8"
          }`}
        >
          {/* Logo & Search Container */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-6 lg:gap-12">
            <Link className="flex-shrink-0 transition-transform duration-500 hover:scale-105" href="/">
              <Image
                src="/images/logo/logo1.png"
                alt="Logo"
                width={stickyMenu ? 160 : 210} 
                height={36}
                className="w-120 h-auto transition-all duration-500"
              />
            </Link>

            {/* Search Bar - Gaya Eksklusif */}
            <div className={`max-w-[500px] w-full transition-all duration-500 ${stickyMenu ? 'scale-[0.98] origin-left' : ''}`}>
              <form>
                <div className="flex items-center shadow-sm rounded-[5px] hover:shadow-md transition-shadow duration-300">
                  <div className="bg-white rounded-l-[5px] border border-r-0 border-[#C5A059]/30">
                     <CustomSelect options={options} />
                  </div>
                  <div className="relative w-full">
                    {/* Garis pemisah krem emas */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-6 bg-[#C5A059]/30 z-10"></span>
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      placeholder="Cari mahakarya..."
                      className="w-full rounded-r-[5px] bg-white border border-l-0 border-[#C5A059]/30 py-2.5 pl-5 pr-10 outline-none focus:border-[#C5A059] transition-colors text-[#2D1A11] placeholder:text-[#2D1A11]/40 font-serif tracking-wide"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D1A11]/50 hover:text-[#C5A059] transition-colors duration-300">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Action Icons (Support, Account, Cart) */}
          <div className="flex items-center gap-6 lg:gap-8">
            
            <div className="relative hidden xl:block" ref={notifRef}>
              
              {/* Trigger Button Notifikasi */}
              <div 
                className="flex items-center gap-3 transition-opacity duration-300 group cursor-pointer animate-fadeIn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <div className="relative p-2.5 bg-[#C5A059]/10 rounded-full text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300 shadow-sm border border-[#C5A059]/20">
                  {/* Ikon Lonceng */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {/* Titik Merah Indikator (Red Dot) */}
                  <span className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#F8F3E9] rounded-full"></span>
                </div>
                <div>
                  <span className="block text-[9px] text-[#C5A059] uppercase tracking-[0.2em] font-bold leading-none mb-1">NOTIFIKASI</span>
                  <p className="font-serif font-semibold text-sm text-[#2D1A11] tracking-wide">Pembaruan</p>
                </div>
              </div>

              {/* Dropdown Pop-up Notifikasi */}
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-6 w-[380px] bg-[#FFFDF5] border border-[#C5A059]/30 rounded-xl shadow-[0_20px_40px_-15px_rgba(45,26,17,0.15)] z-50 overflow-hidden flex flex-col cursor-default animate-fadeIn">
                  
                  {/* Header Dropdown */}
                  <div className="px-5 py-4 flex justify-between items-center border-b border-[#C5A059]/10">
                    <h3 className="font-serif text-lg font-bold text-[#2D1A11] tracking-wide">Notifikasi</h3>
                    <a href="#" className="text-[#8B7355] hover:text-[#C5A059] transition-colors">
                      {/* Ikon Pengaturan */}
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </a>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#C5A059]/10">
                    <button 
                      onClick={() => setActiveTab('transaksi')}
                      className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'transaksi' ? 'text-[#C5A059]' : 'text-[#8B7355] hover:text-[#2D1A11]'}`}
                    >
                      Transaksi
                      {activeTab === 'transaksi' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059]"></span>}
                    </button>
                    <button 
                      onClick={() => setActiveTab('update')}
                      className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'update' ? 'text-[#C5A059]' : 'text-[#8B7355] hover:text-[#2D1A11]'}`}
                    >
                      Update (1)
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {activeTab === 'update' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059]"></span>}
                    </button>
                  </div>

                  {/* Konten Tab */}
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                    {activeTab === 'transaksi' ? (
                      <div className="p-5">
                        
                        {/* Bagian Pembelian */}
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-[#2D1A11] text-base">Pembelian</h4>
                          <a href="/order/history" className="text-[11px] font-bold text-[#C5A059] hover:text-[#2D1A11] transition-colors">Lihat Semua</a>
                        </div>

                        {/* Status Menunggu Pembayaran */}
                        <a href="/order/history" className="flex justify-between items-center bg-[#FFFDF5] p-3 rounded-lg border border-[#C5A059]/20 hover:border-[#C5A059] transition-colors mb-5 group">
                          <span className="text-sm font-semibold text-[#8B7355] group-hover:text-[#2D1A11] transition-colors">Menunggu Pembayaran</span>
                          <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">1</span>
                        </a>

                       {/* Grid 4 Icon Status */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                          <Link href="/order/list?status=confirmed" className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white flex items-center justify-center transition-all duration-300">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <span className="text-[10px] text-center font-medium leading-tight text-[#8B7355] group-hover:text-[#2D1A11]">Menunggu<br/>Konfirmasi</span>
                          </Link>
                          
                          <Link href="/order/list?status=processing" className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white flex items-center justify-center transition-all duration-300">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            </div>
                            <span className="text-[10px] text-center font-medium leading-tight text-[#8B7355] group-hover:text-[#2D1A11]">Pesanan<br/>Diproses</span>
                          </Link>
                          
                          <Link href="/order/list?status=shipped" className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white flex items-center justify-center transition-all duration-300">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            </div>
                            <span className="text-[10px] text-center font-medium leading-tight text-[#8B7355] group-hover:text-[#2D1A11]">Sedang<br/>Dikirim</span>
                          </Link>
                          
                          <Link href="/order/list?status=delivered" className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white flex items-center justify-center transition-all duration-300">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <span className="text-[10px] text-center font-medium leading-tight text-[#8B7355] group-hover:text-[#2D1A11]">Sampai<br/>Tujuan</span>
                          </Link>
                        </div>

                        <div className="w-full h-[1px] bg-[#C5A059]/10 my-4"></div>

                        {/* Bagian Bantuan & Konsultasi (WhatsApp) */}
                        <div className="mb-2">
                          <h4 className="font-bold text-[#2D1A11] text-base mb-2">Butuh Bantuan?</h4>
                          <p className="text-xs text-[#8B7355] leading-relaxed mb-4">
                            Punya pertanyaan tentang material atau detail kustomisasi? Artisan kami siap membantu mewujudkan tas impian Anda.
                          </p>
                          <a 
                            href="https://wa.me/6283154577112?text=Halo%20Artisan%20UpToYou,%20saya%20butuh%20bantuan%20mengenai%20pesanan%20kustom%20saya." 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-sm font-bold text-[#C5A059] bg-transparent border border-[#C5A059] hover:bg-[#C5A059] hover:text-white rounded-lg transition-all duration-300"
                          >
                            {/* Ikon WhatsApp */}
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                            Hubungi Artisan Kami
                          </a>
                        </div>

                      </div>
                    ) : (
                      <div className="p-5 flex flex-col items-center justify-center h-[250px] text-center">
                        <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-3">
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <p className="text-sm font-bold text-[#2D1A11] mb-1">Coming Soon</p>
                        <p className="text-xs text-[#8B7355]">Tunggu update terbaru dari kami ya!</p>
                      </div>
                    )}
                  </div>

                  {/* Footer Dropdown */}
                  <div className="p-4 bg-[#F8F3E9] border-t border-[#C5A059]/20 flex justify-between items-center mt-auto">
                    <a href="#" className="text-[11px] font-bold text-[#8B7355] hover:text-[#2D1A11] transition-colors">Tandai semua dibaca</a>
                    <a href="/order/list" className="text-[11px] font-bold text-[#C5A059] hover:text-[#2D1A11] transition-colors">Lihat selengkapnya</a>
                  </div>

                </div>
              )}
            </div>
          

            <div className="flex items-center gap-6">
              
              {/* AREA ACCOUNT / LOGIN */}
              {userData ? (
                <div className="relative group z-50">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-[#2D1A11] group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div className={stickyMenu ? 'hidden lg:block' : 'hidden sm:block'}>
                      <span className="block text-[9px] text-[#C5A059] uppercase tracking-[0.2em] font-bold leading-none mb-1">AKUN</span>
                      <p className="font-serif font-medium text-sm text-[#2D1A11] group-hover:text-[#C5A059] transition-colors max-w-[100px] truncate">
                        {userData.name}
                      </p>
                    </div>
                  </div>

                  {/* Kotak Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg rounded-md border border-[#C5A059]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-translate-y-1 transition-all duration-300">
                    <Link href="/Profile" className="block px-4 py-2 text-sm text-[#2D1A11] hover:bg-[#C5A059]/10 hover:text-[#C5A059] transition-colors rounded-t-md">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#2D1A11] hover:bg-[#C5A059]/10 hover:text-[#C5A059] transition-colors rounded-b-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/signin" className="group flex items-center gap-3">
                  <div className="text-[#2D1A11] group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div className={stickyMenu ? 'hidden lg:block' : 'hidden sm:block'}>
                    <span className="block text-[9px] text-[#C5A059] uppercase tracking-[0.2em] font-bold leading-none mb-1">AKUN</span>
                    <p className="font-serif font-medium text-sm text-[#2D1A11] group-hover:text-[#C5A059] transition-colors">Sign In</p>
                  </div>
                </Link>
              )}
              
              {/* Cart Button */}
              <button onClick={handleOpenCartModal} className="group flex items-center gap-3">
                <div className="relative text-[#2D1A11] group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  
                  {/* Cart Badge Emas */}
                  <span className="flex items-center justify-center absolute -right-2 -top-2 bg-[#D4AF37] w-4.5 h-4.5 rounded-full text-[#1E110A] text-[10px] font-extrabold shadow-sm border border-white">
                    {product.length}
                  </span>
                </div>
                <div className={stickyMenu ? 'hidden lg:block' : 'hidden sm:block'}>
                  <span className="block text-[9px] text-[#C5A059] uppercase tracking-[0.2em] font-bold leading-none mb-1">KERANJANG</span>
                  <p className="font-serif font-medium text-sm text-[#2D1A11] group-hover:text-[#C5A059] transition-colors">Rp {totalPrice.toLocaleString('id-ID')}</p>
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-[#2D1A11] hover:text-[#C5A059] transition-colors"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <div className="w-6 flex flex-col gap-1.5">
                  <span className={`h-[2px] w-full bg-current transition-all duration-300 ${navigationOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`h-[2px] w-full bg-current transition-all duration-300 ${navigationOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`h-[2px] w-full bg-current transition-all duration-300 ${navigationOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Main Navigation Section (Yang Bisa Menghilang) ================= */}
      <div className={`transition-all duration-500 ease-in-out ${stickyMenu ? 'border-transparent' : 'border-t border-[#C5A059]/20'}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-7.5 xl:px-0">
          
          {/* Wrapper yang akan menciut (collapse) saat stickyMenu aktif */}
          <div className={`flex items-center justify-between transition-all duration-500 origin-top ease-in-out ${
            stickyMenu 
              ? 'xl:max-h-0 xl:opacity-0 xl:pointer-events-none xl:overflow-hidden' 
              : 'xl:max-h-[100px] xl:opacity-100 xl:pointer-events-auto xl:overflow-visible'
          }`}>
            
            <nav className={`
              absolute right-4 top-full xl:static bg-[#F8F3E9] xl:bg-transparent shadow-xl xl:shadow-none rounded-b-xl xl:rounded-none transition-all duration-500 border border-[#C5A059]/20 xl:border-0 z-50
              ${navigationOpen ? 'max-h-[500px] opacity-100 py-5 xl:py-0 overflow-visible' : 'max-h-0 opacity-0 xl:max-h-none xl:opacity-100 py-0 overflow-hidden'}
            `}>
              <ul className="flex flex-col xl:flex-row xl:items-center px-5 xl:px-0 gap-4 xl:gap-10">
                {menuData.map((menuItem, i) => (
                  <li key={i} className="group relative">
                    {menuItem.submenu ? (
                      <Dropdown menuItem={menuItem} stickyMenu={stickyMenu} />
                    ) : (
                      <Link
                        href={menuItem.path}
                        className={`text-sm md:text-base font-serif font-medium text-[#2D1A11] hover:text-[#C5A059] transition-all duration-300 relative py-5 inline-block tracking-wide
                          after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#C5A059] after:transition-all after:duration-300 hover:after:w-full
                        `}
                      >
                        {menuItem.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Links Kanan (Hanya terlihat di Desktop) */}
            <div className={`hidden xl:flex items-center gap-8 text-xs tracking-widest font-serif font-medium uppercase text-[#C5A059]`}>
                <Link href="#" className="hover:text-[#2D1A11] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#2D1A11] hover:after:w-full after:transition-all">Terakhir Dilihat</Link>
                <span className="w-1 h-1 rounded-full bg-[#C5A059]/40"></span>
                <Link href="/wishlist" className="hover:text-[#2D1A11] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#2D1A11] hover:after:w-full after:transition-all">Wishlist</Link>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;