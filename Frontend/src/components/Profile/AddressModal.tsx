"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { AddressService } from "@/services/AddressService";
import { AlertService } from '@/services/AlertService';

// IMPORT KOMPONEN PETA SECARA DINAMIS
const MapPicker = dynamic(() => import("./MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-[#EFE8DC] animate-pulse rounded-xl flex items-center justify-center text-[#8B7355] text-xs font-bold tracking-widest uppercase">Memuat Peta...</div>
});

const SHIPPING_URL = "http://127.0.0.1:8000"; 

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: any | null;
}

export default function AddressModal({ isOpen, onClose, onSuccess, editData }: AddressModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient_name: "", phone_number: "", region: "", destination_id: "", street: "", details: "", label: "", is_primary: false,
  });

  const [mapPosition, setMapPosition] = useState<[number, number]>([-6.9175, 107.6191]);
  
  // --- STATE PENCARIAN RAJAONGKIR ---
  const [isChangingRegion, setIsChangingRegion] = useState(false); 
  const [searchCity, setSearchCity] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // 👇 TAMBAHAN: Ref untuk menyimpan timer Debounce 👇
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      if (editData) {
        setFormData({
          recipient_name: editData.recipient_name, 
          phone_number: editData.phone_number,
          region: editData.region, 
          destination_id: editData.city_id || editData.destination_id || "", 
          street: editData.street, 
          details: editData.details || "",
          label: editData.label || "", 
          is_primary: editData.is_primary == 1,
        });
        setIsChangingRegion(false); 
        setSearchCity("");

        if (editData.latitude && editData.longitude) {
          setMapPosition([parseFloat(editData.latitude), parseFloat(editData.longitude)]);
        } else {
          setMapPosition([-6.9175, 107.6191]); 
        }
      } else {
        setFormData({ recipient_name: "", phone_number: "", region: "", destination_id: "", street: "", details: "", label: "", is_primary: false });
        setIsChangingRegion(true);  
        setSearchCity("");
        setMapPosition([-6.9175, 107.6191]); 
      }
    } else {
      document.body.style.overflow = "unset";
      setCities([]);
      setShowDropdown(false);
      // Bersihkan timer jika modal ditutup
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, editData]);


  const handleSearchCity = useCallback((query: string) => {
    setSearchCity(query);
    setFormData(prev => ({ ...prev, destination_id: "", region: "" })); 
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 2) { 
      setCities([]); 
      setShowDropdown(false); 
      setIsSearching(false);
      return; 
    }
    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${SHIPPING_URL}/shipping/destinations?search=${query}&limit=10`);
        const data = await res.json();
        setCities(data?.data ?? []);
        setShowDropdown(true);
      } catch {
        setCities([]);
      } finally {
        setIsSearching(false);
      }
    }, 600); 
  }, []);

  const handleSelectCity = (city: any) => {
    setSearchCity(city.label); 
    setFormData(prev => ({ 
      ...prev, 
      region: city.label, 
      destination_id: city.id,
    }));
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination_id) {
      AlertService.error("Data Belum Lengkap", "Silakan cari dan pilih kecamatan dari hasil pencarian agar sistem bisa menghitung ongkos kirim.");
      return;
    }
    
    setIsLoading(true);
    
    const payload = { 
        ...formData, 
        city_id: formData.destination_id, 
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
      
      AlertService.success("Berhasil!", `Alamat berhasil ${editData ? 'diperbarui' : 'ditambahkan'}.`);
      onSuccess(); 
      onClose();
    } catch (error: any) { 
      console.error(error);
      AlertService.error("Gagal Menyimpan", error.message || "Terjadi kesalahan saat menyimpan alamat.");
    } finally { 
      setIsLoading(false); 
    }
  };

  if (!isOpen || !mounted) return null;

  const inputClass = "w-full bg-white text-[#2D1A11] px-4 py-2.5 rounded-xl shadow-[inset_2px_2px_5px_rgba(45,26,17,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] border-none outline-none focus:ring-2 focus:ring-[#D9B35A]/50 transition-all font-semibold placeholder-[#8B7355]/40 text-sm appearance-none";

  const modalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn transition-all duration-300 font-sans"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-[#F8F3E9] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* HEADER */}
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

        {/* CONTENT FORM */}
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

            {/* PENCARIAN KOTA RAJAONGKIR */}
            <div>
              <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Verifikasi Kota / Kecamatan Tujuan</label>
              {!isChangingRegion && formData.region ? (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] border-none">
                  <span className="text-sm text-[#2D1A11] font-semibold truncate pr-3">{formData.region}</span>
                  <button type="button" onClick={() => { setIsChangingRegion(true); setSearchCity(formData.region); }} className="text-[#D9B35A] text-[10px] font-black uppercase tracking-wider hover:text-[#2D1A11] cursor-pointer bg-[#D9B35A]/10 px-3 py-1 rounded-md shrink-0">Ubah</button>
                </div>
              ) : (
                <div className="relative z-50">
                  <input
                    type="text"
                    required
                    value={searchCity}
                    onChange={e => handleSearchCity(e.target.value)}
                    placeholder="Ketik minimal 3 huruf nama kecamatan..."
                    className={inputClass}
                    autoComplete="off"
                  />
                  {isSearching && <p className="text-xs text-[#D9B35A] mt-1 pl-2 font-medium">Mencari di database logistik...</p>}
                  
                  {showDropdown && cities.length > 0 && (
                    <div className="absolute z-[999] w-full bg-white border border-[#D9B35A]/30 rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {cities.map((city, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectCity(city)}
                          className="px-4 py-3 text-xs text-[#2D1A11] hover:bg-[#D9B35A]/10 cursor-pointer border-b border-[#D9B35A]/10 last:border-0 font-medium"
                        >
                          {city.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-2/3">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Detail Jalan & Nomor</label>
                <textarea required name="street" placeholder="Nama Jalan, No. Rumah / RT RW..." rows={2} value={formData.street} onChange={handleInputChange} className={inputClass + " resize-none h-[56px]"} />
              </div>
              
              <div className="w-full sm:w-1/3 flex gap-2">
                <div className="w-1/2">
                  <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest mb-1.5 pl-1">Patokan</label>
                  <input type="text" name="details" placeholder="Pagar Hitam..." value={formData.details} onChange={handleInputChange} className={inputClass + " h-[56px]"} />
                </div>
              </div>
            </div>

            <div className="pt-2 relative z-0">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-[#8B7355] text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  📍 Tandai Titik Koordinat Peta
                </label>
              </div>
              <div className="h-[180px] w-full rounded-xl overflow-hidden border-2 border-[#D9B35A]/20 shadow-inner bg-[#EFE8DC]">
                <MapPicker position={mapPosition} setPosition={setMapPosition} />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {['Rumah', 'Kantor', 'Kost'].map(label => (
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

        {/* FOOTER */}
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

  return createPortal(modalContent, document.body);
}