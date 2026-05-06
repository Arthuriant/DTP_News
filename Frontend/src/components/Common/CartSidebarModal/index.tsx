"use client";
import React, { useEffect } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { selectTotalPrice, addItemToCart } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";
import { CartService } from "@/services/CartService"; 
import { setCartItems } from "@/redux/features/cart-slice";


const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();

  // 1. Fetch data dari Laravel saat Sidebar dibuka atau halaman di-refresh
  useEffect(() => {
    const fetchDbCart = async () => {
      // Sidebar hanya mengambil data jika Redux benar-benar kosong (0)
      if (cartItems.length === 0) {
        try {
          const res = await CartService.getCart();
          const dbItems = res?.items || res || []; 
          
          const formattedItems = dbItems.map((dbItem: any) => {
          
            let finalImageUrl = "";
            const previewData = dbItem.custom_configuration?.image_preview;
            if (previewData) {
              // Jika datanya sudah berupa full URL (http) atau Base64, biarkan saja
              if (previewData.startsWith("http") || previewData.startsWith("data:image")) {
                finalImageUrl = previewData;
              } else {
                finalImageUrl = `http://127.0.0.1:8000/storage/${previewData}`;
              }
            } else if (dbItem.product?.img) {
              finalImageUrl = `http://127.0.0.1:8000/storage/${dbItem.product.img}`;
            }
            return {
              id: dbItem.id, 
              product_id: dbItem.product_id,
              title: `Kustom ${dbItem.product?.name || 'Produk'}`,
              price: dbItem.price,
              discountedPrice: dbItem.price,
              quantity: dbItem.qty,
              imgs: {
                thumbnails: [finalImageUrl],
                previews: [finalImageUrl]
              },
              customizations: dbItem.custom_configuration
            };
          });
          dispatch(setCartItems(formattedItems));
        } catch (error) {
          console.error("Gagal mengambil keranjang sidebar:", error);
        }
      }
    };

    fetchDbCart();
  }, [dispatch]);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!event.target.closest(".modal-content")) {
        closeCartModal();
      }
    }
    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-[99999] overflow-y-auto no-scrollbar w-full h-screen bg-[#2D1A11]/70 backdrop-blur-sm ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end">
        <div className="w-full max-w-[500px] shadow-2xl bg-[#FFFDF5] px-4 sm:px-7.5 lg:px-11 relative modal-content h-screen flex flex-col">
          
          <div className="sticky top-0 bg-[#FFFDF5] flex items-center justify-between pb-7 pt-4 sm:pt-7.5 border-b border-[#D9B35A]/30 mb-7.5 z-10">
            <h2 className="font-bold text-[#2D1A11] text-lg sm:text-2xl flex items-center gap-2">
              <span className="text-[#D9B35A]">✧</span> Keranjang Anda
            </h2>
            <button
              onClick={() => closeCartModal()}
              aria-label="button for close modal"
              className="flex items-center justify-center p-2 rounded-full ease-in duration-150 bg-[#D9B35A]/10 text-[#8B7355] hover:bg-[#D9B35A]/20 hover:text-[#2D1A11] transition-all"
            >
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z" fill=""/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
  <div className="flex flex-col gap-6">
    {cartItems.length > 0 ? (
      // Hapus 'key' dari parameter map jika tidak digunakan lagi
      cartItems.map((item) => (
        // Gunakan item.id sebagai identitas unik komponen
        <SingleItem key={item.id} item={item} />
      ))
    ) : (
      <EmptyCart />
    )}
  </div>
</div>

          <div className="border-t border-[#D9B35A]/30 bg-[#FFFDF5] pt-5 pb-8 mt-auto sticky bottom-0">
            <div className="flex items-center justify-between gap-5 mb-6 px-2">
              <p className="font-bold text-lg text-[#8B7355] uppercase tracking-widest text-[11px]">Subtotal:</p>
              <p className="font-bold text-2xl text-[#2D1A11]">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                onClick={() => closeCartModal()}
                href="/cart"
                className="w-full flex justify-center font-bold text-[#8B7355] bg-white border border-[#D9B35A]/50 py-[13px] px-6 rounded-full ease-out duration-200 hover:border-[#D9B35A] hover:shadow-md text-sm uppercase tracking-widest transition-all"
              >
                Lihat Cart
              </Link>

              <Link
                href="/checkout"
                className="w-full flex justify-center font-bold text-[#1A1A1A] bg-gradient-to-r from-[#EAC135] to-[#DFB121] py-[13px] px-6 rounded-full ease-out duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20 text-sm uppercase tracking-widest transition-all"
              >
                Checkout
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;