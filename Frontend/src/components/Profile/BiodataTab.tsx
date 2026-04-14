"use client";

import { useState } from "react";

interface BiodataTabProps {
  user: any;
  profile: any;
  onUpdate: (user: any, profile: any) => void;
}

export default function BiodataTab({ user, profile, onUpdate }: BiodataTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    phone: profile?.phone || "",
    pin: profile?.pin || "",
  });

  // State khusus untuk Modal PIN
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");

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

  // Handler simpan untuk data umum (kecuali PIN via modal)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onUpdate({ name: formData.name, email: formData.email }, { ...formData });
        setEditingField(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIKA KHUSUS PIN ---
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya izinkan angka (replace semua karakter non-digit)
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 6) {
      setPinInput(val);
    }
  };

  const handleSavePin = async () => {
    if (pinInput.length !== 6) return;
    
    setIsSaving(true);
    try {
      const updatedData = { ...formData, pin: pinInput };
      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        onUpdate({ name: formData.name, email: formData.email }, { ...updatedData });
        setFormData(updatedData); // update state form lokal
        setIsPinModalOpen(false);
        setPinInput(""); // reset input
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Komponen Helper untuk Baris Data (Standar)
  const DataRow = ({ id, label, value, type = "text", placeholder = "Belum dikonfigurasi" }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-[#FFFDF5] transition-colors group">
      <div className="mb-2 sm:mb-0 w-1/3 shrink-0">
        <p className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wider">{label}</p>
      </div>
      
      <div className="flex-1 w-full">
        {editingField === id ? (
          // === MODE EDIT ===
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-fadeIn">
            {type === "select" ? (
              <select 
                value={formData.gender} 
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })} 
                className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 text-[#2A1B14] px-4 py-2.5 rounded-xl outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] transition-all font-sans text-sm shadow-inner"
              >
                <option value="">Pilih Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            ) : (
              <input 
                type={type} 
                value={formData[id as keyof typeof formData]} 
                onChange={(e) => setFormData({ ...formData, [id]: e.target.value })} 
                className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 text-[#2A1B14] px-4 py-2.5 rounded-xl outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] transition-all font-serif font-bold text-base shadow-inner" 
                autoFocus 
              />
            )}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gradient-to-r from-[#D9B35A] to-[#C5A059] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70"
              >
                {isSaving ? "..." : "Simpan"}
              </button>
              <button 
                onClick={() => setEditingField(null)} 
                className="text-[#8B7355] hover:text-rose-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          // === MODE VIEW ===
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {value ? (
                <p className={`text-[#2A1B14] font-bold ${id === 'name' ? 'text-lg font-serif' : 'text-base font-sans'}`}>
                  {value}
                </p>
              ) : (
                <p className="text-gray-400 italic text-sm">{placeholder}</p>
              )}
              
              {/* Badge Terverifikasi Khusus Email */}
              {id === 'email' && value && (
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">Terverifikasi</span>
              )}
            </div>
            
            <button 
              onClick={() => handleEditClick(id)} 
              className="text-[#D9B35A] text-xs font-bold uppercase tracking-widest hover:text-[#2A1B14] transition-colors opacity-0 group-hover:opacity-100 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-[#D9B35A]/20"
            >
              {value ? "Ubah" : "Tambah"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full font-sans animate-fadeIn">
      
      {/* SECTION: IDENTITAS RESMI */}
      <div className="mb-12">
        <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-[#D9B35A] mb-4 flex items-center gap-3">
          <span className="w-8 h-[1.5px] bg-[#D9B35A]"></span> Identitas Resmi
        </h3>
        <div className="flex flex-col gap-1">
          <DataRow id="name" label="Nama Lengkap" value={user?.name} placeholder="Nama belum diisi" />
          <DataRow id="date_of_birth" label="Tanggal Lahir" value={profile?.date_of_birth} type="date" />
          <DataRow id="gender" label="Jenis Kelamin" value={profile?.gender} type="select" />
        </div>
      </div>

      {/* SECTION: INFORMASI KONTAK */}
      <div className="mb-12">
        <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-[#D9B35A] mb-4 flex items-center gap-3">
          <span className="w-8 h-[1.5px] bg-[#D9B35A]"></span> Informasi Kontak
        </h3>
        <div className="flex flex-col gap-1">
          <DataRow id="email" label="Alamat Email" value={user?.email} type="email" placeholder="Email belum diisi" />
          <DataRow id="phone" label="Nomor Ponsel" value={profile?.phone} type="tel" placeholder="Belum terhubung" />
        </div>
      </div>

      {/* SECTION: KEAMANAN */}
      <div>
        <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-[#D9B35A] mb-4 flex items-center gap-3">
          <span className="w-8 h-[1.5px] bg-[#D9B35A]"></span> Autentikasi
        </h3>
        <div className="flex flex-col gap-1">
          {/* Baris Khusus untuk PIN yang memicu Modal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-[#FFFDF5] transition-colors group">
            <div className="mb-2 sm:mb-0 w-1/3 shrink-0">
              <p className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wider">PIN Transaksi</p>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                {profile?.pin ? (
                  <p className="text-[#2A1B14] font-bold text-xl tracking-[0.3em] mt-1">••••••</p>
                ) : (
                  <p className="text-gray-400 italic text-sm">PIN belum diatur</p>
                )}
              </div>
              
              <button 
                onClick={() => {
                  setPinInput(""); // Kosongkan input setiap kali buka modal
                  setIsPinModalOpen(true);
                }} 
                className="text-[#D9B35A] text-xs font-bold uppercase tracking-widest hover:text-[#2A1B14] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-[#D9B35A]/30 hover:border-[#D9B35A]"
              >
                {profile?.pin ? "Ganti PIN" : "Buat PIN"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL GANTI PIN DENGAN DESAIN NUSANTARA  */}
      {/* ========================================= */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B14]/40 backdrop-blur-sm animate-fadeIn p-4">
          <div className="bg-[#FFFDF5] w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-[#D9B35A]/30 transform transition-all relative overflow-hidden">
            
            {/* Ornamen Desain (Opsional untuk estetika) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D9B35A] to-transparent"></div>

            <div className="text-center mb-6">
              <h4 className="text-xl font-serif font-bold text-[#2A1B14] mb-2">
                {profile?.pin ? "Ubah PIN Transaksi" : "Buat PIN Baru"}
              </h4>
              <p className="text-xs text-[#8B7355] leading-relaxed">
                Masukkan <strong className="text-[#D9B35A]">6 digit angka</strong> untuk mengamankan transaksi Anda.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pinInput}
                onChange={handlePinChange}
                placeholder="••••••"
                autoFocus
                className="w-4/5 bg-white border-2 border-[#D9B35A]/40 text-[#2A1B14] px-4 py-3 rounded-2xl outline-none focus:border-[#D9B35A] focus:ring-4 focus:ring-[#D9B35A]/10 transition-all font-sans text-3xl text-center tracking-[0.5em] shadow-inner placeholder:text-gray-300"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="flex-1 py-3.5 text-[#8B7355] hover:text-[#2A1B14] text-[11px] font-black uppercase tracking-widest transition-colors border border-[#8B7355]/20 hover:bg-[#8B7355]/5 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSavePin}
                disabled={isSaving || pinInput.length !== 6}
                className="flex-1 bg-gradient-to-r from-[#D9B35A] to-[#C5A059] text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSaving ? "Memproses..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}