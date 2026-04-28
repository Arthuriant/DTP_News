"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AuthService } from "@/services/AuthService"; 

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // URL Aksen Nusantara
  const brownBatikUrl =
    "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  const handleGoogleLogin = () => {
    const currentUrl = window.location.href;
    // URL backend untuk Google OAuth bisa tetap menembak langsung
    window.location.href =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") + 
      "/auth/google?redirect=" +
      encodeURIComponent(currentUrl);
  };

  // Pengecekan jika sudah login
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const data = await AuthService.getUser();
        
        // LOGIKA REDIREKSI BERDASARKAN HAK AKSES
        const isSuperAdmin = data?.roles?.includes("super_admin");
        const canViewDashboard = data?.permissions?.includes("view_dashboard");

        if (isSuperAdmin || canViewDashboard) {
          window.location.href = "/admin"; // Masuk ke panel Admin
        } else {
          window.location.href = "/"; // Masuk ke halaman E-Commerce pelanggan
        }
      } catch (err) {
        // Jika error (misal 401), biarkan di halaman login
        console.log("Belum login atau sesi habis");
      }
    };
    
    checkLogin();
  }, []);

  // FUNGSI BARU: Mesin pemroses login manual menggunakan Service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Tembak API Login (Error dari api.ts akan otomatis terlempar ke catch)
      const loginRes = await AuthService.login({ email, password });

      // Jika berhasil, kita bisa simpan data user ringan ke localStorage (opsional, untuk UI statis)
      if (loginRes.user) {
        localStorage.setItem("user", JSON.stringify(loginRes.user));
      }

      // 2. Ambil data user lengkap untuk cek Role & Permission
      const userData = await AuthService.getUser();

      // 3. PERBAIKAN: Arahkan berdasarkan Hak Akses (Permission), bukan nama role
      const isSuperAdmin = userData?.roles?.includes("super_admin");
      const canViewDashboard = userData?.permissions?.includes("view_dashboard");

      if (isSuperAdmin || canViewDashboard) {
        window.location.href = "/admin"; // Langsung ke Dashboard Admin
      } else {
        window.location.href = "/"; // Customer ke Beranda
      }
      
    } catch (err: any) {
      // Error validation dari Laravel akan ditangkap di sini berkat file api.ts
      setError(err.message || "Terjadi kesalahan server");
    }
  };

  return (
    <>
      <Breadcrumb title={"Signin"} pages={["Signin"]} />

      <section
        className="relative overflow-hidden py-20 bg-[#F8F3E9] min-h-screen flex items-center"
        style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
      >
        <div
          className="absolute right-[-10%] top-0 w-[600px] h-[800px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
          style={{
            backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right top",
          }}
        ></div>

        <div
          className="absolute left-[-5%] bottom-10 w-[400px] h-[600px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale contrast-125"
          style={{
            backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left bottom",
          }}
        ></div>

        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 relative z-10">
          <div className="relative overflow-hidden max-w-[570px] w-full mx-auto rounded-[1.5rem] bg-[#2D1A11] shadow-[0_20px_50px_rgba(45,26,17,0.2)] border border-[#C5A059]/30 p-6 sm:p-10 xl:p-12">
            <div
              className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url('${brownBatikUrl}')`,
                backgroundSize: "250px",
                backgroundRepeat: "repeat",
              }}
            ></div>

            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#C5A059]/20 to-transparent rounded-tr-[1.5rem] z-0"></div>
            <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-[#C5A059]/60 z-0"></div>

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h2 className="font-semibold text-2xl sm:text-3xl xl:text-4xl text-[#C5A059] mb-2 tracking-wide">
                  Sign In to Your Account
                </h2>
                <p className="font-sans text-[#F8F3E9]/70">
                  Silakan masukkan detail Anda di bawah
                </p>
              </div>

              <form onSubmit={handleSubmit} className="font-sans">
                {error && (
                  <p className="text-[#C5A059] text-sm mb-6 text-center bg-[#C5A059]/10 border border-[#C5A059]/30 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-[#C5A059] font-medium tracking-wide"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    className="rounded-lg border border-[#C5A059]/40 bg-[#F5EFE6] text-[#2D1A11] placeholder:text-[#2D1A11]/40 w-full py-3.5 px-5 outline-none transition-all duration-300 focus:border-[#C5A059] focus:shadow-[0_0_15px_rgba(197,160,89,0.15)] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-[#C5A059] font-medium tracking-wide"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    autoComplete="on"
                    className="rounded-lg border border-[#C5A059]/40 bg-[#F5EFE6] text-[#2D1A11] placeholder:text-[#2D1A11]/40 w-full py-3.5 px-5 outline-none transition-all duration-300 focus:border-[#C5A059] focus:shadow-[0_0_15px_rgba(197,160,89,0.15)] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center font-semibold text-[#2D1A11] bg-[#C5A059] py-3.5 px-6 rounded-lg transition-all duration-300 hover:bg-[#E0B976] hover:shadow-[0_10px_20px_-10px_rgba(197,160,89,0.5)] transform hover:-translate-y-0.5 tracking-widest uppercase text-sm"
                >
                  Sign in
                </button>

                <a
                  href="#"
                  className="block text-center text-[#F8F3E9]/60 mt-5 transition-colors duration-300 hover:text-[#C5A059] text-sm"
                >
                  Lupa password Anda?
                </a>

                <div className="relative flex items-center justify-center mt-8 mb-8">
                  <span className="absolute w-full h-px bg-[#C5A059]/20"></span>
                  <span className="relative bg-[#2D1A11] px-4 text-sm text-[#F8F3E9]/50 font-medium">
                    Atau
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex justify-center items-center gap-3.5 rounded-lg border border-[#C5A059]/40 bg-transparent text-[#F8F3E9] p-3.5 transition-all duration-300 hover:bg-[#C5A059]/10"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.999 10.2218C20.0111 9.53429 19.9387 8.84791 19.7834 8.17737H10.2031V11.8884H15.8267C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.999 13.2661 19.999 10.2218Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2036 20C12.9586 20 15.2715 19.1111 16.9609 17.5777L13.7409 15.1332C12.8793 15.7223 11.7229 16.1333 10.2036 16.1333C8.91317 16.126 7.65795 15.7206 6.61596 14.9746C5.57397 14.2287 4.79811 13.1802 4.39848 11.9777L4.2789 11.9877L1.12906 14.3766L1.08789 14.4888C1.93622 16.1457 3.23812 17.5386 4.84801 18.512C6.45791 19.4852 8.31194 20.0005 10.2036 20Z"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39899 11.9776C4.1758 11.3411 4.06063 10.673 4.05807 9.9999C4.06218 9.3279 4.1731 8.66067 4.38684 8.02221L4.38115 7.88959L1.1927 5.46234L1.0884 5.51095C0.372762 6.90337 0 8.44075 0 9.99983C0 11.5589 0.372762 13.0962 1.0884 14.4887L4.39899 11.9776Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2039 3.86663C11.6661 3.84438 13.0802 4.37803 14.1495 5.35558L17.0294 2.59997C15.1823 0.90185 12.7364 -0.0298855 10.2039 -3.67839e-05C8.31239 -0.000477835 6.45795 0.514733 4.84805 1.48799C3.23816 2.46123 1.93624 3.85417 1.08789 5.51101L4.38751 8.02225C4.79107 6.82005 5.5695 5.77231 6.61303 5.02675C7.65655 4.28119 8.91254 3.87541 10.2039 3.86663Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Sign In with Google
                  </button>
                </div>

                <p className="text-center mt-7 text-[#F8F3E9]/80 text-sm">
                  Belum punya akun?
                  <Link
                    href="/signup"
                    className="text-[#C5A059] font-medium transition-colors duration-300 hover:text-[#E0B976] pl-1.5"
                  >
                    Daftar Sekarang!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;