"use client";

import { useState, useEffect } from "react";
import AddressTab from "./AddressTab";
import BiodataTab from "./BiodataTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("biodata");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/previews/024/036/944/large_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [resUser, resProfile] = await Promise.all([
          fetch("http://127.0.0.1:8000/user", { credentials: "include" }),
          fetch("http://127.0.0.1:8000/profile", { credentials: "include" })
        ]);
        if (resUser.ok) setUser(await resUser.json());
        if (resProfile.ok) setProfile(await resProfile.json());
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
      <div className="flex justify-center items-center h-screen bg-[#F8F3E9]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#F8F3E9] pt-36 pb-16 overflow-hidden" style={{ fontFamily: "'Playfair Display', serif" }}>
      
      <div className="absolute right-[-5%] top-24 w-[300px] h-[500px] pointer-events-none z-0 opacity-[0.01] mix-blend-multiply grayscale"
        style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      ></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="relative bg-[#2D1A11] rounded-2xl shadow-lg border border-[#C5A059]/20 overflow-hidden mb-6 p-5">
          <div className="absolute -right-12 -top-12 w-[200px] h-[200px] z-0 opacity-10 transform rotate-12"
            style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
          ></div>
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 shrink-0 bg-[#F8F3E9] rounded-full flex items-center justify-center border-2 border-[#C5A059]/40 shadow-md text-lg font-serif text-[#2D1A11]">
              {user?.name?.charAt(0) || "U"}
            </div>
            
            <div className="flex-grow">
              <p className="text-[#C5A059] font-sans text-[8px] tracking-[0.4em] uppercase mb-0.5 font-bold">Kolega Eksklusif</p>
              <h1 className="text-xl font-bold text-[#F8F3E9] tracking-tight">{user?.name || "Pengguna"}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[#F8F3E9]/60 font-sans text-[8px] uppercase tracking-widest font-bold">Verified Account</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[220px] shrink-0">
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 shadow-sm border border-[#C5A059]/10 sticky top-36">
              <div className="flex lg:flex-col gap-1">
                <button onClick={() => setActiveTab("biodata")}
                  className={`text-left px-4 py-2.5 rounded-lg font-sans text-[11px] font-bold tracking-wide transition-all duration-300 flex-1 lg:flex-none ${activeTab === "biodata" ? "bg-[#2D1A11] text-[#D4AF37] shadow-md" : "text-gray-500 hover:bg-[#F8F3E9]"}`}>
                  Detail Profil
                </button>
                <button onClick={() => setActiveTab("alamat")}
                  className={`text-left px-4 py-2.5 rounded-lg font-sans text-[11px] font-bold tracking-wide transition-all duration-300 flex-1 lg:flex-none ${activeTab === "alamat" ? "bg-[#2D1A11] text-[#D4AF37] shadow-md" : "text-gray-500 hover:bg-[#F8F3E9]"}`}>
                  Buku Alamat
                </button>
              </div>
            </div>
          </div>

          <div className="flex-grow min-h-[350px]">
            {activeTab === "biodata" ? (
              <BiodataTab user={user} profile={profile} onUpdate={(newUser, newProfile) => { setUser(newUser); setProfile(newProfile); }} />
            ) : (
              <div className="animate-fadeIn bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-sm border border-[#C5A059]/10">
                <AddressTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}