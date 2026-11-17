import React from "react";
import Image from "next/image";

interface ShippingMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const ShippingMethod = ({ selectedMethod, onMethodChange }: ShippingMethodProps) => {
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
          <span className="text-[#D9B35A]">✧</span> Metode Pengiriman
        </h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          
          {/* FREE SHIPPING */}
          <label htmlFor="free" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative shrink-0">
              <input type="checkbox" name="free" id="free" className="sr-only" checked={selectedMethod === "free"} onChange={() => onMethodChange("free")} />
              <div className={getRadioStyle(selectedMethod === "free")}></div>
            </div>
            <div className={getCardStyle(selectedMethod === "free")}>
              <div className="flex items-center">
                <div className="pr-4 border-r border-[#D9B35A]/20 mr-4 w-20 flex justify-center">
                  <span className="font-black text-[#8B7355] text-lg uppercase tracking-widest">FREE</span>
                </div>
                <div>
                  <p className="font-bold text-[#2D1A11] text-base">Rp 0</p>
                  <p className="text-[#8B7355] text-xs font-medium">Pengiriman Gratis (Ambil di Toko)</p>
                </div>
              </div>
            </div>
          </label>

          {/* REGULER / FEDEX */}
          <label htmlFor="fedex" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative shrink-0">
              <input type="checkbox" name="fedex" id="fedex" className="sr-only" checked={selectedMethod === "fedex"} onChange={() => onMethodChange("fedex")} />
              <div className={getRadioStyle(selectedMethod === "fedex")}></div>
            </div>
            <div className={getCardStyle(selectedMethod === "fedex")}>
              <div className="flex items-center">
                <div className="pr-4 border-r border-[#D9B35A]/20 mr-4 w-20 flex justify-center opacity-80">
                  <Image src="/images/checkout/fedex.svg" alt="fedex" width={64} height={18} />
                </div>
                <div>
                  <p className="font-bold text-[#2D1A11] text-base">Rp 15.000</p>
                  <p className="text-[#8B7355] text-xs font-medium">Reguler / Standard Shipping</p>
                </div>
              </div>
            </div>
          </label>

          {/* EXPRESS / DHL */}
          <label htmlFor="dhl" className="flex items-center gap-4 group cursor-pointer">
            <div className="relative shrink-0">
              <input type="checkbox" name="dhl" id="dhl" className="sr-only" checked={selectedMethod === "dhl"} onChange={() => onMethodChange("dhl")} />
              <div className={getRadioStyle(selectedMethod === "dhl")}></div>
            </div>
            <div className={getCardStyle(selectedMethod === "dhl")}>
              <div className="flex items-center">
                <div className="pr-4 border-r border-[#D9B35A]/20 mr-4 w-20 flex justify-center opacity-80">
                  <Image src="/images/checkout/dhl.svg" alt="dhl" width={64} height={20} />
                </div>
                <div>
                  <p className="font-bold text-[#2D1A11] text-base">Rp 25.000</p>
                  <p className="text-[#8B7355] text-xs font-medium">Express / Next Day</p>
                </div>
              </div>
            </div>
          </label>

        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;