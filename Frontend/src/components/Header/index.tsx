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

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();

  const product = useAppSelector((state) => state.cartReducer.items);
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
      className={`fixed left-0 top-0 w-full z-[9999] transition-all duration-300 ${
        stickyMenu 
          ? "bg-white/90 backdrop-blur-md shadow-md" 
          : "bg-white"
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* --- Header Top Section --- */}
        <div
          className={`flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between transition-all duration-300 ${
            stickyMenu ? "py-2 lg:py-3" : "py-5 lg:py-7"
          }`}
        >
          {/* Logo & Search Container */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-5 lg:gap-10">
            <Link className="flex-shrink-0 transition-transform duration-300" href="/">
              <Image
                src="/images/logo/logo.svg"
                alt="Logo"
                width={stickyMenu ? 160 : 219} // Logo mengecil saat scroll
                height={36}
                className="w-auto h-auto"
              />
            </Link>

            {/* Search Bar - Dibuat sedikit lebih pendek saat sticky */}
            <div className={`max-w-[475px] w-full transition-all duration-300 ${stickyMenu ? 'scale-95 origin-left' : ''}`}>
              <form>
                <div className="flex items-center">
                  <CustomSelect options={options} />
                  <div className="relative w-full">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5 bg-gray-4"></span>
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      placeholder="I am shopping for..."
                      className="w-full rounded-r-[5px] bg-gray-1 border border-l-0 border-gray-3 py-2 pl-4 pr-10 outline-none focus:border-blue transition-colors"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue transition-colors">
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
          <div className="flex items-center gap-6">
            {/* Support - Disembunyikan saat scroll untuk hemat ruang */}
            {!stickyMenu && (
              <div className="hidden xl:flex items-center gap-3 transition-opacity duration-300">
                <div className="p-2 bg-gray-1 rounded-full text-blue">
                   {/* SVG Phone Icon */}
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.7 3.1C5.9 1.8 8 2 9 3.5l1.2 1.8c.8 1.1.7 2.7-.3 3.7l-.2.3c-.4.4-.3.9-.1 1.4 1.4 1.5 2.3 1.9 2.7 2 .4.1.6-.1.6-.2l.4-.4c.9-.9 2.2-1.1 3.3-.5l1.9 1.1c1.6.9 2 3.2.7 4.6l-1.4 1.5c-.4.5-1 .9-1.7 1-1.8.2-6 0-10.4-4.7C3.1 12.6 2.3 8.8 2.2 7l.7-.1c-.1-.9.3-1.7.9-2.2l1.6-1.6z"/></svg>
                </div>
                <div>
                  <span className="block text-[10px] text-dark-4 leading-none">SUPPORT</span>
                  <p className="font-bold text-xs text-dark tracking-tight">7492-3477</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-5">
              <Link href="/signin" className="group flex items-center gap-2">
                <div className="text-blue group-hover:scale-110 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div className={stickyMenu ? 'hidden lg:block' : ''}>
                  <span className="block text-[10px] text-dark-4 uppercase leading-none">Account</span>
                  <p className="font-semibold text-xs">Sign In</p>
                </div>
              </Link>

              <button onClick={handleOpenCartModal} className="group flex items-center gap-2">
                <div className="relative text-blue group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <span className="flex items-center justify-center absolute -right-2 -top-2 bg-blue w-4.5 h-4.5 rounded-full text-white text-[10px] font-bold">
                    {product.length}
                  </span>
                </div>
                <div className={stickyMenu ? 'hidden lg:block' : ''}>
                  <span className="block text-[10px] text-dark-4 uppercase leading-none">Cart</span>
                  <p className="font-semibold text-xs">${totalPrice}</p>
                </div>
              </button>

              <button
                className="lg:hidden p-2 text-dark"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <div className="w-6 flex flex-col gap-1.5">
                  <span className={`h-0.5 w-full bg-current transition-all ${navigationOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`h-0.5 w-full bg-current transition-all ${navigationOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`h-0.5 w-full bg-current transition-all ${navigationOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Navigation Section --- */}
      <div className={`border-t border-gray-3 transition-all duration-300 ${stickyMenu ? 'bg-gray-50/80 backdrop-blur-sm' : ''}`}>
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            <nav className={`
              absolute right-4 top-full xl:static bg-white xl:bg-transparent shadow-xl xl:shadow-none rounded-b-lg xl:rounded-none overflow-hidden transition-all duration-300
              ${navigationOpen ? 'max-h-[500px] border xl:border-0' : 'max-h-0 xl:max-h-none'}
            `}>
              <ul className="flex flex-col xl:flex-row xl:items-center p-5 xl:p-0 gap-4 xl:gap-8">
                {menuData.map((menuItem, i) => (
                  <li key={i} className="group relative">
                    {menuItem.submenu ? (
                      <Dropdown menuItem={menuItem} stickyMenu={stickyMenu} />
                    ) : (
                      <Link
                        href={menuItem.path}
                        className={`text-sm font-semibold text-dark hover:text-blue transition-all relative
                          ${stickyMenu ? 'py-3' : 'py-5'} inline-block
                          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue after:transition-all hover:after:w-full
                        `}
                      >
                        {menuItem.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Links (Hidden on scroll for cleaner look) */}
            <div className={`hidden xl:flex items-center gap-6 text-sm font-medium ${stickyMenu ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'} transition-all duration-300`}>
                <Link href="#" className="hover:text-blue">Recently Viewed</Link>
                <Link href="/wishlist" className="hover:text-blue">Wishlist</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;