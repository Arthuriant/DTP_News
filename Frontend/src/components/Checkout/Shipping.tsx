import React from "react";

interface ShippingProps {
  isDifferentAddress: boolean;
  setIsDifferentAddress: (val: boolean) => void;
  shippingData: any;
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const Shipping = ({ isDifferentAddress, setIsDifferentAddress, shippingData, handleShippingChange }: ShippingProps) => {
  const inputClass = "rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/40 w-full py-3 px-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11] shadow-sm";
  const labelClass = "block mb-2.5 font-bold text-[#2D1A11] text-sm";

  return (
    <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 mt-7.5 overflow-hidden transition-all duration-300">
      
      {/* Header / Toggle Button */}
      <div
        onClick={() => setIsDifferentAddress(!isDifferentAddress)}
        className={`cursor-pointer flex items-center justify-between font-bold text-lg text-[#2D1A11] py-5 px-5.5 hover:bg-[#D9B35A]/5 transition-colors ${
          isDifferentAddress ? 'border-b border-[#D9B35A]/20 bg-[#D9B35A]/5' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          Kirim ke alamat yang berbeda?
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDifferentAddress ? 'bg-[#D9B35A] text-[#1A1A1A]' : 'bg-[#D9B35A]/10 text-[#D9B35A]'}`}>
          <svg
            className={`fill-current ease-out duration-300 ${isDifferentAddress ? "rotate-180" : ""}`}
            width="14" height="14" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z" />
          </svg>
        </div>
      </div>

      {/* Dropdown Form */}
      <div className={`transition-all duration-500 ease-in-out origin-top ${isDifferentAddress ? "block opacity-100 p-4 sm:p-8.5" : "hidden opacity-0 h-0 p-0"}`}>
        <div className="mb-5">
          <label htmlFor="shipAddress" className={labelClass}>
            Alamat Lengkap <span className="text-rose-500">*</span>
          </label>
          <input type="text" name="address" id="shipAddress" value={shippingData.address} onChange={handleShippingChange} placeholder="Nama jalan, nomor rumah, dll" className={inputClass} />
        </div>

        <div className="mb-5">
          <label htmlFor="shipTown" className={labelClass}>
            Kota / Kabupaten <span className="text-rose-500">*</span>
          </label>
          <input type="text" name="town" id="shipTown" value={shippingData.town} onChange={handleShippingChange} placeholder="Contoh: Jakarta Selatan" className={inputClass} />
        </div>

        <div className="mb-5">
          <label htmlFor="shipPhone" className={labelClass}>
            Nama Penerima & Nomor Telepon <span className="text-rose-500">*</span>
          </label>
          <input type="text" name="phone" id="shipPhone" value={shippingData.phone} onChange={handleShippingChange} placeholder="Cth: Budi - 0812xxx" className={inputClass} />
        </div>
      </div>

    </div>
  );
};

export default Shipping;