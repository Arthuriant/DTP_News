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
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [isProcessing, setIsProcessing] = useState(false);

  // 👇 MOCKUP DATA USER LOGIN (Nanti tarik data ini dari Redux / Auth Context Anda) 👇
  const loggedInUser = {
    name: "Customer Biasa",
    email: "customer@uptoyou.com",
    phone: "08123456789"
  };

  // --- STATE FORMS ---
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer BCA");
  const [shippingInfo, setShippingInfo] = useState<any>(null); // Di-reset ke null agar validasi berjalan
  const [notes, setNotes] = useState("");

  // --- STATE KUPON ---
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // --- HANDLERS ---
  const handleApplyCoupon = () => {
    if (couponCode === "PROMOTAS") {
      setDiscountAmount(50000);
    } else {
      alert("Kode kupon tidak valid atau sudah kedaluwarsa.");
      setDiscountAmount(0);
      setCouponCode("");
    }
  };

  // --- PERHITUNGAN HARGA ---
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.discountedPrice) * Number(item.quantity || 1)), 0);
  const shippingCost = shippingInfo?.cost ?? 0;
  const total = subtotal + shippingCost - discountAmount;

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }

    // Validasi diaktifkan kembali: Wajib pilih ongkir dari Shipping.tsx
    if (!shippingInfo) {
      alert("Pilih layanan pengiriman terlebih dahulu!");
      return;
    }

    setIsProcessing(true);

    try {
      const fullAddress = `${shippingInfo.address} | Catatan: ${notes || '-'}`;

      const response = await OrderService.checkout({
        shipping_address: fullAddress,
        payment_method:   paymentMethod,
        shipping_cost:    shippingInfo.cost,
        shipping_courier: shippingInfo.courier,
        shipping_service: shippingInfo.service,
        origin_id:        4816,
        destination_id:   shippingInfo.destination_id,
        // Data diambil langsung dari state user, bukan dari form input lagi
        customer_name:    loggedInUser.name,
        customer_email:   loggedInUser.email,
        customer_phone:   loggedInUser.phone,
      });

      dispatch(clearCart());
      window.location.href = response.invoice_url;

    } catch (error: any) {
      console.error("Gagal checkout:", error);
      alert(error.message || "Terjadi kesalahan saat memproses pesanan.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-[#F9F6EE]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              
              <div className="lg:max-w-[670px] w-full">
                <Login />
                
                {/* Billing dihapus, Shipping dimunculkan */}
                <Shipping onShippingChange={setShippingInfo} />

                <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5 font-bold text-[#2D1A11]">Catatan Tambahan (opsional)</label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Pesan khusus atau instruksi pengiriman."
                      className="rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/50 w-full p-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11]"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20">
                  <div className="border-b border-[#D9B35A]/30 py-5 px-4 sm:px-8.5 bg-[#D9B35A]/5 rounded-t-2xl">
                    <h3 className="font-bold text-xl text-[#2D1A11] flex items-center gap-2">
                      <span className="text-[#D9B35A]">✧</span> Ringkasan Pesanan
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
                      <h4 className="font-bold text-[#8B7355] text-xs uppercase tracking-widest">Produk</h4>
                      <h4 className="font-bold text-[#8B7355] text-xs uppercase tracking-widest text-right">Subtotal</h4>
                    </div>

                    {cartItems.map((item, index) => {
                      const itemSubtotal = Number(item.discountedPrice) * Number(item.quantity || 1);
                      return (
                        <div key={index} className="flex items-center justify-between py-4 border-b border-[#D9B35A]/10 border-dashed">
                          <div className="pr-4">
                            <p className="text-[#2D1A11] font-medium text-sm line-clamp-1">
                              {item.title} <span className="text-[#8B7355] text-xs">(x{item.quantity || 1})</span>
                            </p>
                          </div>
                          <p className="text-[#8B7355] font-bold text-sm whitespace-nowrap text-right">
                            Rp {itemSubtotal.toLocaleString('id-ID')}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
                      <p className="text-[#2D1A11] font-medium text-sm">
                        Biaya Pengiriman
                        {shippingInfo && (
                          <span className="text-[#8B7355] text-xs block mt-1 uppercase tracking-wider font-bold">
                            {shippingInfo.courier} - {shippingInfo.service}
                          </span>
                        )}
                      </p>
                      <p className="text-[#8B7355] font-bold text-sm text-right">
                        {shippingInfo ? `Rp ${shippingCost.toLocaleString('id-ID')}` : '-'}
                      </p>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
                        <p className="text-emerald-600 font-medium text-sm">Diskon Kupon</p>
                        <p className="text-emerald-600 text-right font-bold text-sm">- Rp {discountAmount.toLocaleString('id-ID')}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6">
                      <p className="font-bold text-lg text-[#2D1A11]">Total Akhir</p>
                      <p className="font-bold text-2xl text-[#D9B35A] text-right">Rp {total.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <Coupon
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handleApplyCoupon={handleApplyCoupon}
                  discountAmount={discountAmount}
                />

                <PaymentMethod selectedPayment={paymentMethod} onPaymentChange={setPaymentMethod} />

                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0 || !shippingInfo}
                  className={`w-full flex justify-center font-bold py-[15px] px-6 rounded-full ease-out duration-200 mt-8 uppercase tracking-widest transition-all ${
                    isProcessing || cartItems.length === 0 || !shippingInfo
                      ? "bg-[#D9B35A]/50 text-[#1A1A1A]/50 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20"
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