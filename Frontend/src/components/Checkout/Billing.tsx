import React from "react";

interface BillingProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const Billing = ({ formData, handleInputChange }: BillingProps) => {
  const inputClass = "rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/40 w-full py-3 px-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11] shadow-sm";
  const labelClass = "block mb-2.5 font-bold text-[#2D1A11] text-sm";

  return (
    <div className="mt-9">
      <h2 className="font-bold text-[#2D1A11] text-xl sm:text-2xl mb-5.5 flex items-center gap-2">
        <span className="text-[#D9B35A]">✧</span> Detail Pengiriman
      </h2>

      <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 p-4 sm:p-8.5">

        {/* Nama Depan & Belakang */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className={labelClass}>Nama Depan <span className="text-rose-500">*</span></label>
            <input type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="John" className={inputClass} />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className={labelClass}>Nama Belakang <span className="text-rose-500">*</span></label>
            <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className={inputClass} />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="email" className={labelClass}>Email <span className="text-rose-500">*</span></label>
          <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} placeholder="contoh@email.com" className={inputClass} />
        </div>

        {/* Alamat */}
        <div className="mb-5">
          <label htmlFor="address" className={labelClass}>Alamat Lengkap <span className="text-rose-500">*</span></label>
          <input type="text" name="address" id="address" required value={formData.address} onChange={handleInputChange} placeholder="Nama jalan, nomor rumah, RT/RW" className={inputClass} />
        </div>

        {/* Kota */}
        <div className="mb-5">
          <label htmlFor="town" className={labelClass}>Kota / Kabupaten <span className="text-rose-500">*</span></label>
          <input type="text" name="town" id="town" required value={formData.town} onChange={handleInputChange} placeholder="Contoh: Bandung" className={inputClass} />
        </div>

        {/* Telepon */}
        <div className="mb-5">
          <label htmlFor="phone" className={labelClass}>Nomor Telepon / WhatsApp <span className="text-rose-500">*</span></label>
          <input type="text" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} placeholder="08123456789" className={inputClass} />
        </div>

      </div>
    </div>
  );
};

export default Billing;