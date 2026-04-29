import React, { useState } from "react";

const Login = () => {
  const [dropdown, setDropdown] = useState(false);

  // Class CSS khusus untuk input agar seragam dengan form Billing & Shipping
  const inputClass = "rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/40 w-full py-3 px-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11] shadow-sm";
  const labelClass = "block mb-2.5 font-bold text-[#2D1A11] text-sm";

  return (
    <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 mb-7.5 overflow-hidden transition-all duration-300">
      
      {/* Header / Toggle Button */}
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center justify-between font-bold text-[#2D1A11] py-5 px-5.5 hover:bg-[#D9B35A]/5 transition-colors ${
          dropdown ? 'border-b border-[#D9B35A]/20 bg-[#D9B35A]/5' : ''
        }`}
      >
        <span className="flex items-center text-sm sm:text-base">
          Sudah pernah berbelanja? 
          <span className="text-[#D9B35A] ml-2 underline decoration-[#D9B35A]/30 underline-offset-4">
            Klik di sini untuk login
          </span>
        </span>
        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${dropdown ? 'bg-[#D9B35A] text-[#1A1A1A]' : 'bg-[#D9B35A]/10 text-[#D9B35A]'}`}>
          <svg
            className={`fill-current ease-out duration-300 ${dropdown ? "rotate-180" : ""}`}
            width="14" height="14" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z" />
          </svg>
        </div>
      </div>

      {/* Dropdown Form */}
      <div className={`transition-all duration-500 ease-in-out origin-top ${dropdown ? "block opacity-100 p-4 sm:p-8.5" : "hidden opacity-0 h-0 p-0"}`}>
        <p className="text-[#8B7355] text-sm mb-6 font-medium">
          Jika Anda ingin menggunakan akun lain atau memuat alamat tersimpan, silakan login di sini.
        </p>

        <div className="mb-5">
          <label htmlFor="name" className={labelClass}>Username atau Email</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            placeholder="Masukkan email Anda"
            className={inputClass} 
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className={labelClass}>Password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            autoComplete="on" 
            placeholder="••••••••"
            className={inputClass} 
          />
        </div>

        <button
          type="button" // Tetap menggunakan type="button" agar tidak memicu checkout
          onClick={() => alert("Fitur ganti akun sedang dalam pengembangan.")}
          className="inline-flex items-center justify-center font-bold text-[#D9B35A] bg-[#2D1A11] py-3 px-10 rounded-xl transition-all duration-200 hover:bg-[#3d2519] shadow-md uppercase tracking-wider text-sm"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;