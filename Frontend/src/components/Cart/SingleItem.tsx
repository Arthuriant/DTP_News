"use client";
import React, { useState } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeItemFromCart, updateCartItemQuantity } from "@/redux/features/cart-slice";
import Image from "next/image";
import { CartService } from "@/services/CartService";
import { AlertService } from "@/services/AlertService"; // 👈 Import AlertService ditambahkan

const SingleItem = ({ item }: { item: any }) => {
  const quantity = item.quantity || 1; 
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = async () => {
    // 👇 Menggunakan AlertService untuk konfirmasi 👇
    const isConfirmed = await AlertService.confirm(
      "Hapus dari Keranjang?",
      "Apakah Anda yakin ingin menghapus desain tas ini dari keranjang belanja?",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await CartService.removeItem(item.id);
        dispatch(removeItemFromCart(item.id));
        
        // Memunculkan notifikasi sukses (opsional, karena item biasanya langsung hilang dari UI)
        AlertService.success("Terhapus!", "Desain berhasil dihapus dari keranjang.");
      } catch (error) {
        console.error("Gagal menghapus item:", error);
        // Menggunakan AlertService untuk error
        AlertService.error("Gagal Menghapus", "Terjadi kesalahan koneksi ke server.");
        setIsDeleting(false);
      }
    }
  };

  const handleIncreaseQuantity = async () => {
    const newQty = quantity + 1;
    dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
    try {
      await CartService.updateQuantity(item.id, newQty);
    } catch (error) {
      console.error("Gagal update kuantiti di server", error);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
      try {
        await CartService.updateQuantity(item.id, newQty);
      } catch (error) {
        console.error("Gagal update kuantiti di server", error);
      }
    }
  };

  return (
    <div className={`flex items-center border-b border-[#D9B35A]/20 py-5 px-7.5 transition-all ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      
      {/* PRODUK & INFO */}
      <div className="min-w-[400px]">
        <div className="flex items-center gap-5.5">
          <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-[#F9F6EE] w-[90px] h-[90px] overflow-hidden relative">
            {item.imgs?.thumbnails?.[0] ? (
               <Image src={item.imgs.thumbnails[0]} layout="fill" objectFit="cover" alt="product" unoptimized />
            ) : (
               <div className="text-[10px] text-gray-400">No Image</div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-[#2D1A11] mb-1 ease-out duration-200 hover:text-[#D9B35A]">
              <a href="#"> {item.title} </a>
            </h3>
            
            {/* DETAIL KUSTOMISASI */}
            {item.customizations && (
              <div className="mt-1 flex flex-col gap-1">
                {item.customizations.size && (
                  <span className="text-[10px] text-[#8B7355] uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9B35A]"></span>
                    Ukuran: {item.customizations.size}
                  </span>
                )}
                {item.customizations.colors?.body && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8B7355] uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9B35A]"></span>
                      Warna Utama:
                    </span>
                    <span 
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: item.customizations.colors.body }}
                      title={`Hex: ${item.customizations.colors.body}`}
                    ></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HARGA */}
      <div className="min-w-[180px]">
        <p className="font-bold text-[#8B7355]">Rp {Number(item.discountedPrice).toLocaleString('id-ID')}</p>
      </div>

      {/* KUANTITAS */}
      <div className="min-w-[275px] flex justify-center">
        <div className="w-max flex items-center rounded-full border border-[#D9B35A]/30 bg-[#FFFDF5] shadow-sm">
          <button
            onClick={handleDecreaseQuantity}
            className="flex items-center justify-center w-10 h-10 rounded-l-full text-[#8B7355] ease-out duration-200 hover:bg-[#D9B35A]/20 hover:text-[#2D1A11]"
          >
            -
          </button>
          <span className="flex items-center justify-center w-12 h-10 text-[13px] font-bold text-[#2D1A11]">
            {quantity}
          </span>
          <button
            onClick={handleIncreaseQuantity}
            className="flex items-center justify-center w-10 h-10 rounded-r-full text-[#8B7355] ease-out duration-200 hover:bg-[#D9B35A]/20 hover:text-[#2D1A11]"
          >
            +
          </button>
        </div>
      </div>

      {/* SUBTOTAL */}
      <div className="min-w-[200px]">
        <p className="font-bold text-[#2D1A11]">Rp {(Number(item.discountedPrice) * quantity).toLocaleString('id-ID')}</p>
      </div>

      {/* AKSI HAPUS */}
      <div className="min-w-[50px] flex justify-end">
        <button
          onClick={handleRemoveFromCart}
          disabled={isDeleting}
          className="flex items-center justify-center rounded-full w-10 h-10 bg-red-50 text-red-400 ease-out duration-200 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
      
    </div>
  );
};

export default SingleItem;