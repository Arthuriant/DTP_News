"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 👈 IMPORT PENTING UNTUK PORTAL
import dynamic from "next/dynamic";
import { RegionService } from "@/services/RegionService";
import { AddressService } from "@/services/AddressService";
// 1. Import AlertService (Hapus import Swal bawaan)
import { AlertService } from '@/services/AlertService';

// IMPORT KOMPONEN PETA SECARA DINAMIS
const MapPicker = dynamic(() => import("./MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-white/50 animate-pulse rounded-xl flex items-center justify-center text-[#8B7355] text-xs font-bold tracking-widest uppercase">Memuat Peta...</div>
});

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: any | null;
}

export default function AddressModal({ isOpen, onClose, onSuccess, editData }: AddressModalProps) {
  const [mounted, setMounted] = useState(false); // 👈 STATE UNTUK PORTAL SSR
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: "", phone_number: "", region: "", street: "", details: "", label: "", is_primary: false,
  });

  const [mapPosition, setMapPosition] = useState<[number, number]>([-6.9175, 107.6191]);
  const [isChangingRegion, setIsChangingRegion] = useState(false); 
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [selectedRegion, setSelectedRegion] = useState({
    provId: "", provName: "", cityId: "", cityName: "", distId: "", distName: "", villId: "", villName: ""
  });

  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  // Pastikan komponen sudah di-mount di client (wajib untuk createPortal di Next.js)
  useEffect(() => {
    setMounted(true);
  }, []);

  // LOCK SCROLL
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
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

        if (editData.latitude && editData.longitude) {
          setMapPosition([parseFloat(editData.latitude), parseFloat(editData.longitude)]);
        } else {
          setMapPosition([-6.9175, 107.6191]); 
        }
      } else {
        setFormData({ recipient_name: "", phone_number: "", region: "", street: "", details: "", label: "", is_primary: false });
        setIsChangingRegion(true);  
        setMapPosition([-6.9175, 107.6191]); 
      }
      setSelectedRegion({ provId: "", provName: "", cityId: "", cityName: "", distId: "", distName: "", villId: "", villName: "" });
      
      RegionService.getProvinces()
        .then(data => setProvinces(data))
        .catch(err => console.error("Gagal menarik data provinsi:", err));
    }
  }, [isOpen, editData]);

  const handleProvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion({ provId: id, provName: name, cityId: "", cityName: "", distId: "", distName: "", villId: "", villName: "" });
    try { setCities(await RegionService.getCities(id)); } catch (err) { console.error(err); }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, cityId: id, cityName: name, distId: "", distName: "", villId: "", villName: "" }));
    try { setDistricts(await RegionService.getDistricts(id)); } catch (err) { console.error(err); }
  };

  const handleDistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedRegion(prev => ({ ...prev, distId: id, distName: name, villId: "", villName: "" }));
    try { setVillages(await RegionService.getVillages(id)); } catch (err) { console.error(err); }
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
        // 2. Ganti alert() bawaan dengan AlertService
        AlertService.error("Data Belum Lengkap", "Pilih wilayah hingga tingkat Kelurahan/Desa!");
        return;
      }
      finalRegion = `${selectedRegion.provName}, ${selectedRegion.cityName}, Kecamatan ${selectedRegion.distName}, Kelurahan ${selectedRegion.villName}`;
    }
    
    setIsLoading(true);
    
    const payload = { 
        ...formData, 
        region: finalRegion, 
        label: formData.label === "" ? null : formData.label,
        latitude: mapPosition[0],   
        longitude: mapPosition[1]   
    };

    try {
      if (editData) {
        await AddressService.updateAddress(editData.id, payload);
      } else {
        await AddressService.createAddress(payload);
      }
      
      // 3. Gunakan AlertService untuk sukses
      AlertService.success("Berhasil!", `Alamat berhasil ${editData ? 'diperbarui' : 'ditambahkan'}.`);

      onSuccess(); 
      onClose();
    } catch (error: any) { 
      console.error(error);
      // 4. Tambahkan penanganan error
      AlertService.error("Gagal Menyimpan", error.message || "Terjadi kesalahan saat menyimpan alamat.");
    } finally { 
      setIsLoading(false); 
    }
  };

  if (!isOpen || !mounted) return null;

  const inputClass = "w-full bg-white text-[#2D1A11] px-4 py-2.5 rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] border-none outline-none focus:ring-2 focus:ring-[#D9B35A]/50 transition-all font-semibold placeholder-[#8B7355]/40 text-sm appearance-none";

  // ISI MODAL (Dimasukkan ke dalam variabel)
  const modalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn transition-all duration-300 font-sans"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* KUNCI TINGGI MAKSIMAL DI 85vh AGAR TIDAK NABRAK ATAS BAWAH */}
      <div className="relative bg-[#F8F3E9] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* HEADER - flex-none (Terkunci) */}
        <div className="flex-none relative z-10 bg-[#2D1A11] px-6 py-4 shadow-md flex justify-between items-center">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${brownBatikUrl}')`, backgroundSize: 'cover' }}></div>
          <div className="relative z-10">
            <h2 className="text-[#C5A059] text-lg font-serif font-bold tracking-wide flex items-center gap-2">
              <span className="text-xl">✧</span> 
              {editData ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2D1A11] transition-all cursor-pointer">✕</button>
        </div>

        {/* CONTENT FORM - flex-1 overflow-y-auto (Bisa di-scroll) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 scrollbar-thin scrollbar-thumb-[#D9B35A]/50 scrollbar-track-transparent">
          <form id="addressForm" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Nama Penerima</label>
                <input required type="text" name="recipient_name" placeholder="Nama..." value={formData.recipient_name} onChange={handleInputChange} className={inputClass} />
              </div>
              <div className="w-full">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">No. Telepon</label>
                <input required type="text" name="phone_number" placeholder="08..." value={formData.phone_number} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Wilayah</label>
              {!isChangingRegion && formData.region ? (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] border-none">
                  <span className="text-sm text-[#2D1A11] font-semibold truncate pr-3">{formData.region}</span>
                  <button type="button" onClick={() => setIsChangingRegion(true)} className="text-[#D9B35A] text-[10px] font-black uppercase tracking-wider hover:text-[#2D1A11] cursor-pointer bg-[#D9B35A]/10 px-3 py-1 rounded-md">Ubah</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#EFE8DC] p-4 rounded-xl shadow-inner border-none">
                  <select required={isChangingRegion} value={selectedRegion.provId} onChange={handleProvChange} className={inputClass}>
                    <option value="" disabled>Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.provId} value={selectedRegion.cityId} onChange={handleCityChange} className={inputClass}>
                    <option value="" disabled>Kota/Kabupaten</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.cityId} value={selectedRegion.distId} onChange={handleDistChange} className={inputClass}>
                    <option value="" disabled>Kecamatan</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                  </select>
                  <select required={isChangingRegion} disabled={!selectedRegion.distId} value={selectedRegion.villId} onChange={handleVillChange} className={inputClass}>
                    <option value="" disabled>Kelurahan/Desa</option>
                    {villages.map(v => <option key={v.id} value={v.id}>{v.nama}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-2/3">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Detail Jalan</label>
                <textarea required name="street" placeholder="Nama Jalan, No. Rumah / RT RW..." rows={2} value={formData.street} onChange={handleInputChange} className={inputClass + " resize-none h-[56px]"} />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Patokan</label>
                <textarea name="details" placeholder="Cth: Rumah Pagar Hitam..." rows={2} value={formData.details} onChange={handleInputChange} className={inputClass + " resize-none h-[56px]"} />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  📍 Tandai Titik Koordinat Pengiriman
                </label>
              </div>
              
              <div className="h-[200px] w-full rounded-xl overflow-hidden border-2 border-[#D9B35A]/20 shadow-inner relative z-0 bg-[#EFE8DC]">
                <MapPicker position={mapPosition} setPosition={setMapPosition} />
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {['Rumah', 'Kantor'].map(label => (
                  <button key={label} type="button" onClick={() => setFormData({ ...formData, label: formData.label === label ? "" : label })} className={`px-5 py-2 text-[10px] uppercase tracking-widest rounded-full font-black transition-all ${formData.label === label ? 'bg-[#2D1A11] text-[#D9B35A] shadow-md' : 'bg-white text-[#8B7355] shadow-sm hover:bg-[#EFE8DC]'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm hover:bg-[#EFE8DC] transition-colors" onClick={() => setFormData(prev => ({ ...prev, is_primary: !prev.is_primary }))}>
                <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${formData.is_primary ? 'bg-[#D9B35A]' : 'bg-[#EFE8DC] shadow-inner'}`}>
                  {formData.is_primary && <span className="text-[#2D1A11] text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-[10px] font-bold text-[#8B7355] uppercase tracking-widest pt-0.5">Jadikan Utama</span>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER - flex-none (Terkunci) */}
        <div className="flex-none p-4 sm:px-8 py-4 border-t border-[#8B7355]/10 flex justify-end items-center gap-4 bg-[#EFE8DC] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <button onClick={onClose} className="text-[#8B7355] font-black text-[10px] uppercase tracking-widest hover:text-[#2D1A11] px-5 py-2.5 rounded-full hover:bg-white/50 transition-colors">Batal</button>
          <button type="submit" form="addressForm" disabled={isLoading} className="bg-gradient-to-r from-[#2D1A11] to-[#3d2417] text-[#D9B35A] px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2">
            {isLoading && <div className="w-3.5 h-3.5 border-2 border-[#D9B35A]/30 border-t-[#D9B35A] rounded-full animate-spin"></div>}
            {isLoading ? "Menyimpan..." : "Simpan Alamat"}
          </button>
        </div>
      </div>
    </div>
  );

  // MELEMPAR HTML KE BODY PALING LUAR (PORTAL)
  return createPortal(modalContent, document.body);
}