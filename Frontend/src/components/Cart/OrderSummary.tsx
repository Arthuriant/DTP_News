import { useAppSelector } from "@/redux/store";
import React from "react";

// 👇 Tangkap properti dari komponen Cart (onCheckout dan isCheckingOut) 👇
const OrderSummary = ({ onCheckout, isCheckingOut }: any) => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const calculatedTotal = cartItems.reduce((total, item) => {
    const itemPrice = Number(item.discountedPrice) || 0;
    const itemQty = Number(item.quantity) || 1;
    return total + (itemPrice * itemQty);
  }, 0);

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20">
        <div className="border-b border-[#D9B35A]/30 py-5 px-4 sm:px-8.5 bg-[#D9B35A]/5 rounded-t-2xl">
          <h3 className="font-bold text-xl text-[#2D1A11] flex items-center gap-2">
            <span className="text-[#D9B35A]">✧</span> Ringkasan Pesanan
          </h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
            <div>
              <h4 className="font-bold text-[#8B7355] text-xs uppercase tracking-widest">Produk</h4>
            </div>
            <div>
              <h4 className="font-bold text-[#8B7355] text-xs uppercase tracking-widest text-right">Subtotal</h4>
            </div>
          </div>

          {cartItems.map((item, key) => {
            const itemSubtotal = Number(item.discountedPrice) * Number(item.quantity || 1);

            return (
              <div key={key} className="flex items-center justify-between py-4 border-b border-[#D9B35A]/10 border-dashed">
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

          <div className="flex items-center justify-between pt-6">
            <div>
              <p className="font-bold text-lg text-[#2D1A11]">Total</p>
            </div>
            <div>
              <p className="font-bold text-2xl text-[#D9B35A] text-right">
                Rp {calculatedTotal.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* 👇 Update tombol dengan event onClick dan style loading 👇 */}
          <button
            type="button" 
            onClick={onCheckout}
            disabled={isCheckingOut}
            className={`w-full flex justify-center font-bold text-[#1A1A1A] py-[15px] px-6 rounded-full ease-out duration-200 uppercase tracking-widest mt-8 transition-all ${
              isCheckingOut
                ? "bg-[#D9B35A]/50 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-[#EAC135] to-[#DFB121] hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20"
            }`}
          >
            {isCheckingOut ? "Memproses..." : "Lanjutkan ke Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;