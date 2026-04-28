import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { CartService } from "@/services/CartService";
// 👇 Import updateCartItemQuantity dari Redux
import { removeItemFromCart, updateCartItemQuantity } from "@/redux/features/cart-slice";

const SingleItem = ({ item }: { item: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleting, setIsDeleting] = useState(false);
  
const quantity = item.quantity || 1;

  const handleRemoveFromCart = async () => {
    setIsDeleting(true);
    try {
      await CartService.removeItem(item.id);
      dispatch(removeItemFromCart(item.id));
    } catch (error) {
      console.error("Gagal menghapus dari database", error);
      setIsDeleting(false); 
    }
  };

  const handleIncreaseQuantity = async () => {
    const newQty = quantity + 1;
    // Update Redux
    dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
    // Update Database
    try {
      await CartService.updateQuantity(item.id, newQty);
    } catch (error) {
      console.error("Gagal update kuantiti", error);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
      try {
        await CartService.updateQuantity(item.id, newQty);
      } catch (error) {
        console.error("Gagal update kuantiti", error);
      }
    }
  };
  // Hitung total harga berdasarkan kuantiti saat ini
  const itemTotalPrice = Number(item.discountedPrice) * quantity;

  return (
    <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#D9B35A]/20 bg-white shadow-sm transition-all ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      <div className="w-full flex items-center gap-5">
        
        {/* WADAH GAMBAR */}
        <div className="flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 min-w-[75px] w-[75px] h-[75px] overflow-hidden relative flex-shrink-0">
          {item.imgs?.thumbnails?.[0] ? (
            <Image
              src={item.imgs.thumbnails[0]}
              alt="product"
              layout="fill"
              objectFit="cover"
              unoptimized
            />
          ) : (
            <div className="text-[10px] text-gray-400">No Image</div>
          )}
        </div>

        {/* INFO PRODUK & KUSTOMISASI */}
        <div className="flex-1">
          <h3 className="font-bold text-[#2D1A11] text-sm mb-1.5 leading-tight line-clamp-2 ease-out duration-200 hover:text-[#D9B35A]">
            <a href="#"> {item.title} </a>
          </h3>

          {/* 👇 HARGA & KONTROL KUANTITI 👇 */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#8B7355] font-bold">
              Rp {itemTotalPrice.toLocaleString('id-ID')}
            </p>

            {/* Tombol Plus Minus */}
            <div className="flex items-center border border-[#D9B35A]/30 rounded-lg overflow-hidden bg-[#FFFDF5] shadow-sm">
              <button
                onClick={handleDecreaseQuantity}
                className="w-6 h-6 flex items-center justify-center text-[#8B7355] hover:bg-[#D9B35A]/20 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center text-[11px] font-bold text-[#2D1A11]">
                {quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                className="w-6 h-6 flex items-center justify-center text-[#8B7355] hover:bg-[#D9B35A]/20 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
          {/* 👆 BATAS HARGA & KONTROL KUANTITI 👆 */}

          {/* DETAIL KUSTOMISASI */}
          {item.customizations && (
            <div className="flex flex-col gap-1.5 bg-[#FFFDF5] p-2 rounded-lg border border-[#D9B35A]/10 mt-1">
              {item.customizations.size && (
                <span className="text-[9px] text-[#8B7355] uppercase font-bold tracking-widest flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#D9B35A]"></span>
                  Ukuran: {item.customizations.size}
                </span>
              )}
              {item.customizations.colors?.body && (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#8B7355] uppercase font-bold tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#D9B35A]"></span>
                    Warna Utama:
                  </span>
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: item.customizations.colors.body }}
                    title={`Hex: ${item.customizations.colors.body}`}
                  ></span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* TOMBOL HAPUS */}
      <button
        onClick={handleRemoveFromCart}
        disabled={isDeleting}
        aria-label="button for remove product from cart"
        className="flex items-center justify-center rounded-full w-9 h-9 bg-red-50 text-red-400 ease-out duration-200 hover:bg-red-500 hover:text-white transition-all flex-shrink-0 ml-1"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};

export default SingleItem;