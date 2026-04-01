"use client";

import { useState, useEffect } from "react";

interface UserData {
  name: string;
  email: string;
}

interface ProfileData {
  date_of_birth: string | null;
  phone: string | null;
  gender: string | null;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("biodata");
  
  // State terpisah untuk User dan Profile
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Ambil data User (Nama & Email)
        const resUser = await fetch("http://127.0.0.1:8000/user", {
          credentials: "include",
        });
        
        // 2. Ambil data Profile (Lahir, HP, Gender)
        const resProfile = await fetch("http://127.0.0.1:8000/profile", {
          credentials: "include",
        });

        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData);
        }

        if (resProfile.ok) {
          const profileData = await resProfile.json();
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center">Memuat profil...</div>;
  }

 return (
    // PERHATIKAN BARIS INI: Saya mengubah p-6 menjadi px-6 pb-6 dan menambahkan pt-32 (padding-top)
    <div className="max-w-5xl mx-auto px-6 pb-6 pt-32 bg-white min-h-screen">
      
      {/* Header - Nama diambil dari data User */}
      <div className="flex items-center gap-2 mb-8 text-2xl font-bold text-[#3B414D]">
        <span>👤</span>
        <h1>{user?.name || "Pengguna"}</h1>
      </div>

      {/* Tabs - Tombol untuk pindah form */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("biodata")}
          className={`pb-3 px-6 text-sm font-semibold transition-colors ${
            activeTab === "biodata" ? "border-b-2 border-[#C5A059] text-[#C5A059]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Biodata Diri
        </button>
        <button
          onClick={() => setActiveTab("alamat")}
          className={`pb-3 px-6 text-sm font-semibold transition-colors ${
            activeTab === "alamat" ? "border-b-2 border-[#C5A059] text-[#C5A059]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Daftar Alamat
        </button>
      </div>

      {/* Area Konten Utama */}
      <div className="w-full">
        {activeTab === "biodata" && (
          <div className="space-y-10">
            {/* BAGIAN BIODATA */}
            <section>
              <h2 className="font-bold text-[#3B414D] mb-6 text-lg">Ubah Biodata Diri</h2>
              
              <div className="space-y-6 text-sm">
                {/* Nama */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Nama</span>
                  <span className="w-1/3 text-[#3B414D] font-medium">{user?.name || "-"}</span>
                  <div className="w-1/3 text-right">
                    <button className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">Ubah</button>
                  </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Tanggal Lahir</span>
                  <span className="w-1/3 text-[#3B414D] font-medium">{profile?.date_of_birth || ""}</span>
                  <div className="w-1/3 text-right">
                    <button className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">
                      {profile?.date_of_birth ? "Ubah Tanggal Lahir" : "Ubah Tanggal Lahir"}
                    </button>
                  </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Jenis Kelamin</span>
                  <span className="w-1/3 text-[#3B414D] font-medium">{profile?.gender || ""}</span>
                  <div className="w-1/3 text-right">
                    <button className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">
                      {profile?.gender ? "Ubah Jenis Kelamin" : "Ubah Jenis Kelamin"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* BAGIAN KONTAK */}
            <section>
              <h2 className="font-bold text-[#3B414D] mb-6 text-lg">Ubah Kontak</h2>
              
              <div className="space-y-6 text-sm">
                {/* Email */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Email</span>
                  <div className="w-1/3 flex items-center gap-3">
                    <span className="text-[#3B414D] font-medium">{user?.email || "-"}</span>
                    {user?.email && (
                      <span className="text-gray-500 text-[11px] px-2 py-0.5 border border-gray-300 rounded">
                        Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="w-1/3 text-right">
                    <button className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">Ubah</button>
                  </div>
                </div>

                {/* Nomor HP */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Nomor HP</span>
                  <span className="w-1/3 text-[#3B414D] font-medium">{profile?.phone || ""}</span>
                  <div className="w-1/3 text-right">
                    <button className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">
                      {profile?.phone ? "Ubah Nomor HP" : "Ubah Nomor HP"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB DAFTAR ALAMAT */}
        {activeTab === "alamat" && (
          <div className="py-16 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-5 text-sm">Belum ada alamat yang disimpan.</p>
            <button className="bg-[#C5A059] text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-[#a88647] transition-colors shadow-sm">
              Tambah Alamat Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}