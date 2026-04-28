"use client";

import { useState, useEffect } from "react";
import AddressTab from "./AddressTab";
<<<<<<< HEAD

interface UserData {
  name: string;
  email: string;
}

interface ProfileData {
  date_of_birth: string | null;
  phone: string | null;
  gender: string | null;
  pin: string | null;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("biodata");
  
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    pin: "",
  });

  // ── STATE BARU UNTUK UPDATE PASSWORD ──────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/previews/024/036/944/large_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

=======
import BiodataTab from "./BiodataTab";
import { AuthService } from "@/services/AuthService";
import { ProfileService } from "@/services/ProfileService";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("biodata");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

>>>>>>> 509c12324dd52c49fa5c6cb968d05ccf9007dcc1
  useEffect(() => {
      const loadAllData = async () => {
        try {

<<<<<<< HEAD
        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData);
=======
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
>>>>>>> 509c12324dd52c49fa5c6cb968d05ccf9007dcc1
        }
      };

<<<<<<< HEAD
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

  const handleEditClick = (field: string) => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      date_of_birth: profile?.date_of_birth || "",
      gender: profile?.gender || "",
      phone: profile?.phone || "",
      pin: profile?.pin || "",
    });
    setEditingField(field);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setUser({ name: formData.name, email: formData.email });
        setProfile({
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          phone: formData.phone,
          pin: formData.pin,
        });
        setEditingField(null); 
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
=======
      loadAllData();
    }, []);
>>>>>>> 509c12324dd52c49fa5c6cb968d05ccf9007dcc1

  // ── FUNGSI UPDATE PASSWORD ─────────────────────────────────────
  const handleUpdatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Validasi frontend
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.new_password_confirmation) {
      setPasswordError("Semua field password wajib diisi");
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError("Password baru minimal 6 karakter");
      return;
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordError("Konfirmasi password tidak cocok");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/profile/update-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });

      if (res.ok) {
        setPasswordSuccess("Password berhasil diperbarui!");
        setPasswordForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        const errData = await res.json();
        setPasswordError(errData.message || "Gagal memperbarui password");
      }
    } catch (err) {
      setPasswordError("Terjadi kesalahan pada server");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF5]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D9B35A] border-t-transparent"></div>
      </div>
    );
  }

<<<<<<< HEAD
  const inputClasses = "w-full flex-1 bg-transparent border-b-2 border-[#C5A059]/30 text-gray-900 px-1 py-2 outline-none focus:border-[#C5A059] transition-all font-sans text-sm placeholder:text-gray-400";

  return (
    <section 
      className="relative min-h-screen bg-[#F8F3E9] pt-32 pb-24 overflow-hidden"
      style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
    >
=======
  return (
    <section className="relative min-h-screen bg-[#FFFDF5] pt-40 md:pt-48 lg:pt-[200px] pb-20 font-sans text-[#2A1B14] overflow-x-hidden">
      
      {/* Background Ornamen */}
>>>>>>> 509c12324dd52c49fa5c6cb968d05ccf9007dcc1
      <div 
        className="absolute right-0 top-10 w-[500px] h-[500px] pointer-events-none opacity-[0.02] z-0" 
        style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'top right' }}
      ></div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
        
<<<<<<< HEAD
        {/* HERO BANNER */}
        <div className="relative bg-[#2D1A11] rounded-[2rem] shadow-2xl border border-[#C5A059]/40 overflow-hidden mb-10">
          <div 
            className="absolute -right-20 -top-20 w-[400px] h-[400px] z-0 opacity-40 pointer-events-none transform rotate-12"
            style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
          ></div>
          <div 
            className="absolute -left-20 -bottom-20 w-[300px] h-[300px] z-0 opacity-20 pointer-events-none transform -rotate-12"
            style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
          ></div>

          <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#C5A059] rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="w-28 h-28 bg-[#F8F3E9] rounded-full flex items-center justify-center border-4 border-[#C5A059] relative z-10 shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                <span className="text-5xl">👑</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[#C5A059] font-sans text-sm tracking-widest uppercase mb-2 font-semibold">Tamu Kehormatan</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3E9] tracking-wide mb-2">
                {user?.name || "Pengguna"}
              </h1>
              <p className="text-[#F8F3E9]/60 font-sans text-sm flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                Akun Terverifikasi
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-[#C5A059]/10 sticky top-32">
              <h3 className="text-[#C5A059] text-xs font-sans font-bold uppercase tracking-widest mb-6 px-4">Menu Pengaturan</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab("biodata")}
                  className={`text-left px-5 py-4 rounded-2xl font-sans text-sm font-medium transition-all duration-300 ${activeTab === "biodata" ? "bg-[#2D1A11] text-[#C5A059] shadow-md shadow-[#2D1A11]/20" : "text-gray-600 hover:bg-[#F8F3E9] hover:text-[#2D1A11]"}`}
                >
                  <span className="mr-3">{activeTab === "biodata" ? "✨" : "👤"}</span>
                  Biodata Diri
                </button>
                <button
                  onClick={() => setActiveTab("keamanan")}
                  className={`text-left px-5 py-4 rounded-2xl font-sans text-sm font-medium transition-all duration-300 ${activeTab === "keamanan" ? "bg-[#2D1A11] text-[#C5A059] shadow-md shadow-[#2D1A11]/20" : "text-gray-600 hover:bg-[#F8F3E9] hover:text-[#2D1A11]"}`}
                >
                  <span className="mr-3">{activeTab === "keamanan" ? "✨" : "🔒"}</span>
                  Keamanan
                </button>
                <button
                  onClick={() => setActiveTab("alamat")}
                  className={`text-left px-5 py-4 rounded-2xl font-sans text-sm font-medium transition-all duration-300 ${activeTab === "alamat" ? "bg-[#2D1A11] text-[#C5A059] shadow-md shadow-[#2D1A11]/20" : "text-gray-600 hover:bg-[#F8F3E9] hover:text-[#2D1A11]"}`}
                >
                  <span className="mr-3">{activeTab === "alamat" ? "✨" : "📍"}</span>
                  Daftar Alamat
                </button>
              </div>
            </div>
=======
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
>>>>>>> 509c12324dd52c49fa5c6cb968d05ccf9007dcc1
          </div>

          {/* Container Putih Utama */}
          <div className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(42,27,20,0.03)] p-6 md:p-10 border border-white/60 relative overflow-hidden min-h-[500px]">
            
<<<<<<< HEAD
            {/* TAB BIODATA */}
            {activeTab === "biodata" && (
              <div className="space-y-8">
                
                {/* KARTU 1: INFORMASI PRIBADI */}
                <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg border border-[#C5A059]/10 overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-48 h-48 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <h2 className="text-2xl font-bold text-[#2D1A11]">Informasi Pribadi</h2>
                    </div>
                    <div className="space-y-6 font-sans">
                      {/* Nama */}
                      <div className="flex flex-col sm:flex-row sm:items-center py-2">
                        <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Nama Lengkap</span>
                        {editingField === "name" ? (
                          <div className="w-full sm:w-2/3 flex items-center gap-3">
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClasses} autoFocus/>
                            <button onClick={handleSave} disabled={isSaving} className="text-[#C5A059] text-sm font-bold hover:text-[#2D1A11] transition-colors">{isSaving ? "..." : "Simpan"}</button>
                            <button onClick={() => setEditingField(null)} className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors">Batal</button>
                          </div>
                        ) : (
                          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
                            <span className="text-[#2D1A11] font-medium text-lg">{user?.name || "-"}</span>
                            <button onClick={() => handleEditClick("name")} className="text-[#C5A059] text-sm font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity">Ubah</button>
                          </div>
                        )}
                      </div>

                      {/* Tanggal Lahir */}
                      <div className="flex flex-col sm:flex-row sm:items-center py-2 border-t border-gray-50 pt-6">
                        <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Tanggal Lahir</span>
                        {editingField === "date_of_birth" ? (
                          <div className="w-full sm:w-2/3 flex items-center gap-3">
                            <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className={inputClasses} autoFocus/>
                            <button onClick={handleSave} disabled={isSaving} className="text-[#C5A059] text-sm font-bold hover:text-[#2D1A11] transition-colors">{isSaving ? "..." : "Simpan"}</button>
                            <button onClick={() => setEditingField(null)} className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors">Batal</button>
                          </div>
                        ) : (
                          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
                            <span className="text-[#2D1A11] font-medium text-lg">{profile?.date_of_birth || "-"}</span>
                            <button onClick={() => handleEditClick("date_of_birth")} className="text-[#C5A059] text-sm font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity">{profile?.date_of_birth ? "Ubah" : "Tambah"}</button>
                          </div>
                        )}
                      </div>

                      {/* Jenis Kelamin */}
                      <div className="flex flex-col sm:flex-row sm:items-center py-2 border-t border-gray-50 pt-6">
                        <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Jenis Kelamin</span>
                        {editingField === "gender" ? (
                          <div className="w-full sm:w-2/3 flex items-center gap-3">
                            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className={inputClasses} autoFocus>
                              <option value="">Pilih...</option>
                              <option value="Laki-laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                            </select>
                            <button onClick={handleSave} disabled={isSaving} className="text-[#C5A059] text-sm font-bold hover:text-[#2D1A11] transition-colors">{isSaving ? "..." : "Simpan"}</button>
                            <button onClick={() => setEditingField(null)} className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors">Batal</button>
                          </div>
                        ) : (
                          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
                            <span className="text-[#2D1A11] font-medium text-lg">{profile?.gender || "-"}</span>
                            <button onClick={() => handleEditClick("gender")} className="text-[#C5A059] text-sm font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity">{profile?.gender ? "Ubah" : "Tambah"}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KARTU 2: KONTAK & KEAMANAN */}
                <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg border border-[#C5A059]/10 overflow-hidden group">
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <h2 className="text-2xl font-bold text-[#2D1A11]">Kontak & Keamanan</h2>
                    </div>
                    <div className="space-y-6 font-sans">
                      {/* Email */}
                      <div className="flex flex-col sm:flex-row sm:items-center py-2">
                        <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Alamat Email</span>
                        {editingField === "email" ? (
                          <div className="w-full sm:w-2/3 flex items-center gap-3">
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClasses} autoFocus/>
                            <button onClick={handleSave} disabled={isSaving} className="text-[#C5A059] text-sm font-bold hover:text-[#2D1A11] transition-colors">{isSaving ? "..." : "Simpan"}</button>
                            <button onClick={() => setEditingField(null)} className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors">Batal</button>
                          </div>
                        ) : (
                          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
                            <div className="flex items-center gap-3">
                              <span className="text-[#2D1A11] font-medium text-lg">{user?.email || "-"}</span>
                              {user?.email && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-bold">Verified</span>}
                            </div>
                            <button onClick={() => handleEditClick("email")} className="text-[#C5A059] text-sm font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity">Ubah</button>
                          </div>
                        )}
                      </div>

                      {/* Nomor HP */}
                      <div className="flex flex-col sm:flex-row sm:items-center py-2 border-t border-gray-50 pt-6">
                        <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Nomor Telepon</span>
                        {editingField === "phone" ? (
                          <div className="w-full sm:w-2/3 flex items-center gap-3">
                            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="08..." className={inputClasses} autoFocus/>
                            <button onClick={handleSave} disabled={isSaving} className="text-[#C5A059] text-sm font-bold hover:text-[#2D1A11] transition-colors">{isSaving ? "..." : "Simpan"}</button>
                            <button onClick={() => setEditingField(null)} className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors">Batal</button>
                          </div>
                        ) : (
                          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
                            <span className="text-[#2D1A11] font-medium text-lg">{profile?.phone || "-"}</span>
                            <button onClick={() => handleEditClick("phone")} className="text-[#C5A059] text-sm font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity">{profile?.phone ? "Ubah" : "Tambah"}</button>
                          </div>
                        )}
                      </div>

                      {/* PIN */}
                      <div className="flex flex-col sm:flex-row sm:items-center py-2 border-t border-gray-50 pt-6">
                        <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">PIN</span>
                        {editingField === "pin" ? (
                          <div className="w-full sm:w-2/3 flex items-center gap-3">
                            <input 
                              type="password"
                              value={formData.pin} 
                              onChange={(e) => { if (e.target.value.length <= 6) setFormData({...formData, pin: e.target.value}); }} 
                              placeholder="Masukkan PIN 6 karakter" 
                              maxLength={6}
                              className={inputClasses} 
                              autoFocus
                            />
                            <button onClick={handleSave} disabled={isSaving} className="text-[#C5A059] text-sm font-bold hover:text-[#2D1A11] transition-colors">{isSaving ? "..." : "Simpan"}</button>
                            <button onClick={() => setEditingField(null)} className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors">Batal</button>
                          </div>
                        ) : (
                          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
                            <span className="text-[#2D1A11] font-medium text-lg">{profile?.pin ? "••••••" : "-"}</span>
                            <button onClick={() => handleEditClick("pin")} className="text-[#C5A059] text-sm font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity">{profile?.pin ? "Ubah" : "Tambah"}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB KEAMANAN - GANTI PASSWORD */}
            {activeTab === "keamanan" && (
              <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg border border-[#C5A059]/10 overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-48 h-48 opacity-5 pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                <div className="relative z-10">
                  <div className="mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-[#2D1A11]">Ganti Password</h2>
                    <p className="text-gray-400 text-sm font-sans mt-1">Pastikan password baru minimal 6 karakter</p>
                  </div>

                  {/* Pesan error */}
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 text-red-500 px-5 py-3 rounded-2xl text-sm font-sans mb-6">
                      {passwordError}
                    </div>
                  )}

                  {/* Pesan sukses */}
                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-5 py-3 rounded-2xl text-sm font-sans mb-6">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="space-y-6 font-sans">
                    {/* Password Lama */}
                    <div className="flex flex-col sm:flex-row sm:items-center py-2">
                      <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Password Lama</span>
                      <input
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                        placeholder="Masukkan password lama"
                        className={`w-full sm:w-2/3 ${inputClasses}`}
                      />
                    </div>

                    {/* Password Baru */}
                    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-t border-gray-50 pt-6">
                      <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Password Baru</span>
                      <input
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                        placeholder="Minimal 6 karakter"
                        className={`w-full sm:w-2/3 ${inputClasses}`}
                      />
                    </div>

                    {/* Konfirmasi Password Baru */}
                    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-t border-gray-50 pt-6">
                      <span className="w-full sm:w-1/3 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-0">Konfirmasi Password</span>
                      <input
                        type="password"
                        value={passwordForm.new_password_confirmation}
                        onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                        placeholder="Ulangi password baru"
                        className={`w-full sm:w-2/3 ${inputClasses}`}
                      />
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex justify-end pt-4 border-t border-gray-50">
                      <button
                        onClick={handleUpdatePassword}
                        disabled={isSavingPassword}
                        className="bg-[#2D1A11] text-[#C5A059] px-8 py-3 rounded-2xl text-sm font-bold font-sans hover:bg-[#3d2518] transition-colors disabled:opacity-50"
                      >
                        {isSavingPassword ? "Menyimpan..." : "Simpan Password"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB ALAMAT */}
            {activeTab === "alamat" && (
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-[#C5A059]/10 font-sans">
                <AddressTab />
              </div>
            )}
=======
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
>>>>>>> 509c12324dd52c49fa5c6cb968d05ccf9007dcc1
          </div>

        </div>

      </div>
    </section>
  );
}