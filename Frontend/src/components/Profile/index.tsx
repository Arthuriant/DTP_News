"use client";

import { useState, useEffect } from "react";
import AddressTab from "./AddressTab";
import BiodataTab from "./BiodataTab";
import { AuthService } from "@/services/AuthService";
import { ProfileService } from "@/services/ProfileService";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("biodata");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  useEffect(() => {
      const loadAllData = async () => {
        try {

          const [userData, profileData] = await Promise.all([
            AuthService.getUser(),
            ProfileService.getProfile()
          ]);

          if (userData) setUser(userData);
          if (profileData) setProfile(profileData);

        } catch (err) {
          console.error("Gagal mengambil data:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadAllData();
    }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF5]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D9B35A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#FFFDF5] pt-40 md:pt-48 lg:pt-[200px] pb-20 font-sans text-[#2A1B14] overflow-x-hidden">
      
      {/* Background Ornamen */}
      <div 
        className="absolute right-0 top-10 w-[500px] h-[500px] pointer-events-none opacity-[0.02] z-0" 
        style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'top right' }}
      ></div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
        
        {/* ================= LEFT SIDEBAR ================= */}
        {/* z-10 agar tetap di bawah modal (yang biasanya z-50 ke atas) */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-3 lg:sticky lg:top-36 z-10">
          
          <button
            onClick={() => setActiveTab("biodata")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border ${
              activeTab === "biodata"
                ? "bg-white text-[#2A1B14] shadow-[0_10px_20px_rgba(42,27,20,0.05)] border-white"
                : "text-[#8B7355] border-transparent hover:bg-white/40 hover:text-[#2A1B14]"
            }`}
          >
            <svg className={`w-5 h-5 ${activeTab === 'biodata' ? 'text-[#D9B35A]' : 'text-[#8B7355]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Biodata Diri
          </button>

          <button
            onClick={() => setActiveTab("alamat")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border ${
              activeTab === "alamat"
                ? "bg-white text-[#2A1B14] shadow-[0_10px_20px_rgba(42,27,20,0.05)] border-white"
                : "text-[#8B7355] border-transparent hover:bg-white/40 hover:text-[#2A1B14]"
            }`}
          >
            <svg className={`w-5 h-5 ${activeTab === 'alamat' ? 'text-[#D9B35A]' : 'text-[#8B7355]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Daftar Alamat
          </button>

        </div>

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 min-w-0 w-full z-10">
          
          <div className="mb-8 pl-2">
            <h1 className="text-3xl font-black text-[#2A1B14] font-serif tracking-wide">
              {activeTab === "biodata" ? "Informasi Pribadi" : "Buku Alamat"}
            </h1>
            <p className="text-[#8B7355] text-sm mt-2">
              {activeTab === "biodata" ? "Kelola informasi data diri dan kontak Anda di sini." : "Atur lokasi pengiriman untuk pesanan Anda."}
            </p>
          </div>

          {/* Container Putih Utama */}
          <div className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(42,27,20,0.03)] p-6 md:p-10 border border-white/60 relative overflow-hidden min-h-[500px]">
            
            {/* Dekorasi Pojok */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFFDF5] to-transparent rounded-bl-[4rem] opacity-40 pointer-events-none"></div>

            {activeTab === "biodata" ? (
              <BiodataTab 
                user={user} 
                profile={profile} 
                onUpdate={(newUser, newProfile) => { 
                  setUser(newUser); 
                  setProfile(newProfile); 
                }} 
              />
            ) : (
              <AddressTab />
            )}
          </div>

        </div>

      </div>
    </section>
  );
}