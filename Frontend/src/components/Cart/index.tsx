"use client";
import React, { useEffect, useState } from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { CartService } from "@/services/CartService";
import { addItemToCart, updateCartItemQuantity } from "@/redux/features/cart-slice";
import { setCartItems } from "@/redux/features/cart-slice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dari database saat halaman keranjang dimuat
  useEffect(() => {
    const fetchDbCart = async () => {
      try {
        setIsLoading(true);
        const res = await CartService.getCart();
        const dbItems = res?.items || res || []; 
        
        const formattedItems = dbItems.map((dbItem: any) => ({
          id: dbItem.id, 
          product_id: dbItem.product_id,
          title: `Kustom ${dbItem.product?.name || 'Produk'}`,
          price: dbItem.price,
          discountedPrice: dbItem.price,
          quantity: dbItem.qty,
          imgs: {
            thumbnails: [dbItem.image_preview || dbItem.product?.gallery?.[0] || ""],
            previews: [dbItem.image_preview || dbItem.product?.gallery?.[0] || ""]
          },
          customizations: dbItem.custom_configuration
        }));

        // 👇 KUNCI PERBAIKAN: HAPUS FOREACH, GANTI JADI 1 BARIS INI 👇
        // Menggunakan setCartItems akan menimpa Redux dengan angka pasti dari database (misal: 2)
        dispatch(setCartItems(formattedItems));

      } catch (error) {
        console.error("Gagal mengambil data keranjang:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDbCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 Biarkan kurung siku KOSONG agar hanya berjalan 1 kali

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D9B35A]"></div>
      </div>
    );
  }

  return (
    <>
      <section>
        <Breadcrumb title={"Keranjang Anda"} pages={["Cart"]} />
      </section>
      
      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-20 bg-[#F9F6EE]">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-bold text-[#2D1A11] text-2xl flex items-center gap-2">
                 <span className="text-[#D9B35A]">✧</span> Keranjang Belanja
              </h2>
              <button className="text-[#8B7355] hover:text-[#D9B35A] font-medium transition-colors underline decoration-[#D9B35A]/30 underline-offset-4">
                Bersihkan Keranjang
              </button>
            </div>

            <div className="bg-[#FFFDF5] rounded-2xl shadow-sm border border-[#D9B35A]/20">
              <div className="w-full overflow-x-auto no-scrollbar">
                <div className="min-w-[1170px]">
                  {/* */}
                  <div className="flex items-center py-5.5 px-7.5 border-b border-[#D9B35A]/30 bg-[#D9B35A]/5 rounded-t-2xl">
                    <div className="min-w-[400px]">
                      <p className="font-bold text-[#8B7355] text-xs uppercase tracking-widest">Produk</p>
                    </div>
                    <div className="min-w-[180px]">
                      <p className="font-bold text-[#8B7355] text-xs uppercase tracking-widest">Harga</p>
                    </div>
                    <div className="min-w-[275px]">
                      <p className="font-bold text-[#8B7355] text-xs uppercase tracking-widest text-center">Kuantitas</p>
                    </div>
                    <div className="min-w-[200px]">
                      <p className="font-bold text-[#8B7355] text-xs uppercase tracking-widest">Subtotal</p>
                    </div>
                    <div className="min-w-[50px]">
                      <p className="font-bold text-[#8B7355] text-xs uppercase tracking-widest text-right">Aksi</p>
                    </div>
                  </div>

                  {/* */}
                  {cartItems.map((item, key) => (
                    <SingleItem item={item} key={key} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <Discount />
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-[#F9F6EE]">
          <div className="text-center mt-8">
            <div className="mx-auto pb-7.5">
              <svg className="mx-auto" width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#D9B35A" fillOpacity="0.1" />
                <path fillRule="evenodd" clipRule="evenodd" d="M36.1693 36.2421C35.6126 36.0565 35.0109 36.3574 34.8253 36.9141C34.6398 37.4707 34.9406 38.0725 35.4973 38.258L35.8726 38.3831C36.8308 38.7025 37.4644 38.9154 37.9311 39.1325C38.373 39.3381 38.5641 39.5036 38.6865 39.6734C38.809 39.8433 38.9055 40.0769 38.9608 40.5612C39.0192 41.0726 39.0208 41.7409 39.0208 42.751L39.0208 46.5361C39.0208 48.4735 39.0207 50.0352 39.1859 51.2634C39.3573 52.5385 39.7241 53.6122 40.5768 54.4649C41.4295 55.3176 42.5032 55.6844 43.7783 55.8558C45.0065 56.0209 46.5681 56.0209 48.5055 56.0209H59.9166C60.5034 56.0209 60.9791 55.5452 60.9791 54.9584C60.9791 54.3716 60.5034 53.8959 59.9166 53.8959H48.5833C46.5498 53.8959 45.1315 53.8936 44.0615 53.7498C43.022 53.61 42.4715 53.3544 42.0794 52.9623C41.9424 52.8253 41.8221 52.669 41.7175 52.4792H55.7495C56.3846 52.4792 56.9433 52.4793 57.4072 52.4292C57.9093 52.375 58.3957 52.2546 58.8534 51.9528C59.3111 51.651 59.6135 51.2513 59.8611 50.8111C60.0898 50.4045 60.3099 49.891 60.56 49.3072L61.2214 47.7641C61.766 46.4933 62.2217 45.4302 62.4498 44.5655C62.6878 43.6634 62.7497 42.7216 62.1884 41.8704C61.627 41.0191 60.737 40.705 59.8141 40.5684C58.9295 40.4374 57.7729 40.4375 56.3903 40.4375L41.0845 40.4375C41.0806 40.3979 41.0765 40.3588 41.0721 40.3201C40.9937 39.6333 40.8228 39.0031 40.4104 38.4309C39.998 37.8588 39.4542 37.4974 38.8274 37.2058C38.2377 36.9315 37.4879 36.6816 36.6005 36.3858L36.1693 36.2421ZM41.1458 42.5625C41.1458 42.6054 41.1458 42.6485 41.1458 42.692L41.1458 46.4584C41.1458 48.1187 41.1473 49.3688 41.2262 50.3542H55.6975C56.4 50.3542 56.8429 50.3528 57.1791 50.3165C57.4896 50.2829 57.6091 50.2279 57.6836 50.1787C57.7582 50.1296 57.8559 50.0415 58.009 49.7692C58.1748 49.4745 58.3506 49.068 58.6273 48.4223L59.2344 47.0057C59.8217 45.6355 60.2119 44.7177 60.3951 44.0235C60.5731 43.3488 60.4829 43.1441 60.4143 43.0401C60.3458 42.9362 60.1931 42.7727 59.5029 42.6705C58.7927 42.5653 57.7954 42.5625 56.3047 42.5625H41.1458Z" fill="#D9B35A"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M40.4375 60.625C40.4375 62.3855 41.8646 63.8125 43.625 63.8125C45.3854 63.8125 46.8125 62.3855 46.8125 60.625C46.8125 58.8646 45.3854 57.4375 43.625 57.4375C41.8646 57.4375 40.4375 58.8646 40.4375 60.625ZM43.625 61.6875C43.0382 61.6875 42.5625 61.2118 42.5625 60.625C42.5625 60.0382 43.0382 59.5625 43.625 59.5625C44.2118 59.5625 44.6875 60.0382 44.6875 60.625C44.6875 61.2118 44.2118 61.6875 43.625 61.6875Z" fill="#D9B35A"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M56.375 63.8126C54.6146 63.8126 53.1875 62.3856 53.1875 60.6251C53.1875 58.8647 54.6146 57.4376 56.375 57.4376C58.1354 57.4376 59.5625 58.8647 59.5625 60.6251C59.5625 62.3856 58.1354 63.8126 56.375 63.8126ZM55.3125 60.6251C55.3125 61.212 55.7882 61.6876 56.375 61.6876C56.9618 61.6876 57.4375 61.212 57.4375 60.6251C57.4375 60.0383 56.9618 59.5626 56.375 59.5626C55.7882 59.5626 55.3125 60.0383 55.3125 60.6251Z" fill="#D9B35A"/>
              </svg>
            </div>
            <p className="pb-6 text-[#8B7355] font-medium text-lg">Keranjang Anda masih kosong!</p>
            <Link
              href="/shop"
              className="w-96 mx-auto flex justify-center font-bold text-[#1A1A1A] bg-gradient-to-r from-[#EAC135] to-[#DFB121] py-[13px] px-6 rounded-full ease-out duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20 uppercase tracking-widest"
            >
              Mulai Belanja
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;