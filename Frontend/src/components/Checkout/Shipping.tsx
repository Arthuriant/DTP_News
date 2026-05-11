"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AddressService } from "@/services/AddressService";
// Sesuaikan path import AddressModal ini dengan struktur folder Anda!
import AddressModal from "../Profile/AddressModal"; // <-- PASTIKAN PATH INI BENAR
import Link from 'next/link';


const SHIPPING_URL = "http://127.0.0.1:8000";
const ORIGIN_ID = 4816; // ID kota toko (Bandung)

interface ShippingResult {
  destination_id: number;
  address: string;
  courier: string;
  service: string;
  cost: number;
  etd: string;
}

interface ShippingProps {
  onShippingChange: (data: ShippingResult | null) => void;
}

const Shipping = ({ onShippingChange }: ShippingProps) => {
  const inputClass = "rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/40 w-full py-3 px-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11] shadow-sm";
  const labelClass = "block mb-2.5 font-bold text-[#2D1A11] text-sm";

  // --- STATE ALAMAT TERSIMPAN ---
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [activeAddress, setActiveAddress] = useState<any>(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // --- STATE MODAL EDIT ALAMAT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  // --- STATE ALAMAT MANUAL / RAJAONGKIR ---
  const [address, setAddress]           = useState("");
  const [searchCity, setSearchCity]     = useState("");
  const [cities, setCities]             = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isSearching, setIsSearching]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // --- STATE ONGKIR ---
  const [selectedCourier, setSelectedCourier] = useState("");
  const [costResults, setCostResults]          = useState<any[]>([]);
  const [isLoadingCost, setIsLoadingCost]      = useState(false);
  const [selectedService, setSelectedService]  = useState<any>(null);

  const couriers = [
    { code: "jne",     name: "JNE" },
    { code: "jnt",     name: "J&T Express" },
    { code: "sicepat", name: "SiCepat" },
    { code: "pos",     name: "POS Indonesia" },
    { code: "tiki",    name: "TIKI" },
  ];

  const fetchMyAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const data = await AddressService.getAddresses();
      setSavedAddresses(data);

      if (data && data.length > 0) {
        const primary = data.find((a: any) => a.is_primary) || data[0];
        handleUseSavedAddress(primary);
      } else {
        setIsManualMode(true);
      }
    } catch (error) {
      console.error("Gagal memuat alamat:", error);
      setIsManualMode(true);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchMyAddresses();
  }, []);

  const handleUseSavedAddress = (addr: any) => {
    setActiveAddress(addr);
    setAddress(addr.street);
    
    // Cek ID RajaOngkir dari database
    const destinationId = addr.city_id || addr.destination_id || null; 
    
    if (destinationId) {
      setSelectedCity({ id: destinationId, label: addr.region });
      setSearchCity(addr.region);
    } else {
      setSelectedCity(null);
      // PINTAR: Jika tidak ada ID, otomatis isi kolom pencarian dengan nama Kota/Kecamatan agar user tinggal klik
      const regionParts = addr.region ? addr.region.split(',') : [];
      const searchHint = regionParts.length > 1 ? regionParts[1].trim() : addr.region;
      setSearchCity(searchHint || "");
      
      if (searchHint) {
        handleSearchCity(searchHint); // Langsung tembak API pencarian
      }
    }

    setIsManualMode(false);
    setShowAddressList(false);
    setCostResults([]);
    setSelectedService(null);
    onShippingChange(null);
  };

  // Handler Buka Modal Edit
  const handleEditAddress = (addr: any) => {
    setEditData(addr);
    setIsEditModalOpen(true);
  };

  const handleSearchCity = useCallback(async (query: string) => {
    setSearchCity(query);
    setSelectedCity(null);
    setSelectedService(null);
    setCostResults([]);
    onShippingChange(null);

    if (query.length < 2) { setCities([]); setShowDropdown(false); return; }

    setIsSearching(true);
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
  }, [onShippingChange]);

  const handleSelectCity = (city: any) => {
    setSelectedCity(city);
    setSearchCity(city.label); 
    setShowDropdown(false);
    setCostResults([]);
    setSelectedService(null);
    onShippingChange(null);
  };

  const handleCheckCost = async () => {
    if (!selectedCity || !selectedCourier) {
      alert("Pastikan kota tujuan telah terpilih dan kurir sudah ditentukan.");
      return;
    }

    setIsLoadingCost(true);
    setCostResults([]);
    setSelectedService(null);
    onShippingChange(null);

    try {
      const res = await fetch(`${SHIPPING_URL}/shipping/cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin:      ORIGIN_ID,
          destination: selectedCity.id, 
          weight:      1000, 
          courier:     selectedCourier,
        }),
      });
      const data = await res.json();
      setCostResults(data?.data ?? []);
    } catch {
      alert("Gagal mengecek ongkir dari server.");
    } finally {
      setIsLoadingCost(false);
    }
  };

  const handleSelectService = (item: any) => {
    setSelectedService(item);
    onShippingChange({
      destination_id: selectedCity.id, 
      address:        activeAddress ? `${activeAddress.recipient_name} - ${activeAddress.phone_number} | ${address}` : address,
      courier:        selectedCourier,
      service:        item.service,
      cost:           item.cost,
      etd:            item.etd,
    });
  };

  return (
    <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 mt-7.5 p-4 sm:p-8.5 relative overflow-hidden">
      
      <h3 className="font-bold text-xl text-[#2D1A11] mb-6 flex items-center gap-2 relative z-10">
        <span className="text-[#D9B35A]">✧</span> Alamat Pengiriman
      </h3>

      {isLoadingAddresses ? (
        <div className="flex items-center gap-3 p-5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium animate-pulse mb-8">
          <svg className="animate-spin h-5 w-5 text-[#D9B35A]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Memuat alamat Anda...
        </div>
      ) : (
        <>
          {/* JIKA MENGGUNAKAN ALAMAT TERSIMPAN */}
          {!isManualMode && activeAddress && (
            <div className="mb-8">
              <div className="p-5 rounded-xl border-2 border-[#D9B35A] bg-[#D9B35A]/5 shadow-[0_4px_15px_rgba(217,179,90,0.1)] relative transition-all">
                
                <div className="absolute top-4 right-5 px-3 py-1 bg-[#2D1A11] text-[#EAC135] text-[9px] font-black uppercase tracking-widest rounded-md">
                  {activeAddress.label || "Utama"}
                </div>

                <div className="pr-20">
                  <h4 className="text-[#2D1A11] font-bold text-base mb-1">{activeAddress.recipient_name} <span className="text-[#8B7355] text-sm font-normal ml-1">({activeAddress.phone_number})</span></h4>
                  <p className="text-[#5A4A3B] text-sm leading-relaxed">{activeAddress.street}</p>
                  <p className="text-[#8B7355] text-xs font-medium uppercase tracking-wider mt-1.5">{activeAddress.region}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddressList(!showAddressList)}
                    className="px-4 py-2 border border-[#D9B35A] text-[#D9B35A] bg-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-colors"
                  >
                    Pilih Alamat Lain
                  </button>
                  
                  {/* 👇 TOMBOL EDIT ALAMAT LANGSUNG 👇 */}
                  {/* <button 
                    type="button"
                    onClick={() => handleEditAddress(activeAddress)}
                    className="px-4 py-2 border border-[#8B7355] text-[#8B7355] bg-transparent rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B7355] hover:text-white transition-colors"
                  >
                    Edit Alamat Ini
                  </button> */}

                  {/* <button 
                    type="button"
                    onClick={() => setIsManualMode(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-500 bg-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                  >
                    Ketik Manual
                  </button> */}
                </div>
              </div>

              {/* LIST ALAMAT LAIN */}
              {showAddressList && (
                <div className="mt-3 p-2 bg-white border border-[#D9B35A]/20 rounded-xl shadow-lg animate-fadeIn max-h-60 overflow-y-auto custom-scrollbar">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`p-4 rounded-lg transition-colors border-b border-gray-100 last:border-0 flex justify-between items-center ${activeAddress?.id === addr.id ? 'bg-[#D9B35A]/10' : 'hover:bg-gray-50'}`}
                    >
                      <div className="cursor-pointer flex-1 pr-4" onClick={() => handleUseSavedAddress(addr)}>
                        <p className="font-bold text-[#2D1A11] text-sm">{addr.recipient_name} <span className="text-[#8B7355] text-[10px] uppercase ml-2 bg-gray-200 px-2 py-0.5 rounded">{addr.label}</span></p>
                        <p className="text-gray-500 text-xs mt-1 truncate">{addr.street}</p>
                      </div>
                      
                      {/* Tombol Edit di List Alamat */}
                      <button 
                        type="button"
                        onClick={() => handleEditAddress(addr)}
                        className="text-[10px] text-[#D9B35A] font-bold uppercase hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                  
                  {/* Tombol Tambah Alamat Baru */}
                  <div className="p-2 mt-1">
                    <Link 
                      href="/Profile"
                      className="w-full py-2.5 border border-dashed border-[#D9B35A] text-[#D9B35A] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#D9B35A]/10 transition-colors flex items-center justify-center"
                    >
                      + Perbarui Alamat
                    </Link>
                  </div>
                </div>
              )}

              {/* Peringatan Ketiadaan ID RajaOngkir */}
              {!selectedCity && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium flex gap-2 items-start">
                  <span>⚠️</span>
                  <p>Sistem perlu memverifikasi kecamatan Anda untuk ongkos kirim. Silakan pilih hasil pencarian kecamatan yang sesuai di kotak bawah ini.</p>
                </div>
              )}
            </div>
          )}

          {/* JIKA MODE MANUAL AKTIF */}
          {isManualMode && (
            <div className="mb-8 p-5 rounded-xl border border-gray-200 bg-white relative animate-fadeIn">
              {savedAddresses.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setIsManualMode(false)}
                  className="absolute top-4 right-4 text-xs font-bold text-[#D9B35A] uppercase tracking-widest hover:underline"
                >
                  Batal / Pakai Alamat Tersimpan
                </button>
              )}
              <div className="mb-5 relative z-10">
                <label className={labelClass}>Alamat Lengkap <span className="text-rose-500">*</span></label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nama jalan, nomor rumah..." className={inputClass} />
              </div>
            </div>
          )}
        </>
      )}

      {/* SEARCH KOTA (Selalu muncul jika ID kota belum terpilih) */}
      {(!selectedCity || isManualMode) && (
        <div className="mb-6 relative z-20 animate-fadeIn">
          <label className={labelClass}>Verifikasi Kota / Kecamatan <span className="text-rose-500">*</span></label>
          <div className="relative">
            <input type="text" value={searchCity} onChange={e => handleSearchCity(e.target.value)} placeholder="Ketik nama kota atau kecamatan..." className={`${inputClass} pr-10`} />
          </div>
          {isSearching && <p className="text-xs text-[#D9B35A] mt-2 font-medium">Mencari kecamatan di server logistik...</p>}
          {showDropdown && cities.length > 0 && (
            <div className="absolute z-50 w-full bg-white border border-[#D9B35A]/30 rounded-xl shadow-xl mt-2 max-h-52 overflow-y-auto custom-scrollbar">
              {cities.map((city, i) => (
                <div key={i} onClick={() => handleSelectCity(city)} className="px-5 py-3 text-sm text-[#2D1A11] hover:bg-[#D9B35A]/10 cursor-pointer border-b border-[#D9B35A]/10 last:border-0">{city.label}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <hr className="border-[#D9B35A]/20 mb-6" />

      {/* --- KURIR & ONGKIR --- */}
      <div className="mb-6 relative z-10">
        <label className={labelClass}>Kurir Pengiriman <span className="text-rose-500">*</span></label>
        <div className="relative">
          <select value={selectedCourier} onChange={e => { setSelectedCourier(e.target.value); setCostResults([]); setSelectedService(null); }} className={`${inputClass} appearance-none cursor-pointer`}>
            <option value="">-- Pilih Kurir --</option>
            {couriers.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#D9B35A]">▼</div>
        </div>
      </div>

      <button type="button" onClick={handleCheckCost} disabled={isLoadingCost || !selectedCity || !selectedCourier} className="w-full py-3.5 rounded-xl bg-[#2D1A11] text-[#D9B35A] font-bold text-xs uppercase tracking-widest hover:bg-[#3d2417] shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-6">
        {isLoadingCost ? "Mengkalkulasi Tarif..." : "Kalkulasi Ongkos Kirim"}
      </button>

      {/* Hasil Ongkir */}
      {costResults.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          <label className="block font-bold text-[#D9B35A] text-xs uppercase tracking-widest border-b border-[#D9B35A]/20 pb-2">Pilihan Layanan Logistik</label>
          <div className="grid gap-3">
            {costResults.map((item, i) => (
              <div key={i} onClick={() => handleSelectService(item)} className={`cursor-pointer rounded-xl border-2 px-5 py-4 transition-all duration-300 ${selectedService?.service === item.service ? "border-[#D9B35A] bg-[#D9B35A]/5 shadow-md" : "border-gray-200 bg-white hover:border-[#D9B35A]/40"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#2D1A11] text-sm uppercase">{selectedCourier} <span className="text-[#D9B35A]">|</span> {item.service}</p>
                    <p className="text-xs text-[#8B7355] mt-0.5">Estimasi Tiba: {item.etd} Hari</p>
                  </div>
                  <p className="font-black text-[#D9B35A] text-lg">Rp {Number(item.cost).toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 👇 INTEGRASI MODAL ALAMAT 👇 */}
      {isEditModalOpen && (
        <AddressModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={() => {
            fetchMyAddresses(); // Tarik ulang data alamat jika berhasil diedit/ditambah
            setIsEditModalOpen(false);
          }} 
          editData={editData} 
        />
      )}
    </div>
  );
};

export default Shipping;