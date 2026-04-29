"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cart-slice";
import { OrderService } from "@/services/OrderService";

import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // 1. Ambil data asli dari Keranjang Redux
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. Hitung Total yang Akurat
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (Number(item.discountedPrice) * Number(item.quantity || 1));
  }, 0);
  
  const shippingCost = 15000; // Contoh ongkir statis (Nanti bisa dinamis dari ShippingMethod)
  const total = subtotal + shippingCost;

  // 3. Fungsi Submit ke Laravel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh
    
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }

    setIsProcessing(true);

    try {
      // Panggil API Checkout yang sudah kita buat
      const response = await OrderService.checkout({
        shipping_address: "Alamat dari Form Billing/Shipping (Sementara Statis)", // Nanti kita hubungkan ke form
        payment_method: "Bank Transfer BCA", // Nanti kita hubungkan ke PaymentMethod
      });

      // Kosongkan keranjang setelah berhasil
      dispatch(clearCart());

      // Lempar pembeli ke Halaman Sukses membawa ID Pesanannya
      router.push(`/order/success/${response.order_id}`);

    } catch (error: any) {
      console.error("Gagal checkout:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat memproses pesanan.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* 👇 Hubungkan form dengan fungsi handleSubmit 👇 */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              
              {/* ================= KOLOM KIRI (FORM) ================= */}
              <div className="lg:max-w-[670px] w-full">
                <Login />
                <Billing />
                <Shipping />

                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5 font-medium text-dark">
                      Catatan Tambahan (opsional)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Contoh: Pesan khusus atau instruksi pengiriman."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* ================= KOLOM KANAN (RINGKASAN & SUBMIT) ================= */}
              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Ringkasan Pesanan</h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Produk</h4>
                      <h4 className="font-medium text-dark text-right">Subtotal</h4>
                    </div>

                    {/* 👇 Menampilkan Data Asli dari Keranjang 👇 */}
                    {cartItems.map((item, index) => {
                      const itemSubtotal = Number(item.discountedPrice) * Number(item.quantity || 1);
                      return (
                        <div key={index} className="flex items-center justify-between py-5 border-b border-gray-3">
                          <div className="pr-4">
                            <p className="text-dark line-clamp-1">{item.title} <span className="text-gray-500 text-sm">(x{item.quantity || 1})</span></p>
                          </div>
                          <div>
                            <p className="text-dark text-right whitespace-nowrap">
                              Rp {itemSubtotal.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <p className="text-dark">Biaya Pengiriman</p>
                      <p className="text-dark text-right">Rp {shippingCost.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total Akhir</p>
                      <p className="font-bold text-xl text-[#D9B35A] text-right">
                        Rp {total.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                <Coupon />
                <ShippingMethod />
                <PaymentMethod />

                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className={`w-full flex justify-center font-bold text-white py-4 px-6 rounded-md ease-out duration-200 mt-7.5 transition-all ${
                    isProcessing || cartItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue hover:bg-blue-dark shadow-md" // Sesuaikan warna dengan tema Anda
                  }`}
                >
                  {isProcessing ? "Memproses..." : "Selesaikan Pembayaran"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;