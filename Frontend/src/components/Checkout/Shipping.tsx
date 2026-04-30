"use client";
import React, { useState, useCallback } from "react";

const SHIPPING_URL = "http://127.0.0.1:8000";
const ORIGIN_ID = 4816; // ID kota toko, sesuaikan

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

  const [address, setAddress]           = useState("");
  const [searchCity, setSearchCity]     = useState("");
  const [cities, setCities]             = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isSearching, setIsSearching]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Search kota
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
      const list = data?.data ?? [];
      setCities(list);
      setShowDropdown(true);
    } catch {
      setCities([]);
    } finally {
      setIsSearching(false);
    }
  }, [onShippingChange]);

  // Pilih kota dari dropdown
  const handleSelectCity = (city: any) => {
    setSelectedCity(city);
    // PERBAIKAN 1: Menggunakan property label dari response API
    setSearchCity(city.label); 
    setShowDropdown(false);
    setCostResults([]);
    setSelectedService(null);
    onShippingChange(null);
  };

  // Cek ongkir
  const handleCheckCost = async () => {
    if (!selectedCity || !selectedCourier) {
      alert("Pilih kota tujuan dan kurir terlebih dahulu.");
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
          // PERBAIKAN 2: Menggunakan property id dari response API, bukan destination_code
          destination: selectedCity.id, 
          weight:      1000, // gram, sesuaikan
          courier:     selectedCourier,
        }),
      });
      const data = await res.json();
      setCostResults(data?.data ?? []);
    } catch {
      alert("Gagal mengecek ongkir.");
    } finally {
      setIsLoadingCost(false);
    }
  };

  // Pilih layanan ongkir
  const handleSelectService = (item: any) => {
    setSelectedService(item);
    onShippingChange({
      // PERBAIKAN 3: Menggunakan property id dari response API
      destination_id: selectedCity.id, 
      address:        address,
      courier:        selectedCourier,
      service:        item.service,
      cost:           item.cost,
      etd:            item.etd,
    });
  };

  return (
    <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 mt-7.5 p-4 sm:p-8.5">
      <h3 className="font-bold text-xl text-[#2D1A11] mb-6 flex items-center gap-2">
        <span className="text-[#D9B35A]">✧</span> Alamat & Pengiriman
      </h3>

      {/* Alamat Lengkap */}
      <div className="mb-5">
        <label className={labelClass}>Alamat Lengkap <span className="text-rose-500">*</span></label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nama jalan, nomor rumah, RT/RW" className={inputClass} />
      </div>

      {/* Search Kota */}
      <div className="mb-5 relative">
        <label className={labelClass}>Kota / Kecamatan Tujuan <span className="text-rose-500">*</span></label>
        <input
          type="text"
          value={searchCity}
          onChange={e => handleSearchCity(e.target.value)}
          placeholder="Ketik nama kota atau kecamatan..."
          className={inputClass}
        />
        {isSearching && <p className="text-xs text-[#8B7355] mt-1">Mencari...</p>}
        {showDropdown && cities.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-[#D9B35A]/30 rounded-xl shadow-lg mt-1 max-h-52 overflow-y-auto">
            {cities.map((city, i) => (
              <div
                key={i}
                onClick={() => handleSelectCity(city)}
                className="px-4 py-3 text-sm text-[#2D1A11] hover:bg-[#D9B35A]/10 cursor-pointer border-b border-[#D9B35A]/10 last:border-0"
              >
                {/* PERBAIKAN 4: Render property label yang rapi dari API */}
                {city.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pilih Kurir */}
      <div className="mb-5">
        <label className={labelClass}>Kurir <span className="text-rose-500">*</span></label>
        <select
          value={selectedCourier}
          onChange={e => { setSelectedCourier(e.target.value); setCostResults([]); setSelectedService(null); }}
          className={inputClass}
        >
          <option value="">-- Pilih Kurir --</option>
          {couriers.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Tombol Cek Ongkir */}
      <button
        type="button"
        onClick={handleCheckCost}
        disabled={isLoadingCost || !selectedCity || !selectedCourier}
        className="w-full py-3 rounded-xl bg-[#2D1A11] text-[#D9B35A] font-bold text-sm uppercase tracking-widest hover:bg-[#3d2417] transition-all disabled:opacity-40 mb-5"
      >
        {isLoadingCost ? "Mengecek..." : "Cek Ongkir"}
      </button>

      {/* Hasil Ongkir */}
      {costResults.length > 0 && (
        <div className="space-y-3">
          <label className={labelClass}>Pilih Layanan</label>
          {costResults.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelectService(item)}
              className={`cursor-pointer rounded-xl border-2 px-5 py-3 transition-all ${
                selectedService?.service === item.service
                  ? "border-[#D9B35A] bg-[#D9B35A]/5"
                  : "border-gray-200 hover:border-[#D9B35A]/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#2D1A11] text-sm">{selectedCourier.toUpperCase()} - {item.service}</p>
                  <p className="text-xs text-[#8B7355]">Estimasi: {item.etd}</p>
                </div>
                <p className="font-black text-[#D9B35A]">Rp {Number(item.cost).toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Konfirmasi terpilih */}
      {selectedService && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
          ✓ {selectedCourier.toUpperCase()} {selectedService.service} — Rp {Number(selectedService.cost).toLocaleString("id-ID")} ({selectedService.etd})
        </div>
      )}
    </div>
  );
};

export default Shipping;