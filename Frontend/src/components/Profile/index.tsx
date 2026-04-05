"use client";

import { useState, useEffect } from "react";
import AddressTab from "./AddressTab"; // 👈 Import komponen Alamat kita

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

  // === STATE BARU UNTUK FITUR EDIT ===
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    phone: "",
  });

  // Load Data
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Ambil data User (Nama & Email)
        const resUser = await fetch("http://127.0.0.1:8000/user", {
          credentials: "include",
        });
        
        // 2. Ambil data Profile
        const resProfile = await fetch("http://127.0.0.1:8000/profile", {
          credentials: "include",
        });

        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData);
          console.log("DATA USER SAAT INI:", userData);
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

  // === FUNGSI MEMBUKA FORM EDIT ===
  const handleEditClick = (field: string) => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      date_of_birth: profile?.date_of_birth || "",
      gender: profile?.gender || "",
      phone: profile?.phone || "",
    });
    setEditingField(field);
  };

  // === FUNGSI MENYIMPAN DATA KE BACKEND ===
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Pastikan backend Laravel kamu menggunakan POST atau PUT untuk route ini
      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST", // Ubah ke "POST" jika Laravel kamu pakai Route::post()
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Update tampilan secara instan tanpa perlu refresh halaman
        setUser({ name: formData.name, email: formData.email });
        setProfile({
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          phone: formData.phone,
        });
        
        setEditingField(null); // Tutup form edit
      } else {
        const errorData = await res.json();
        alert("Gagal menyimpan: " + (errorData.message || "Pastikan data valid"));
      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Terjadi kesalahan pada server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center pt-32">Memuat profil...</div>;
  }

  return (
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
                
                {/* 1. Nama */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Nama</span>
                  {editingField === "name" ? (
                    <div className="w-2/3 flex items-center gap-3 justify-end">
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-none focus:border-[#C5A059]"
                      />
                      <button onClick={handleSave} disabled={isSaving} className="bg-[#C5A059] text-white px-4 py-1.5 rounded hover:bg-[#a88647]">{isSaving ? "..." : "Simpan"}</button>
                      <button onClick={() => setEditingField(null)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300">Batal</button>
                    </div>
                  ) : (
                    <>
                      <span className="w-1/3 text-[#3B414D] font-medium">{user?.name || "-"}</span>
                      <div className="w-1/3 text-right">
                        <button onClick={() => handleEditClick("name")} className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">Ubah</button>
                      </div>
                    </>
                  )}
                </div>

                {/* 2. Tanggal Lahir */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Tanggal Lahir</span>
                  {editingField === "date_of_birth" ? (
                    <div className="w-2/3 flex items-center gap-3 justify-end">
                      <input 
                        type="date" 
                        value={formData.date_of_birth} 
                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-none focus:border-[#C5A059]"
                      />
                      <button onClick={handleSave} disabled={isSaving} className="bg-[#C5A059] text-white px-4 py-1.5 rounded hover:bg-[#a88647]">{isSaving ? "..." : "Simpan"}</button>
                      <button onClick={() => setEditingField(null)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300">Batal</button>
                    </div>
                  ) : (
                    <>
                      <span className="w-1/3 text-[#3B414D] font-medium">{profile?.date_of_birth || ""}</span>
                      <div className="w-1/3 text-right">
                        <button onClick={() => handleEditClick("date_of_birth")} className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">
                          {profile?.date_of_birth ? "Ubah Tanggal Lahir" : "Tambah Tanggal Lahir"}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 3. Jenis Kelamin */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Jenis Kelamin</span>
                  {editingField === "gender" ? (
                    <div className="w-2/3 flex items-center gap-3 justify-end">
                      <select 
                        value={formData.gender} 
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      <button onClick={handleSave} disabled={isSaving} className="bg-[#C5A059] text-white px-4 py-1.5 rounded hover:bg-[#a88647]">{isSaving ? "..." : "Simpan"}</button>
                      <button onClick={() => setEditingField(null)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300">Batal</button>
                    </div>
                  ) : (
                    <>
                      <span className="w-1/3 text-[#3B414D] font-medium">{profile?.gender || ""}</span>
                      <div className="w-1/3 text-right">
                        <button onClick={() => handleEditClick("gender")} className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">
                          {profile?.gender ? "Ubah Jenis Kelamin" : "Tambah Jenis Kelamin"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* BAGIAN KONTAK */}
            <section>
              <h2 className="font-bold text-[#3B414D] mb-6 text-lg">Ubah Kontak</h2>
              
              <div className="space-y-6 text-sm">
                
                {/* 4. Email */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Email</span>
                  {editingField === "email" ? (
                    <div className="w-2/3 flex items-center gap-3 justify-end">
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-none focus:border-[#C5A059]"
                      />
                      <button onClick={handleSave} disabled={isSaving} className="bg-[#C5A059] text-white px-4 py-1.5 rounded hover:bg-[#a88647]">{isSaving ? "..." : "Simpan"}</button>
                      <button onClick={() => setEditingField(null)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300">Batal</button>
                    </div>
                  ) : (
                    <>
                      <div className="w-1/3 flex items-center gap-3">
                        <span className="text-[#3B414D] font-medium">{user?.email || "-"}</span>
                        {user?.email && (
                          <span className="text-gray-500 text-[11px] px-2 py-0.5 border border-gray-300 rounded">
                            Terverifikasi
                          </span>
                        )}
                      </div>
                      <div className="w-1/3 text-right">
                        <button onClick={() => handleEditClick("email")} className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">Ubah</button>
                      </div>
                    </>
                  )}
                </div>

                {/* 5. Nomor HP */}
                <div className="flex items-center border-b border-gray-200 pb-4">
                  <span className="w-1/3 text-gray-500">Nomor HP</span>
                  {editingField === "phone" ? (
                    <div className="w-2/3 flex items-center gap-3 justify-end">
                      <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-none focus:border-[#C5A059]"
                        placeholder="Contoh: 081234567890"
                      />
                      <button onClick={handleSave} disabled={isSaving} className="bg-[#C5A059] text-white px-4 py-1.5 rounded hover:bg-[#a88647]">{isSaving ? "..." : "Simpan"}</button>
                      <button onClick={() => setEditingField(null)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300">Batal</button>
                    </div>
                  ) : (
                    <>
                      <span className="w-1/3 text-[#3B414D] font-medium">{profile?.phone || ""}</span>
                      <div className="w-1/3 text-right">
                        <button onClick={() => handleEditClick("phone")} className="text-[#3B414D] font-bold hover:text-[#C5A059] transition-colors">
                          {profile?.phone ? "Ubah Nomor HP" : "Tambah Nomor HP"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
              </div>
            </section>
          </div>
        )}

        {/* TAB DAFTAR ALAMAT */}
        {activeTab === "alamat" && (
          // 👇 Komponen AddressTab dari file kamu
          <AddressTab />
        )}
      </div>
    </div>
  );
}