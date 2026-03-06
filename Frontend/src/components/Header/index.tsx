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

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 transition-all duration-300 ${
        stickyMenu 
          ? "bg-white/80 backdrop-blur-md shadow-lg py-2" 
          : "bg-white/95 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* Header top */}
        <div className="flex flex-col lg:flex-row gap-3 items-end lg:items-center xl:justify-between">
          
          {/* Left section */}
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-3 sm:gap-6">
            <Link className="flex-shrink-0" href="/">
              <Image
                src="/images/logo/logo1.png"
                alt="Logo"
                width={160}
                height={26}
                className="w-auto h-7"
              />
            </Link>

            <div className="max-w-[400px] w-full">
              <form>
                <div className="flex items-center">
                  <div className="relative w-full">
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      name="search"
                      id="search"
                      placeholder="Pencarian produk..."
                      autoComplete="off"
                      className="w-full rounded-full bg-gray-100 border border-gray-200 py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                    <button
                      aria-label="Search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                      >
                        <path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right section */}
          <div className="flex w-full lg:w-auto items-center justify-between lg:justify-end gap-4">
            
            {/* Contact (hidden on mobile) */}
            <div className="hidden xl:flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-600"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.7177 3.09215C5.94388 1.80121 7.9721 2.04307 8.98569 3.47665L10.2467 5.26014C11.0574 6.4068 10.9889 8.00097 10.0214 9.01965L9.7765 9.27743C9.77582 9.27921 9.7751 9.28115 9.77436 9.28323C9.76142 9.31959 9.7287 9.43538 9.7609 9.65513C9.82765 10.1107 10.1793 11.0364 11.607 12.5394C13.0391 14.0472 13.9078 14.4025 14.3103 14.4679C14.484 14.4961 14.5748 14.4716 14.6038 14.4614L15.0124 14.0312C15.8862 13.1113 17.2485 12.9301 18.347 13.5623L20.2575 14.662C21.8904 15.6019 22.2705 17.9011 20.9655 19.275L19.545 20.7705C19.1016 21.2373 18.497 21.6358 17.75 21.7095C15.9261 21.8895 11.701 21.655 7.27161 16.9917C3.13844 12.6403 2.35326 8.85538 2.25401 7.00615L2.92011 6.9704L2.25401 7.00615C2.20497 6.09248 2.61224 5.30879 3.1481 4.74464L4.7177 3.09215ZM7.7609 4.34262C7.24855 3.61797 6.32812 3.57473 5.80528 4.12518L4.23568 5.77767C3.90429 6.12656 3.73042 6.52646 3.75185 6.92576C3.83289 8.43558 4.48307 11.8779 8.35919 15.9587C12.4234 20.2375 16.1676 20.3584 17.6026 20.2167C17.8864 20.1887 18.1783 20.0313 18.4574 19.7375L19.8779 18.2419C20.4907 17.5968 20.3301 16.4345 19.5092 15.962L17.5987 14.8624C17.086 14.5673 16.4854 14.6584 16.1 15.0642L15.6445 15.5437L15.1174 15.043C15.6445 15.5438 15.6438 15.5445 15.6432 15.5452L15.6417 15.5467L15.6388 15.5498L15.6324 15.5562L15.6181 15.5704C15.6078 15.5803 15.5959 15.5913 15.5825 15.6031C15.5556 15.6266 15.5223 15.6535 15.4824 15.6819C15.4022 15.7387 15.2955 15.8012 15.1606 15.8544C14.8846 15.9633 14.5201 16.0216 14.0699 15.9485C13.1923 15.806 12.0422 15.1757 10.5194 13.5724C8.99202 11.9644 8.40746 10.7647 8.27675 9.87259C8.21022 9.41852 8.26346 9.05492 8.36116 8.78035C8.40921 8.64533 8.46594 8.53766 8.51826 8.4559C8.54435 8.41514 8.56922 8.381 8.5912 8.35322C8.60219 8.33933 8.61246 8.32703 8.62182 8.31627L8.63514 8.30129L8.64125 8.29465L8.64415 8.29154L8.64556 8.29004C8.64625 8.28931 8.64694 8.28859 9.17861 8.79357L8.64695 8.28858L8.93376 7.98662C9.3793 7.51755 9.44403 6.72317 9.02189 6.1261L7.7609 4.34262Z"
                  fill="currentColor"
                />
              </svg>
              <div className="text-xs">
                <span className="text-gray-500">Hubungi</span>
                <p className="font-medium text-gray-800">(+62) 878-1276-6865</p>
              </div>
            </div>

            <span className="hidden xl:block w-px h-5 bg-gray-300"></span>

            {/* Account & Cart */}
            <div className="flex items-center gap-3">
              <Link href="/signin" className="flex items-center gap-1.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue-600"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25ZM4.75001 17.5C4.75001 16.6487 5.37139 15.7251 6.71085 14.9717C8.02681 14.2315 9.89529 13.75 12 13.75C14.1047 13.75 15.9732 14.2315 17.2892 14.9717C18.6286 15.7251 19.25 16.6487 19.25 17.5C19.25 18.8078 19.2097 19.544 18.5264 20.1004C18.1559 20.4022 17.5365 20.6967 16.4762 20.9113C15.4193 21.1252 13.9742 21.25 12 21.25C10.0258 21.25 8.58075 21.1252 7.5238 20.9113C6.46354 20.6967 5.84413 20.4022 5.4736 20.1004C4.79033 19.544 4.75001 18.8078 4.75001 17.5Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="hidden sm:block">
                  <span className="text-2xs text-gray-500 uppercase">Akun</span>
                  <p className="text-xs font-medium text-gray-800">Masuk</p>
                </div>
              </Link>

              <button
                onClick={handleOpenCartModal}
                className="flex items-center gap-1.5"
              >
                <span className="relative">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-blue-600"
                  >
                    <path
                      d="M15.5433 9.5172C15.829 9.21725 15.8174 8.74252 15.5174 8.45686C15.2175 8.17119 14.7428 8.18277 14.4571 8.48272L12.1431 10.9125L11.5433 10.2827C11.2576 9.98277 10.7829 9.97119 10.483 10.2569C10.183 10.5425 10.1714 11.0173 10.4571 11.3172L11.6 12.5172C11.7415 12.6658 11.9378 12.75 12.1431 12.75C12.3483 12.75 12.5446 12.6658 12.6862 12.5172L15.5433 9.5172Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153C5.66124 5.29706 5.6648 5.33321 5.66809 5.36996L17.1203 5.36996C17.9389 5.36995 18.7735 5.36993 19.4606 5.44674C19.8103 5.48584 20.1569 5.54814 20.4634 5.65583C20.7639 5.76141 21.0942 5.93432 21.3292 6.23974C21.711 6.73613 21.7777 7.31414 21.7416 7.90034C21.7071 8.45845 21.5686 9.15234 21.4039 9.97723L21.3935 10.0295L21.3925 10.0341L20.8836 12.5033C20.7339 13.2298 20.6079 13.841 20.4455 14.3231C20.2731 14.8346 20.0341 15.2842 19.6076 15.6318C19.1811 15.9793 18.6925 16.1226 18.1568 16.1882C17.6518 16.25 17.0278 16.25 16.2862 16.25L10.8804 16.25C9.53464 16.25 8.44479 16.25 7.58656 16.1283C6.69032 16.0012 5.93752 15.7285 5.34366 15.1022C4.79742 14.526 4.50529 13.9144 4.35897 13.0601C4.22191 12.2598 4.20828 11.2125 4.20828 9.75996V7.03832C4.20828 6.29837 4.20726 5.80316 4.16611 5.42295C4.12678 5.0596 4.05708 4.87818 3.96682 4.74609C3.87876 4.61723 3.74509 4.4968 3.44186 4.34802C3.11902 4.18961 2.68026 4.03406 2.01266 3.79934L1.75145 3.7075C1.36068 3.57012 1.15527 3.14197 1.29266 2.7512ZM5.70828 6.86996L5.70828 9.75996C5.70828 11.249 5.72628 12.1578 5.83744 12.8068C5.93933 13.4018 6.11202 13.7324 6.43219 14.0701C6.70473 14.3576 7.08235 14.5418 7.79716 14.6432C8.53783 14.7482 9.5209 14.75 10.9377 14.75H16.2406C17.0399 14.75 17.5714 14.7487 17.9746 14.6993C18.3573 14.6525 18.5348 14.571 18.66 14.469C18.7853 14.3669 18.9009 14.2095 19.024 13.8441C19.1537 13.4592 19.2623 12.9389 19.4237 12.156L19.9225 9.73591L19.9229 9.73369C20.1005 8.84376 20.217 8.2515 20.2444 7.80793C20.2704 7.38648 20.2043 7.23927 20.1429 7.15786C20.1367 7.15259 20.0931 7.11565 19.9661 7.07101C19.8107 7.01639 19.5895 6.97049 19.2939 6.93745C18.6991 6.87096 17.9454 6.86996 17.089 6.86996H5.70828Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.2502 19.5C5.2502 20.7426 6.25756 21.75 7.5002 21.75C8.74285 21.75 9.7502 20.7426 9.7502 19.5C9.7502 18.2573 8.74285 17.25 7.5002 17.25C6.25756 17.25 5.2502 18.2573 5.2502 19.5ZM7.5002 20.25C7.08599 20.25 6.7502 19.9142 6.7502 19.5C6.7502 19.0857 7.08599 18.75 7.5002 18.75C7.91442 18.75 8.2502 19.0857 8.2502 19.5C8.2502 19.9142 7.91442 20.25 7.5002 20.25Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.25 19.5001C14.25 20.7427 15.2574 21.7501 16.5 21.7501C17.7426 21.7501 18.75 20.7427 18.75 19.5001C18.75 18.2574 17.7426 17.2501 16.5 17.2501C15.2574 17.2501 14.25 18.2574 14.25 19.5001ZM16.5 20.2501C16.0858 20.2501 15.75 19.9143 15.75 19.5001C15.75 19.0859 16.0858 18.7501 16.5 18.7501C16.9142 18.7501 17.25 19.0859 17.25 19.5001C17.25 19.9143 16.9142 20.2501 16.5 20.2501Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="absolute -right-2 -top-2 flex items-center justify-center bg-blue-600 text-white text-[10px] font-medium w-4 h-4 rounded-full">
                    {product.length}
                  </span>
                </span>
                <div className="hidden sm:block">
                  <span className="text-2xs text-gray-500 uppercase">Keranjang</span>
                  <p className="text-xs font-medium text-gray-800">
                    Rp{totalPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              </button>
            </div>

            {/* Hamburger */}
            <button
              className="xl:hidden block"
              onClick={() => setNavigationOpen(!navigationOpen)}
              aria-label="Toggle menu"
            >
              <span className="block relative w-5 h-5">
                <span className="du-block absolute right-0 w-full h-full">
                  <span
                    className={`block absolute top-0 left-0 bg-gray-700 rounded-sm w-full h-0.5 transition-all duration-200 ${
                      navigationOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span
                    className={`block absolute top-1/2 left-0 -mt-0.5 bg-gray-700 rounded-sm w-full h-0.5 transition-all duration-200 ${
                      navigationOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span
                    className={`block absolute bottom-0 left-0 bg-gray-700 rounded-sm w-full h-0.5 transition-all duration-200 ${
                      navigationOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                </span>
                <span className="block absolute right-0 w-full h-full rotate-45">
                  <span
                    className={`block absolute left-1/2 top-0 -ml-0.5 bg-gray-700 rounded-sm w-0.5 h-full transition-all duration-200 ${
                      navigationOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></span>
                  <span
                    className={`block absolute left-0 top-1/2 -mt-0.5 bg-gray-700 rounded-sm w-full h-0.5 transition-all duration-200 ${
                      navigationOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-200/50 mt-2">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            <div
              className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto xl:block ${
                navigationOpen
                  ? 'block bg-white/95 backdrop-blur-md shadow-lg rounded-md p-4 mt-2'
                  : 'hidden xl:block'
              }`}
            >
              <nav>
                <ul className="flex xl:items-center flex-col xl:flex-row gap-3 xl:gap-5">
                  {menuData.map((menuItem, i) =>
                    menuItem.submenu ? (
                      <Dropdown
                        key={i}
                        menuItem={menuItem}
                        stickyMenu={stickyMenu}
                      />
                    ) : (
                      <li key={i} className="group relative">
                        <Link
                          href={menuItem.path}
                          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors block py-1"
                          onClick={() => setNavigationOpen(false)}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;