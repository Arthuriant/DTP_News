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
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header - Nama diambil dari data User */}
      <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
        <span>👤</span>
        <h1>{user?.name || "Pengguna"}</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("biodata")}
          className={`pb-3 px-4 text-sm font-medium ${
            activeTab === "biodata" ? "border-b-2 border-emerald-500 text-emerald-600" : "text-gray-500"
          }`}
        >
          Biodata Diri
        </button>
        <button
          onClick={() => setActiveTab("alamat")}
          className={`pb-3 px-4 text-sm font-medium ${
            activeTab === "alamat" ? "border-b-2 border-emerald-500 text-emerald-600" : "text-gray-500"
          }`}
        >
          Daftar Alamat
        </button>
      </div>

      <div className="max-w-2xl">
        {activeTab === "biodata" && (
          <div className="space-y-8">
            {/* BAGIAN BIODATA (Data Campuran) */}
            <section>
              <h2 className="font-semibold mb-4">Ubah Biodata Diri</h2>
              <div className="space-y-4 text-sm">
                {/* Nama dari table User */}
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Nama</span>
                  <div className="col-span-2 flex justify-between">
                    <span>{user?.name || "-"}</span>
                    <button className="text-emerald-500 font-medium">Ubah</button>
                  </div>
                </div>

                {/* Tanggal Lahir dari table Profile */}
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Tanggal Lahir</span>
                  <div className="col-span-2">
                    {profile?.date_of_birth ? (
                      <div className="flex justify-between">
                        <span>{profile.date_of_birth}</span>
                        <button className="text-emerald-500 font-medium">Ubah</button>
                      </div>
                    ) : (
                      <button className="text-emerald-500 font-medium">Tambah Tanggal Lahir</button>
                    )}
                  </div>
                </div>

                {/* Gender dari table Profile */}
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Jenis Kelamin</span>
                  <div className="col-span-2">
                    {profile?.gender ? (
                      <div className="flex justify-between">
                        <span>{profile.gender}</span>
                        <button className="text-emerald-500 font-medium">Ubah</button>
                      </div>
                    ) : (
                      <button className="text-emerald-500 font-medium">Tambah Jenis Kelamin</button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* BAGIAN KONTAK */}
            <section>
              <h2 className="font-semibold mb-4">Ubah Kontak</h2>
              <div className="space-y-4 text-sm">
                {/* Email dari table User */}
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Email</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span>{user?.email || "-"}</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1 rounded">Terverifikasi</span>
                    <button className="text-emerald-500 font-medium ml-auto">Ubah</button>
                  </div>
                </div>

                {/* Nomor HP dari table Profile */}
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Nomor HP</span>
                  <div className="col-span-2">
                    {profile?.phone ? (
                      <div className="flex justify-between">
                        <span>{profile.phone}</span>
                        <button className="text-emerald-500 font-medium">Ubah</button>
                      </div>
                    ) : (
                      <button className="text-emerald-500 font-medium">Tambah Nomor HP</button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "alamat" && (
          <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-gray-400 mb-4 text-sm">Belum ada alamat yang disimpan.</p>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-600 transition-colors">
              Tambah Alamat Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}