"use client";

import { useState, useEffect } from "react";
import AddressTab from "./AddressTab";

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

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const resUser = await fetch("http://127.0.0.1:8000/user", {
          credentials: "include",
        });
        
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
      <div className="flex justify-center items-center h-screen bg-[#F8F3E9]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C5A059]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 bg-[#2D1A11] rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full flex-1 bg-transparent border-b-2 border-[#C5A059]/30 text-gray-900 px-1 py-2 outline-none focus:border-[#C5A059] transition-all font-sans text-sm placeholder:text-gray-400";

  return (
    <section 
      className="relative min-h-screen bg-[#F8F3E9] pt-32 pb-24 overflow-hidden"
      style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
    >
      <div 
        className="absolute right-[-5%] top-0 w-[500px] h-[700px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale fixed"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top'
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
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
          </div>

          {/* KONTEN UTAMA */}
          <div className="w-full lg:w-3/4">
            
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
          </div>
        </div>
      </div>
    </section>
  );
}