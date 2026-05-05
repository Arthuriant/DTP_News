"use client";
import React, { useState, useEffect } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertService } from "@/services/AlertService";

// 1. Interface yang disesuaikan dengan API Laravel
export interface ProductAPI {
  id: string;
  name: string;
  base_price: string;
  img: string;
  summary?: string;
  sub_category?: {
    name: string;
  };
}

const SingleListItem = ({ item }: { item: ProductAPI }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // STATE WISHLIST (Mengikuti logika SingleGridItem)
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // 2. Format harga dengan aman
  const priceNumber = parseFloat(item.base_price || "0");
  const formattedPrice = priceNumber.toLocaleString("id-ID");

  // 3. Konfigurasi path gambar
  const imageUrl = item.img 
    ? `http://localhost:8000/storage/${item.img}` 
    : "https://via.placeholder.com/220x220?text=No+Image";

  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  // Cek status wishlist saat komponen dimuat
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await fetch(`/api-fe/proxy/wishlist/check/${item.id}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setIsWishlisted(json.is_wishlisted);
        }
      } catch (err) {
        console.error("Gagal cek wishlist:", err);
      }
    };
    checkWishlist();
  }, [item.id]);

  const handleCustomize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    AlertService.success("Memuat Studio...", "Membuka ruang kustomisasi 3D untuk Anda.");
    router.push(`/Proto?productId=${item.id}`);
  };

  const handleItemToWishList = async (e: React.MouseEvent) => {
    // 👇 FIX UTAMA: Cegah aksi default dan hentikan propagasi 👇
    e.preventDefault();
    e.stopPropagation();
    
    setWishlistLoading(true);
    
    try {
      if (isWishlisted) {
        await fetch(`/api-fe/proxy/wishlist/${item.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        // Selesaikan update state React DULU
        setIsWishlisted(false);
        // Baru luncurkan Alert setelah UI stabil
        setTimeout(() => {
          AlertService.success("Dihapus", "Desain dihapus dari daftar impian Anda.");
        }, 100);
      } else {
        await fetch(`/api-fe/proxy/wishlist`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: item.id }),
        });
        // Selesaikan update state React DULU
        setIsWishlisted(true);
        // Baru luncurkan Alert setelah UI stabil
        setTimeout(() => {
          AlertService.success("Tersimpan!", "Desain berhasil ditambahkan ke daftar impian.");
        }, 100);
      }
    } catch (err) {
      console.error("Gagal toggle wishlist:", err);
      AlertService.error("Gagal", "Terjadi kesalahan koneksi. Coba lagi nanti.");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    // "group" dihilangkan dari sini untuk mengisolasi hover pada gambar saja
    <div className="flex flex-col sm:flex-row rounded-[1.25rem] bg-white border border-[#E5D7C1] shadow-[0_5px_15px_-5px_rgba(45,26,17,0.05)] hover:shadow-[0_15px_30px_-10px_rgba(197,160,89,0.2)] transition-all duration-500 overflow-hidden antialiased cursor-pointer">
      
      {/* ================= ETALASE GAMBAR (KIRI) ================= */}
      {/* 👇 "group" dipindahkan ke pembungkus gambar ini 👇 */}
      <div className="group relative overflow-hidden flex items-center justify-center sm:max-w-[280px] w-full min-h-[260px] sm:min-h-full border-b sm:border-b-0 sm:border-r border-[#E5D7C1]/50 bg-[#Fdfbf7]">
        
        {/* Tekstur Batik Tipis */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url('${brownBatikUrl}')`,
            backgroundSize: '150px',
            backgroundRepeat: 'repeat'
          }}
        ></div>

        <div className="absolute inset-0 bg-[#C5A059] blur-[60px] opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700 rounded-full w-2/3 h-2/3 m-auto pointer-events-none z-0"></div>

        {/* Gambar dimasukkan ke wrapper sendiri agar animasinya terisolasi */}
        <div className="relative z-10 w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out group-hover:scale-105 p-4">
          <Image 
            src={imageUrl} 
            alt={item.name || "Product"} 
            width={220} 
            height={220} 
            className="object-contain drop-shadow-[0_10px_20px_rgba(45,26,17,0.1)]"
          />
        </div>

        {/* Tombol Aksi Hover */}
        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-3 pb-6 transition-transform duration-500 ease-out group-hover:translate-y-0 z-20 px-4">
          <button
            onClick={handleCustomize}
            className="flex-grow max-w-[140px] flex items-center justify-center h-10 px-5 rounded-full shadow-lg backdrop-blur-md bg-white/90 border border-white/50 font-sans font-bold text-[10px] tracking-[0.15em] uppercase text-[#2D1A11] transition-all duration-300 hover:bg-[#2D1A11] hover:text-[#C5A059]"
          >
            Kustomisasi
          </button>

          <button
            onClick={handleItemToWishList}
            disabled={wishlistLoading}
            aria-label="tombol untuk pilih favorit"
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full shadow-lg backdrop-blur-md border transition-all duration-300 hover:-translate-y-1
              ${isWishlisted
                ? "bg-[#C5A059] border-[#C5A059] text-white"
                : "bg-white/90 border-white/50 text-[#2D1A11] hover:bg-[#C5A059] hover:text-[#Fdfbf7] hover:border-[#C5A059]"
              }`}
          >
            <svg className="fill-current w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.74949 2.94946C2.6435 3.45502 1.83325 4.65749 1.83325 6.0914C1.83325 7.55633 2.43273 8.68549 3.29211 9.65318C4.0004 10.4507 4.85781 11.1118 5.694 11.7564C5.89261 11.9095 6.09002 12.0617 6.28395 12.2146C6.63464 12.491 6.94747 12.7337 7.24899 12.9099C7.55068 13.0862 7.79352 13.1667 7.99992 13.1667C8.20632 13.1667 8.44916 13.0862 8.75085 12.9099C9.05237 12.7337 9.3652 12.491 9.71589 12.2146C9.90982 12.0617 10.1072 11.9095 10.3058 11.7564C11.142 11.1118 11.9994 10.4507 12.7077 9.65318C13.5671 8.68549 14.1666 7.55633 14.1666 6.0914C14.1666 4.65749 13.3563 3.45502 12.2503 2.94946C11.1759 2.45832 9.73214 2.58839 8.36016 4.01382C8.2659 4.11175 8.13584 4.16709 7.99992 4.16709C7.864 4.16709 7.73393 4.11175 7.63967 4.01382C6.26769 2.58839 4.82396 2.45832 3.74949 2.94946ZM7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ================= DESKRIPSI & HARGA (KANAN) ================= */}
      <div className="w-full flex flex-col justify-center py-6 px-6 sm:px-8 lg:px-10">
        
        {/* Kategori */}
        {item.sub_category && (
          <p className="font-sans text-[10px] text-[#8B7355] font-bold tracking-widest uppercase mb-1.5">
            {item.sub_category.name}
          </p>
        )}

        {/* Judul Produk */}
        <h3 className="font-serif font-medium text-xl md:text-2xl text-[#2D1A11] ease-out duration-300 hover:text-[#C5A059] mb-3">
          <Link href={`/shop-details/${item.id}`}> {item.name} </Link>
        </h3>

        {/* Summary */}
        <p className="font-sans text-sm text-[#8B7355] line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">
          {item.summary  || "Tidak ada deskripsi tersedia untuk produk ini."}
        </p>

        {/* Harga */}
        <div className="mt-auto flex items-end">
          <span className="font-serif font-bold text-2xl text-[#2D1A11]">
            Rp {formattedPrice}
          </span>
        </div>
        
      </div>
    </div>
  );
};

export default SingleListItem;