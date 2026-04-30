import React from "react";

interface CouponProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleApplyCoupon: () => void;
  discountAmount: number;
}

const Coupon = ({ couponCode, setCouponCode, handleApplyCoupon, discountAmount }: CouponProps) => {
  return (
    <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 mt-7.5">
      <div className="border-b border-[#D9B35A]/30 py-5 px-4 sm:px-8.5 bg-[#D9B35A]/5 rounded-t-2xl">
        <h3 className="font-bold text-xl text-[#2D1A11] flex items-center gap-2">
          <span className="text-[#D9B35A]">✧</span> Kode Promo
        </h3>
      </div>

      <div className="py-6 px-4 sm:px-8.5">
        <div className="flex gap-4">
          <input
            type="text"
            name="coupon"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Masukkan kode..."
            className="rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/40 w-full py-3 px-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11] font-bold tracking-widest shadow-sm uppercase"
          />

          <button
            type="button"
            onClick={handleApplyCoupon}
            className="inline-flex items-center justify-center font-bold text-[#D9B35A] bg-[#2D1A11] py-3 px-6 rounded-xl transition-all duration-200 hover:bg-[#3d2519] shadow-md uppercase tracking-wider text-sm"
          >
            Apply
          </button>
        </div>
        
        {discountAmount > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm font-medium">Kupon berhasil! Anda berhemat <span className="font-bold">Rp {discountAmount.toLocaleString('id-ID')}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupon;