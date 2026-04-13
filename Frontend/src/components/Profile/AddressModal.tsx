"use client";
import React, { useState, useEffect } from "react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: any | null;
}

const API_WILAYAH = "https://ibnux.github.io/data-indonesia";

export default function AddressModal({ isOpen, onClose, onSuccess, editData }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: "", phone_number: "", region: "", street: "", details: "", label: "", is_primary: false,
  });

  const [isChangingRegion, setIsChangingRegion] = useState(false); 
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [selectedRegion, setSelectedRegion] = useState({
    provId: "", provName: "", cityId: "", cityName: "", distId: "", distName: "", villId: "", villName: ""
  });

  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";

  // LOCK SCROLL: Mencegah halaman belakang di-scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          recipient_name: editData.recipient_name, phone_number: editData.phone_number,
          region: editData.region, street: editData.street, details: editData.details || "",
          label: editData.label || "", is_primary: editData.is_primary == 1,
        });
        setIsChangingRegion(false); 
      } else {
        setFormData({ recipient_name: "", phone_number: "", region: "", street: "", details: "", label: "", is_primary: false });
        setIsChangingRegion(true);  
      }
      setSelectedRegion({ provId: "", provName: "", cityId: "", cityName: "", distId: "", distName: "", villId: "", villName: "" });
      fetch(`${API_WILAYAH}/provinsi.json`)
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(err => console.error("Gagal menarik data provinsi:", err));
    }
  }, [isOpen, editData]);

  const handleProvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion({ provId: id, provName: name, cityId: "", cityName: "", distId: "", distName: "", villId: "", villName: "" });
    try {
      const res = await fetch(`${API_WILAYAH}/kabupaten/${id}.json`);
      setCities(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, cityId: id, cityName: name, distId: "", distName: "", villId: "", villName: "" }));
    try {
      const res = await fetch(`${API_WILAYAH}/kecamatan/${id}.json`);
      setDistricts(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleDistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, distId: id, distName: name, villId: "", villName: "" }));
    try {
      const res = await fetch(`${API_WILAYAH}/kelurahan/${id}.json`);
      setVillages(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleVillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, villId: id, villName: name }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalRegion = formData.region;
    if (isChangingRegion) {
      if (!selectedRegion.villId) {
        alert("Pilih wilayah hingga tingkat Kelurahan/Desa!");
        return;
      }
      finalRegion = `${selectedRegion.provName}, ${selectedRegion.cityName}, Kecamatan ${selectedRegion.distName}, Kelurahan ${selectedRegion.villName}`;
    }
    setIsLoading(true);
    const payload = { ...formData, region: finalRegion, label: formData.label === "" ? null : formData.label };
    const url = editData ? `http://127.0.0.1:8000/addresses/${editData.id}` : "http://127.0.0.1:8000/addresses";
    const method = editData ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method, credentials: "include",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { onSuccess(); onClose(); } else { alert("Gagal menyimpan alamat."); }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-white text-[#2D1A11] px-4 py-2 rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] border-none outline-none focus:ring-2 focus:ring-[#D9B35A]/50 transition-all font-semibold placeholder-[#8B7355]/40 text-sm appearance-none";

  return (
    <div 
      className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-[#2D1A11]/60 backdrop-blur-md animate-fadeIn transition-all duration-300 font-sans"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* CARD UTAMA: max-h dikurangi menjadi 70vh agar lebih pendek */}
      <div className="relative bg-[#F8F3E9] rounded-[1.5rem] shadow-[0_20px_50px_rgba(45,26,17,0.4)] w-full max-w-4xl flex flex-col overflow-hidden max-h-[70vh] border-none">
        
        {/* HEADER: Dibuat lebih tipis (py-3) */}
        <div className="relative z-10 bg-[#2D1A11] px-6 py-3 shadow-[0_5px_15px_rgba(0,0,0,0.2)] flex justify-between items-center shrink-0 border-none">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-lg font-serif font-bold tracking-wide flex items-center gap-2">
              <span className="text-xl">✧</span> 
              {editData ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all cursor-pointer">✕</button>
        </div>

        {/* CONTENT: Spacing space-y-3 agar lebih rapat */}
        <div className="relative z-10 p-5 sm:px-8 sm:py-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D9B35A]/50 scrollbar-track-transparent">
          <form id="addressForm" onSubmit={handleSubmit} className="space-y-3">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Nama Penerima</label>
                <input required type="text" name="recipient_name" placeholder="Nama..." value={formData.recipient_name} onChange={handleInputChange} className={inputClass} />
              </div>
              <div className="w-full">
                <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">No. Telepon</label>
                <input required type="text" name="phone_number" placeholder="08..." value={formData.phone_number} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Wilayah</label>
              {!isChangingRegion && formData.region ? (
                <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] border-none">
                  <span className="text-xs text-[#2D1A11] font-semibold truncate pr-3">{formData.region}</span>
                  <button type="button" onClick={() => setIsChangingRegion(true)} className="text-[#D9B35A] text-[9px] font-black uppercase tracking-wider hover:text-[#2D1A11] cursor-pointer">Ubah</button>
                </div>
              ) : (
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-inner border-none">
                  <select required={isChangingRegion} value={selectedRegion.provId} onChange={handleProvChange} className={inputClass}>
                    <option value="" disabled>1. Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.provId} value={selectedRegion.cityId} onChange={handleCityChange} className={inputClass}>
                    <option value="" disabled>2. Kota/Kabupaten</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.cityId} value={selectedRegion.distId} onChange={handleDistChange} className={inputClass}>
                    <option value="" disabled>3. Kecamatan</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.distId} value={selectedRegion.villId} onChange={handleVillChange} className={inputClass}>
                    <option value="" disabled>4. Kelurahan/Desa</option>
                    {villages.map(v => <option key={v.id} value={v.id}>{v.nama}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Detail Alamat</label>
              <textarea required name="street" placeholder="Jalan, No. Rumah..." rows={2} value={formData.street} onChange={handleInputChange} className={inputClass + " resize-none"} />
            </div>

            <div className="flex items-center gap-3 pt-1">
               <div className="flex-1">
                  <label className="block text-[#8B7355] text-[9px] font-black uppercase tracking-widest mb-1 pl-1">Patokan</label>
                  <input type="text" name="details" placeholder="Cth: Gerbang Biru..." value={formData.details} onChange={handleInputChange} className={inputClass} />
               </div>
               <div className="w-1/3 pt-4">
                  <button type="button" onClick={() => alert("G-Maps API Required")} className="w-full bg-white text-[#8B7355] text-[8px] font-black uppercase tracking-tighter py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1 hover:text-[#D9B35A]">📍 Maps</button>
               </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {['Rumah', 'Kantor'].map(label => (
                  <button key={label} type="button" onClick={() => setFormData({ ...formData, label: formData.label === label ? "" : label })} className={`px-4 py-1.5 text-[9px] uppercase tracking-widest rounded-full font-black transition-all ${formData.label === label ? 'bg-[#2D1A11] text-[#D9B35A]' : 'bg-white text-[#8B7355]'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, is_primary: !prev.is_primary }))}>
                <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${formData.is_primary ? 'bg-[#D9B35A]' : 'bg-white shadow-inner'}`}>
                  {formData.is_primary && <span className="text-[#2D1A11] text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-[9px] font-bold text-[#8B7355] uppercase tracking-widest">Utama</span>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER: Dibuat lebih tipis (py-3) */}
        <div className="p-4 sm:px-8 py-3 border-t border-[#8B7355]/10 flex justify-end items-center gap-4 bg-[#F8F3E9] shrink-0">
          <button onClick={onClose} className="text-[#8B7355] font-black text-[10px] uppercase tracking-widest hover:text-[#2D1A11]">Batal</button>
          <button type="submit" form="addressForm" disabled={isLoading} className="bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50">
            {isLoading ? "..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}