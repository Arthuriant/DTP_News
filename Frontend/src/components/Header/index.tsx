"use client";
import React, { useState, useEffect } from "react";
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
            
            {/* Support - Disembunyikan saat scroll */}
            {!stickyMenu && (
              <div className="hidden xl:flex items-center gap-3 transition-opacity duration-300 group cursor-pointer animate-fadeIn">
                <div className="p-2.5 bg-[#C5A059]/10 rounded-full text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300 shadow-sm border border-[#C5A059]/20">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.7 3.1C5.9 1.8 8 2 9 3.5l1.2 1.8c.8 1.1.7 2.7-.3 3.7l-.2.3c-.4.4-.3.9-.1 1.4 1.4 1.5 2.3 1.9 2.7 2 .4.1.6-.1.6-.2l.4-.4c.9-.9 2.2-1.1 3.3-.5l1.9 1.1c1.6.9 2 3.2.7 4.6l-1.4 1.5c-.4.5-1 .9-1.7 1-1.8.2-6 0-10.4-4.7C3.1 12.6 2.3 8.8 2.2 7l.7-.1c-.1-.9.3-1.7.9-2.2l1.6-1.6z"/></svg>
                </div>
                <div>
                  <span className="block text-[9px] text-[#C5A059] uppercase tracking-[0.2em] font-bold leading-none mb-1">BANTUAN</span>
                  <p className="font-serif font-semibold text-sm text-[#2D1A11] tracking-wide">(+62) 2500241</p>
                </div>
              </div>
            )}

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
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-md"
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