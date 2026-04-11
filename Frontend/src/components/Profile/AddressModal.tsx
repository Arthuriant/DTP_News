"use client";
import React, { useState, useEffect } from "react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: any | null;
}

// API IBNUX - Sangat stabil dan anti CORS
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
    provId: "", provName: "",
    cityId: "", cityName: "",
    distId: "", distName: "",
    villId: "", villName: ""
  });

  // URL Ornamen Nusantara
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";

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
      setCities([]); setDistricts([]); setVillages([]);
      
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
    setCities([]); setDistricts([]); setVillages([]);
    
    try {
      const res = await fetch(`${API_WILAYAH}/kabupaten/${id}.json`);
      setCities(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, cityId: id, cityName: name, distId: "", distName: "", villId: "", villName: "" }));
    setDistricts([]); setVillages([]);
    
    try {
      const res = await fetch(`${API_WILAYAH}/kecamatan/${id}.json`);
      setDistricts(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleDistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, distId: id, distName: name, villId: "", villName: "" }));
    setVillages([]);
    
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

  if (!isOpen) return null;

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

      if (res.ok) {
        onSuccess(); onClose();
      } else {
        alert("Gagal menyimpan alamat.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const inputClass = "w-full bg-[#F5EFE6] text-[#2D1A11] px-5 py-3.5 rounded-2xl shadow-[inset_4px_4px_10px_rgba(45,26,17,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] border-none outline-none focus:ring-2 focus:ring-[#D9B35A]/50 transition-all font-semibold placeholder-[#8B7355]/40 appearance-none";

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-6 sm:p-12 lg:p-6 bg-[#2D1A11]/60 backdrop-blur-md animate-fadeIn transition-all duration-300 font-sans"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-[#F8F3E9] rounded-[2.5rem] shadow-[0_25px_60px_rgba(45,26,17,0.5)] w-full max-w-4xl flex flex-col overflow-hidden max-h-[75vh] border-none">
        <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: '150px' }}></div>
        <div className="absolute -right-10 -top-10 w-[300px] h-[400px] pointer-events-none z-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'top right' }}></div>
        <div className="relative z-10 bg-[#2D1A11] px-8 py-6 shadow-[0_10px_30px_rgba(45,26,17,0.2)] flex justify-between items-center shrink-0 border-none">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-2xl font-serif font-bold tracking-wide flex items-center gap-2 drop-shadow-md">
              <span className="text-3xl">✧</span> 
              {editData ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </h2>
            <p className="text-[#F8F3E9]/60 text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold">
              Lengkapi detail pengiriman
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="relative z-50 w-10 h-10 bg-[#F8F3E9]/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all duration-300 shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] border-none shrink-0 cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="relative z-10 p-6 sm:px-10 sm:py-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D9B35A]/50 scrollbar-track-transparent">
          <form id="addressForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full group">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-2 pl-2 group-focus-within:text-[#D9B35A] transition-colors">Nama Penerima</label>
                <input required type="text" name="recipient_name" placeholder="Cth: Raden Mas..." value={formData.recipient_name} onChange={handleInputChange} className={inputClass} />
              </div>
              <div className="w-full group">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-2 pl-2 group-focus-within:text-[#D9B35A] transition-colors">No. Telepon</label>
                <input required type="text" name="phone_number" placeholder="Cth: 0812..." value={formData.phone_number} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>

            <div className="group">
              <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-2 pl-2 group-focus-within:text-[#D9B35A] transition-colors">Provinsi & Wilayah</label>
              
              {!isChangingRegion && formData.region ? (
                <div className="flex items-center justify-between bg-[#F5EFE6] px-5 py-4 rounded-2xl shadow-[inset_4px_4px_10px_rgba(45,26,17,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] border-none">
                  <span className="text-sm text-[#2D1A11] font-semibold truncate pr-4">{formData.region}</span>
                  <button type="button" onClick={() => setIsChangingRegion(true)} className="text-[#D9B35A] text-xs font-black uppercase tracking-wider shrink-0 hover:text-[#2D1A11] transition-colors cursor-pointer relative z-10">Ubah</button>
                </div>
              ) : (
                <div className="space-y-4 bg-[#F5EFE6] p-5 rounded-[2rem] shadow-[inset_4px_4px_10px_rgba(45,26,17,0.05),inset_-4px_-4px_10px_rgba(255,255,255,0.8)] border-none relative z-10">
                  <select required={isChangingRegion} value={selectedRegion.provId} onChange={handleProvChange} className={inputClass + " cursor-pointer"}>
                    <option value="" disabled>1. Pilih Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id} className="text-[#2D1A11]">{p.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.provId} value={selectedRegion.cityId} onChange={handleCityChange} className={inputClass + " cursor-pointer disabled:opacity-50"}>
                    <option value="" disabled>2. Pilih Kota/Kabupaten</option>
                    {cities.map(c => <option key={c.id} value={c.id} className="text-[#2D1A11]">{c.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.cityId} value={selectedRegion.distId} onChange={handleDistChange} className={inputClass + " cursor-pointer disabled:opacity-50"}>
                    <option value="" disabled>3. Pilih Kecamatan</option>
                    {districts.map(d => <option key={d.id} value={d.id} className="text-[#2D1A11]">{d.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.distId} value={selectedRegion.villId} onChange={handleVillChange} className={inputClass + " cursor-pointer disabled:opacity-50"}>
                    <option value="" disabled>4. Pilih Kelurahan/Desa</option>
                    {villages.map(v => <option key={v.id} value={v.id} className="text-[#2D1A11]">{v.nama}</option>)}
                  </select>
                  
                  {editData && (
                    <button type="button" onClick={() => setIsChangingRegion(false)} className="w-full text-center text-xs text-[#8B7355] font-bold uppercase tracking-widest hover:text-[#2D1A11] mt-2 transition-colors cursor-pointer">
                      Batal Ubah Wilayah
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="group">
              <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-2 pl-2 group-focus-within:text-[#D9B35A] transition-colors">Detail Jalan & Alamat</label>
              <textarea required name="street" placeholder="Nama Jalan, Gedung, No. Rumah..." rows={3} value={formData.street} onChange={handleInputChange} className={inputClass + " resize-none"} />
            </div>

            <div className="group">
              <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-2 pl-2 group-focus-within:text-[#D9B35A] transition-colors">Patokan (Opsional)</label>
              <input type="text" name="details" placeholder="Cth: Cat rumah warna hijau..." value={formData.details} onChange={handleInputChange} className={inputClass} />
            </div>

            <div className="w-full h-24 bg-[#F5EFE6] shadow-[inset_4px_4px_10px_rgba(45,26,17,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] rounded-[2rem] flex items-center justify-center relative overflow-hidden border-none group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://maps.gstatic.com/mapfiles/transparent.png')] bg-repeat mix-blend-multiply"></div>
              <button type="button" onClick={() => alert("Fitur Google Maps membutuhkan Integrasi API Key khusus.")} className="bg-[#F8F3E9] text-[#8B7355] font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full shadow-[6px_6px_15px_rgba(45,26,17,0.1),-6px_-6px_15px_rgba(255,255,255,1)] z-10 flex items-center gap-2 hover:text-[#D9B35A] hover:shadow-[inset_4px_4px_10px_rgba(45,26,17,0.05),inset_-4px_-4px_10px_rgba(255,255,255,0.8)] transition-all duration-300 border-none cursor-pointer">
                <span className="text-lg">📍</span> Pin Lokasi Maps
              </button>
            </div>

            <div className="pt-2">
              <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-3 pl-2">Tandai Sebagai:</label>
              <div className="flex gap-4">
                {['Rumah', 'Kantor'].map(label => (
                  <button 
                    key={label} 
                    type="button" 
                    onClick={() => setFormData({ ...formData, label: formData.label === label ? "" : label })} 
                    className={`px-6 py-2.5 text-[11px] uppercase tracking-widest rounded-full font-black transition-all duration-300 border-none cursor-pointer relative z-10 ${
                      formData.label === label 
                        ? 'bg-[#F8F3E9] text-[#D9B35A] shadow-[inset_4px_4px_10px_rgba(45,26,17,0.1),inset_-4px_-4px_10px_rgba(255,255,255,1)]' 
                        : 'bg-[#F8F3E9] text-[#8B7355] shadow-[6px_6px_15px_rgba(45,26,17,0.08),-6px_-6px_15px_rgba(255,255,255,1)] hover:text-[#2D1A11]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 pb-2 flex items-center gap-4 group cursor-pointer relative z-10" onClick={() => setFormData(prev => ({ ...prev, is_primary: !prev.is_primary }))}>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 border-none ${
                formData.is_primary 
                  ? 'bg-gradient-to-br from-[#EAC135] to-[#DFB121] shadow-[inset_2px_2px_5px_rgba(45,26,17,0.2)]' 
                  : 'bg-[#F5EFE6] shadow-[inset_3px_3px_6px_rgba(45,26,17,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]'
              }`}>
                {formData.is_primary && <span className="text-[#1A1A1A] text-sm font-bold">✓</span>}
              </div>
              <input type="checkbox" name="is_primary" checked={formData.is_primary} readOnly className="hidden" />
              <span className="text-xs font-bold text-[#8B7355] uppercase tracking-widest group-hover:text-[#D9B35A] transition-colors select-none">
                Atur sebagai Alamat Utama
              </span>
            </div>
          </form>
        </div>

        <div className="p-6 sm:px-10 border-t-0 flex flex-col-reverse sm:flex-row justify-end items-center gap-4 bg-transparent shrink-0 shadow-[0_-15px_20px_-15px_rgba(45,26,17,0.1)] relative z-20">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-3.5 text-[#8B7355] font-black text-[11px] uppercase tracking-[0.15em] hover:text-[#2D1A11] transition-colors bg-transparent border-none cursor-pointer">
            Batal
          </button>
          
          <button type="submit" form="addressForm" disabled={isLoading} className="w-full sm:w-auto bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] text-[#1A1A1A] px-10 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest border-none shadow-[6px_6px_15px_rgba(217,179,90,0.3),-6px_-6px_15px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_20px_rgba(217,179,90,0.4),-8px_-8px_20px_rgba(255,255,255,1)] hover:-translate-y-1 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
            {isLoading ? (
              <span className="animate-pulse">Menyimpan...</span>
            ) : (
              <>Simpan Alamat <span className="text-lg">✧</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}