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
  
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- STATE FORMS ---
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer BCA");
  const [shippingMethod, setShippingMethod] = useState("fedex");
  
  const [billingData, setBillingData] = useState({
    firstName: "", lastName: "", address: "", town: "", phone: "",
  });

  const [isDifferentAddress, setIsDifferentAddress] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: "", town: "", phone: "",
  });

  const [notes, setNotes] = useState("");

  // --- STATE KUPON ---
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // --- HANDLERS ---
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

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
  
  const getShippingCost = () => {
    if (shippingMethod === "free") return 0;
    if (shippingMethod === "fedex") return 15000;
    if (shippingMethod === "dhl") return 25000;
    return 0;
  };
  const shippingCost = getShippingCost();
  
  const total = subtotal + shippingCost - discountAmount;

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }

    setIsProcessing(true);

    try {
      const addressToUse = isDifferentAddress ? shippingData : billingData;
      const penerima = isDifferentAddress ? shippingData.phone : `${billingData.firstName} ${billingData.lastName} - HP: ${billingData.phone}`;

      const fullAddress = `${addressToUse.address}, ${addressToUse.town} (Penerima: ${penerima}) | Catatan: ${notes || '-'}`;

      const response = await OrderService.checkout({
        shipping_address: fullAddress,
        payment_method: paymentMethod, 
      });

      dispatch(clearCart());
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
      {/* Background utama diubah ke warna krem hangat */}
      <section className="overflow-hidden py-20 bg-[#F9F6EE]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              
              <div className="lg:max-w-[670px] w-full">
                <Login />
                <Billing formData={billingData} handleInputChange={handleBillingChange} />
                <Shipping 
                  isDifferentAddress={isDifferentAddress}
                  setIsDifferentAddress={setIsDifferentAddress}
                  shippingData={shippingData}
                  handleShippingChange={handleShippingChange}
                />

                {/* Styling Catatan Tambahan disesuaikan tema */}
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
                {/* Styling Box Ringkasan Pesanan */}
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
                          <div>
                            <p className="text-[#8B7355] font-bold text-sm whitespace-nowrap text-right">
                              Rp {itemSubtotal.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
                      <p className="text-[#2D1A11] font-medium text-sm">Biaya Pengiriman</p>
                      <p className="text-[#8B7355] font-bold text-sm text-right">Rp {shippingCost.toLocaleString('id-ID')}</p>
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
                
                <ShippingMethod selectedMethod={shippingMethod} onMethodChange={setShippingMethod} />
                <PaymentMethod selectedPayment={paymentMethod} onPaymentChange={setPaymentMethod} />

                {/* Tombol Submit Khas UpToYou */}
                <button 
                  type="submit" 
                  disabled={isProcessing || cartItems.length === 0} 
                  className={`w-full flex justify-center font-bold py-[15px] px-6 rounded-full ease-out duration-200 mt-8 uppercase tracking-widest transition-all ${
                    isProcessing || cartItems.length === 0 
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