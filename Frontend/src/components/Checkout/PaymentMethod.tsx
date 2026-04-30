import React from "react";
import Image from "next/image";

interface PaymentMethodProps {
  selectedPayment: string;
  onPaymentChange: (method: string) => void;
}

const PaymentMethod = ({ selectedPayment, onPaymentChange }: PaymentMethodProps) => {
  const getCardStyle = (isActive: boolean) => 
    `rounded-xl border-2 py-3 px-5 transition-all duration-300 w-full cursor-pointer ${
      isActive 
        ? "border-[#D9B35A] bg-[#D9B35A]/5 shadow-[0_4px_12px_rgba(217,179,90,0.15)]" 
        : "border-gray-200 bg-white hover:border-[#D9B35A]/50"
    }`;

  const getRadioStyle = (isActive: boolean) =>
    `flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
      isActive ? "border-[5px] border-[#D9B35A] bg-white shadow-sm" : "border-2 border-gray-300"
    }`;

  return (
    <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 mt-7.5">
      <div className="border-b border-[#D9B35A]/30 py-5 px-4 sm:px-8.5 bg-[#D9B35A]/5 rounded-t-2xl">
        <h3 className="font-bold text-xl text-[#2D1A11] flex items-center gap-2">
          <span className="text-[#D9B35A]">✧</span> Pembayaran
        </h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          
          {/* BANK TRANSFER */}
          <label htmlFor="bank" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative shrink-0">
              <input type="checkbox" name="bank" id="bank" className="sr-only" checked={selectedPayment === "Bank Transfer BCA"} onChange={() => onPaymentChange("Bank Transfer BCA")} />
              <div className={getRadioStyle(selectedPayment === "Bank Transfer BCA")}></div>
            </div>
            <div className={getCardStyle(selectedPayment === "Bank Transfer BCA")}>
              <div className="flex items-center">
                <div className="pr-4 border-r border-[#D9B35A]/20 mr-4 w-16 flex justify-center opacity-90">
                  <Image src="/images/checkout/bank.svg" alt="bank" width={35} height={20}/>
                </div>
                <div>
                  <p className="font-bold text-[#2D1A11] text-sm">Direct Bank Transfer</p>
                  <p className="text-[#8B7355] text-xs mt-0.5">Transfer manual via BCA / Mandiri</p>
                </div>
              </div>
            </div>
          </label>

          {/* CASH ON DELIVERY */}
          <label htmlFor="cash" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative shrink-0">
              <input type="checkbox" name="cash" id="cash" className="sr-only" checked={selectedPayment === "Cash on Delivery"} onChange={() => onPaymentChange("Cash on Delivery")} />
              <div className={getRadioStyle(selectedPayment === "Cash on Delivery")}></div>
            </div>
            <div className={getCardStyle(selectedPayment === "Cash on Delivery")}>
              <div className="flex items-center">
                <div className="pr-4 border-r border-[#D9B35A]/20 mr-4 w-16 flex justify-center opacity-80">
                  <Image src="/images/checkout/cash.svg" alt="cash" width={24} height={24} />
                </div>
                <div>
                  <p className="font-bold text-[#2D1A11] text-sm">Cash on Delivery (COD)</p>
                  <p className="text-[#8B7355] text-xs mt-0.5">Bayar tunai di tempat</p>
                </div>
              </div>
            </div>
          </label>

          {/* PAYPAL */}
          <label htmlFor="paypal" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative shrink-0">
              <input type="checkbox" name="paypal" id="paypal" className="sr-only" checked={selectedPayment === "PayPal"} onChange={() => onPaymentChange("PayPal")} />
              <div className={getRadioStyle(selectedPayment === "PayPal")}></div>
            </div>
            <div className={getCardStyle(selectedPayment === "PayPal")}>
              <div className="flex items-center">
                <div className="pr-4 border-r border-[#D9B35A]/20 mr-4 w-16 flex justify-center opacity-90">
                  <Image src="/images/checkout/paypal.svg" alt="paypal" width={60} height={16}/>
                </div>
                <div>
                  <p className="font-bold text-[#2D1A11] text-sm">PayPal</p>
                  <p className="text-[#8B7355] text-xs mt-0.5">Kartu Kredit / Saldo PayPal</p>
                </div>
              </div>
            </div>
          </label>

        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;