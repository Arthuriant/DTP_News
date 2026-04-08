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

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-slate-800">{editData ? "Ubah Alamat" : "Alamat Baru"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-slate-50/50">
          <form id="addressForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Penerima</label>
                <input required type="text" name="recipient_name" value={formData.recipient_name} onChange={handleInputChange} className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#EE4D2D] outline-none transition-all" />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-500 mb-1">No. Telepon</label>
                <input required type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#EE4D2D] outline-none transition-all" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 mb-2">Wilayah</label>
              
              {!isChangingRegion && formData.region ? (
                <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                  <span className="text-sm text-slate-700 font-medium truncate pr-4">{formData.region}</span>
                  <button type="button" onClick={() => setIsChangingRegion(true)} className="text-[#EE4D2D] text-sm font-bold shrink-0 hover:underline">Ubah</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <select required={isChangingRegion} value={selectedRegion.provId} onChange={handleProvChange} className="w-full border border-slate-300 px-3 py-2.5 rounded-xl text-sm focus:border-[#EE4D2D] outline-none cursor-pointer">
                    <option value="" disabled>1. Pilih Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                  
                  <select required={isChangingRegion} disabled={!selectedRegion.provId} value={selectedRegion.cityId} onChange={handleCityChange} className="w-full border border-slate-300 px-3 py-2.5 rounded-xl text-sm disabled:bg-slate-100 outline-none cursor-pointer">
                    <option value="" disabled>2. Pilih Kota/Kabupaten</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                  </select>

                  <select required={isChangingRegion} disabled={!selectedRegion.cityId} value={selectedRegion.distId} onChange={handleDistChange} className="w-full border border-slate-300 px-3 py-2.5 rounded-xl text-sm disabled:bg-slate-100 outline-none cursor-pointer">
                    <option value="" disabled>3. Pilih Kecamatan</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                  </select>

                  <select required={isChangingRegion} disabled={!selectedRegion.distId} value={selectedRegion.villId} onChange={handleVillChange} className="w-full border border-slate-300 px-3 py-2.5 rounded-xl text-sm disabled:bg-slate-100 outline-none cursor-pointer">
                    <option value="" disabled>4. Pilih Kelurahan/Desa</option>
                    {villages.map(v => <option key={v.id} value={v.id}>{v.nama}</option>)}
                  </select>
                  
                  {editData && (
                    <button type="button" onClick={() => setIsChangingRegion(false)} className="text-sm text-slate-500 font-medium hover:text-slate-800 mt-1">Batalkan ubah wilayah</button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Detail Alamat Lengkap</label>
              <textarea required name="street" placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW" rows={3} value={formData.street} onChange={handleInputChange} className="w-full border border-slate-300 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#EE4D2D] outline-none transition-all resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Patokan (Opsional)</label>
              <input type="text" name="details" placeholder="Cth: Cat rumah warna hijau, pagar hitam" value={formData.details} onChange={handleInputChange} className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#EE4D2D] outline-none transition-all" />
            </div>

            {/* 👇 INI BAGIAN MAPS YANG KAMU MINTA TETAP ADA 👇 */}
            <div className="w-full h-20 bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 opacity-10 bg-[url('https://maps.gstatic.com/mapfiles/transparent.png')] bg-repeat"></div>
              <button type="button" onClick={() => alert("Fitur Google Maps membutuhkan Integrasi API Key khusus. Saat ini gunakan input manual.")} className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 text-sm rounded shadow-sm z-10 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <span className="text-lg">+</span> Tambah Lokasi
              </button>
            </div>
            {/* 👆 ========================================= 👆 */}

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-500 mb-2">Tandai Sebagai:</label>
              <div className="flex gap-3">
                {['Rumah', 'Kantor'].map(label => (
                  <button key={label} type="button" onClick={() => setFormData({ ...formData, label: formData.label === label ? "" : label })} className={`px-5 py-2 text-sm rounded-full border transition-all font-semibold ${formData.label === label ? 'border-[#EE4D2D] bg-[#EE4D2D]/10 text-[#EE4D2D]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input type="checkbox" id="is_primary" name="is_primary" checked={formData.is_primary} onChange={handleInputChange} className="w-5 h-5 accent-[#EE4D2D] cursor-pointer rounded" />
              <label htmlFor="is_primary" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">Atur sebagai Alamat Utama</label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
          <button type="submit" form="addressForm" disabled={isLoading} className="bg-[#EE4D2D] hover:bg-[#D73211] text-white px-8 py-2.5 text-sm font-bold rounded-xl transition-colors disabled:opacity-70 shadow-lg shadow-orange-500/30">
            {isLoading ? "Menyimpan..." : "Simpan Alamat"}
          </button>
        </div>
      </div>
    </div>
  );
}