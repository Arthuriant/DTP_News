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

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/previews/024/036/944/large_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

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

  const inputClasses = "w-full bg-[#FFFDF5] border border-[#C5A059]/30 text-[#2D1A11] px-5 py-3 rounded-2xl outline-none focus:border-[#C5A059] transition-all font-sans text-sm shadow-inner";

  const DataRow = ({ id, label, value, type = "text" }: any) => (
    <div className="group/row py-8 border-b border-gray-50 last:border-none">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <span className="w-full sm:w-1/3 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-0">
          {label}
        </span>
        {editingField === id ? (
          <div className="w-full sm:w-2/3 flex items-center gap-4 animate-soft-fade">
            {type === "select" ? (
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputClasses}>
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            ) : (
              <input type={type} value={formData[id as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [id]: e.target.value })} className={inputClasses} autoFocus />
            )}
            <div className="flex gap-2 shrink-0">
              <button onClick={handleSave} className="bg-[#2D1A11] text-[#D4AF37] px-5 py-3 rounded-xl text-xs font-black uppercase hover:scale-105 transition-transform">
                {isSaving ? "..." : "Save"}
              </button>
              <button onClick={() => setEditingField(null)} className="text-gray-400 hover:text-red-600 px-3 text-xs font-bold uppercase">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="w-full sm:w-2/3 flex justify-between items-center group/item">
            <span className="text-[#2D1A11] font-semibold text-lg">
              {id === 'pin' ? (value ? "••••••" : "—") : (value || "—")}
            </span>
            <button onClick={() => handleEditClick(id)} className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/item:opacity-100 transition-all hover:tracking-[0.3em]">
              Ubah
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* DATA PERSONAL */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl border border-[#C5A059]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain' }}></div>
        <h2 className="text-3xl font-bold text-[#2D1A11] mb-10 tracking-tight font-serif italic">Detail Biografi</h2>
        <div className="font-sans">
          <DataRow id="name" label="Nama Lengkap" value={user?.name} />
          <DataRow id="date_of_birth" label="Tanggal Lahir" value={profile?.date_of_birth} type="date" />
          <DataRow id="gender" label="Jenis Kelamin" value={profile?.gender} type="select" />
        </div>
      </div>

      {/* KONTAK & KEAMANAN */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl border border-[#C5A059]/10 relative overflow-hidden">
        <h2 className="text-3xl font-bold text-[#2D1A11] mb-10 tracking-tight font-serif italic">Keamanan Akun</h2>
        <div className="font-sans">
          <DataRow id="email" label="Email Korespondensi" value={user?.email} />
          <DataRow id="phone" label="Nomor Telepon" value={profile?.phone} />
          <DataRow id="pin" label="PIN Transaksi" value={profile?.pin} type="password" />
        </div>
      </div>
    </div>
  );
}