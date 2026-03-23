"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  return (
    <div className="group flex flex-col h-full">
      {/* ================= ETALASE GAMBAR (SQUARE) ================= */}
      <div className="relative overflow-hidden flex items-center justify-center rounded-[1.25rem] bg-white border border-[#E5D7C1] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.06)] min-h-[280px] aspect-square mb-5 transition-all duration-[800ms] group-hover:shadow-[0_20px_40px_-15px_rgba(197,160,89,0.25)] group-hover:border-[#C5A059]/50">
        
        {/* Tekstur Batik Tipis */}
        <div 
          className="absolute inset-0 z-0 opacity-5 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url('${brownBatikUrl}')`,
            backgroundSize: '150px',
            backgroundRepeat: 'repeat'
          }}
        ></div>

        {/* Cahaya Latar Emas saat Hover */}
        <div className="absolute inset-0 bg-[#C5A059] blur-[60px] opacity-0 group-hover:opacity-[0.12] transition-opacity duration-[1000ms] rounded-full w-2/3 h-2/3 m-auto pointer-events-none z-0"></div>

        <Image 
          src={item.imgs.previews[0]} 
          alt={item.title} 
          width={220} 
          height={220} 
          className="object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(45,26,17,0.1)] transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
        />

        {/* ================= TOMBOL AKSI KACA (MUNCUL DARI BAWAH) ================= */}
        <div className="absolute left-0 bottom-0 translate-y-[150%] w-full flex items-center justify-center gap-3 pb-6 ease-[cubic-bezier(0.25,1,0.5,1)] duration-700 group-hover:translate-y-0 z-20">
          
          {/* Quick View */}
          <button
            onClick={() => { handleQuickViewUpdate(); openModal(); }}
            aria-label="quick view"
            title="Lihat Detail"
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-[0_8px_20px_rgba(45,26,17,0.15)] backdrop-blur-md bg-white/80 border border-white/50 text-[#2D1A11] transition-all duration-300 hover:bg-[#2D1A11] hover:text-[#C5A059] hover:border-[#2D1A11] hover:-translate-y-1"
          >
            <svg className="fill-current w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666ZM2.57964 6.10786C3.66592 4.69661 5.43374 3.16666 8.00016 3.16666C10.5666 3.16666 12.3344 4.69661 13.4207 6.10786C13.7131 6.48772 13.8843 6.7147 13.997 6.9697C14.1023 7.20801 14.1668 7.49929 14.1668 8C14.1668 8.50071 14.1023 8.79199 13.997 9.0303C13.8843 9.28529 13.7131 9.51227 13.4207 9.89213C12.3344 11.3034 10.5666 12.8333 8.00016 12.8333C5.43374 12.8333 3.66592 11.3034 2.57964 9.89213C2.28725 9.51227 2.11599 9.28529 2.00334 9.0303C1.89805 8.79199 1.8335 8.50071 1.8335 8C1.8335 7.49929 1.89805 7.20801 2.00334 6.9697C2.11599 6.7147 2.28725 6.48772 2.57964 6.10786Z" />
            </svg>
          </button>

          {/* Add to Cart (Tengah, Sedikit Lebar) */}
          <button
            onClick={() => handleAddToCart()}
            aria-label="add to cart"
            title="Tambah ke Keranjang"
            style={{ transitionDelay: '50ms' }}
            className="flex items-center justify-center h-10 px-5 rounded-full shadow-[0_8px_20px_rgba(45,26,17,0.15)] backdrop-blur-md bg-white/80 border border-white/50 font-sans font-bold text-[9px] tracking-[0.2em] uppercase text-[#2D1A11] transition-all duration-300 hover:bg-[#2D1A11] hover:text-[#C5A059] hover:border-[#2D1A11] hover:-translate-y-1"
          >
            Beli
          </button>

          {/* Wishlist */}
          <button
            onClick={() => handleItemToWishList()}
            aria-label="button for favorite select"
            title="Tambah ke Favorit"
            style={{ transitionDelay: '100ms' }}
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-[0_8px_20px_rgba(45,26,17,0.15)] backdrop-blur-md bg-white/80 border border-white/50 text-[#2D1A11] transition-all duration-300 hover:bg-[#2D1A11] hover:text-[#C5A059] hover:border-[#2D1A11] hover:-translate-y-1"
          >
            <svg className="fill-current w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.74949 2.94946C2.6435 3.45502 1.83325 4.65749 1.83325 6.0914C1.83325 7.55633 2.43273 8.68549 3.29211 9.65318C4.0004 10.4507 4.85781 11.1118 5.694 11.7564C5.89261 11.9095 6.09002 12.0617 6.28395 12.2146C6.63464 12.491 6.94747 12.7337 7.24899 12.9099C7.55068 13.0862 7.79352 13.1667 7.99992 13.1667C8.20632 13.1667 8.44916 13.0862 8.75085 12.9099C9.05237 12.7337 9.3652 12.491 9.71589 12.2146C9.90982 12.0617 10.1072 11.9095 10.3058 11.7564C11.142 11.1118 11.9994 10.4507 12.7077 9.65318C13.5671 8.68549 14.1666 7.55633 14.1666 6.0914C14.1666 4.65749 13.3563 3.45502 12.2503 2.94946C11.1759 2.45832 9.73214 2.58839 8.36016 4.01382C8.2659 4.11175 8.13584 4.16709 7.99992 4.16709C7.864 4.16709 7.73393 4.11175 7.63967 4.01382C6.26769 2.58839 4.82396 2.45832 3.74949 2.94946ZM7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ================= DESKRIPSI & HARGA (DI BAWAH ETALASE) ================= */}
      <div className="px-2">
        {/* Bintang & Review */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <svg key={index} className="w-[10px] h-[10px] text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <span className="font-sans text-[9px] text-[#C5A059] font-semibold tracking-wider mt-0.5">({item.reviews})</span>
        </div>

        {/* Judul Produk */}
        <h3
          className="font-serif font-medium text-lg text-[#2D1A11] ease-out duration-300 hover:text-[#C5A059] mb-2 leading-snug line-clamp-1"
          onClick={() => handleProductDetails()}
        >
          <Link href="/shop-details"> {item.title} </Link>
        </h3>

        {/* Harga */}
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif font-bold text-xl text-[#2D1A11]">
            Rp {item.discountedPrice.toLocaleString('id-ID')}
          </span>
          {item.price > item.discountedPrice && (
            <span className="font-sans font-medium text-[10px] tracking-wider text-[#6B442A]/50 line-through">
              Rp {item.price.toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProductItem;