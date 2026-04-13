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

  // Komponen Helper untuk Baris Data
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
                  {id === 'pin' ? "••••••" : value}
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

      {/* SECTION: KEAMANAN (Bisa dihilangkan jika ditaruh di sidebar kiri) */}
      <div>
        <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-[#D9B35A] mb-4 flex items-center gap-3">
          <span className="w-8 h-[1.5px] bg-[#D9B35A]"></span> Autentikasi
        </h3>
        <div className="flex flex-col gap-1">
          <DataRow id="pin" label="PIN Transaksi" value={profile?.pin} type="password" placeholder="PIN belum diatur" />
        </div>
      </div>

    </div>
  );
}