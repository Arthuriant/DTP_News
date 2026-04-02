"use client";
import React, { useState, useEffect } from "react";

export default function AddressTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // NEW: State untuk menyimpan ID alamat yang sedang di-edit. Jika null, berarti Tambah Baru.
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    recipient_name: "",
    phone_number: "",
    region: "",
    street: "",
    details: "",
    label: "",
    is_primary: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/addresses", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Gagal mengambil alamat", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLabelClick = (labelName: string) => {
    setFormData({ ...formData, label: formData.label === labelName ? "" : labelName });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchAddresses();
    } catch (error) {
      console.error("Gagal menghapus alamat", error);
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/addresses/${id}/set-primary`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) fetchAddresses();
    } catch (error) {
      console.error("Gagal mengubah alamat utama", error);
    }
  };

  // NEW: Fungsi saat tombol "Ubah" diklik
  const handleEditClick = (address: any) => {
    setEditingId(address.id); // Simpan ID yang mau diedit
    setFormData({
      recipient_name: address.recipient_name,
      phone_number: address.phone_number,
      region: address.region,
      street: address.street,
      details: address.details || "",
      label: address.label || "",
      is_primary: address.is_primary == 1,
    });
    setIsModalOpen(true);
  };

  // NEW: Fungsi saat tombol "Tambah Alamat Baru" diklik
  const handleAddNewClick = () => {
    setEditingId(null); // Reset ID agar jadi mode Tambah
    setFormData({
      recipient_name: "", phone_number: "", region: "", street: "", details: "", label: "", is_primary: false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      label: formData.label === "" ? null : formData.label
    };

    // NEW: Tentukan URL dan Method berdasarkan mode (Edit atau Tambah)
    const url = editingId 
      ? `http://127.0.0.1:8000/addresses/${editingId}` 
      : "http://127.0.0.1:8000/addresses";
      
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ recipient_name: "", phone_number: "", region: "", street: "", details: "", label: "", is_primary: false });
        fetchAddresses();
      } else {
        const errData = await res.json();
        console.error("Error Validasi Laravel:", errData);
        alert("Gagal menyimpan alamat. Pastikan semua kolom terisi dengan benar.");
      }
    } catch (error) {
      console.error("Error submitting address", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-800">Alamat Saya</h2>
        <button 
          onClick={handleAddNewClick}
          className="bg-[#EE4D2D] hover:bg-[#D73211] text-white px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <span>+</span> Tambah Alamat Baru
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
          <p className="text-gray-400 text-sm">Belum ada alamat yang disimpan.</p>
        </div>
      ) : (
        addresses.map((address) => (
          <div key={address.id} className="border-t border-gray-200 py-4 flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{address.recipient_name}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{address.phone_number}</span>
              </div>
              <p className="text-gray-500 text-sm">{address.street}</p>
              <p className="text-gray-500 text-sm uppercase">{address.region}</p>
              
              <div className="flex gap-2 mt-2">
                {address.is_primary && (
                  <span className="inline-block border border-[#EE4D2D] text-[#EE4D2D] px-2 py-0.5 text-[10px] rounded-sm">
                    Utama
                  </span>
                )}
                {address.label && (
                  <span className="inline-block border border-gray-400 text-gray-500 px-2 py-0.5 text-[10px] rounded-sm">
                    {address.label}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <div className="space-x-3 text-sm font-medium">
                {/* 👇 TOMBOL UBAH DENGAN FUNGSI BARU 👇 */}
                <button onClick={() => handleEditClick(address)} className="text-blue-600 hover:text-blue-800">Ubah</button>
                <button onClick={() => handleDelete(address.id)} className="text-blue-600 hover:text-blue-800">Hapus</button>
              </div>
              <button 
                onClick={() => handleSetPrimary(address.id)}
                disabled={address.is_primary}
                className={`border px-3 py-1 text-sm rounded transition-colors ${
                  address.is_primary 
                    ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed" 
                    : "border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 cursor-pointer"
                }`}
              >
                Atur sebagai utama
              </button>
            </div>
          </div>
        ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col max-h-[90vh] animate-soft-fade">
            <div className="p-6 overflow-y-auto">
              {/* NEW: Judul Modal Dinamis */}
              <h3 className="text-xl mb-6 font-medium text-gray-800">
                {editingId ? "Ubah Alamat" : "Alamat Baru"}
              </h3>
              
              <form id="addressForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <input required type="text" name="recipient_name" placeholder="Nama Lengkap" value={formData.recipient_name} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2.5 rounded text-sm focus:border-gray-500 outline-none transition-colors" />
                  <input required type="text" name="phone_number" placeholder="Nomor Telepon" value={formData.phone_number} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2.5 rounded text-sm focus:border-gray-500 outline-none transition-colors" />
                </div>

                <div className="relative">
                  <select 
                    required 
                    name="region" 
                    value={formData.region} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 px-3 py-2.5 rounded text-sm focus:border-gray-500 outline-none transition-colors appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>Pilih Provinsi, Kota, Kecamatan, Kode Pos</option>
                    <option value="Jawa Barat, Kota Bandung, Cibeunying Kaler, 40123">Jawa Barat, Kota Bandung, Cibeunying Kaler, 40123</option>
                    <option value="DKI Jakarta, Jakarta Selatan, Kebayoran Baru, 12110">DKI Jakarta, Jakarta Selatan, Kebayoran Baru, 12110</option>
                    <option value="Jawa Tengah, Kota Semarang, Semarang Tengah, 50131">Jawa Tengah, Kota Semarang, Semarang Tengah, 50131</option>
                    <option value="Jawa Timur, Kota Surabaya, Tegalsari, 60262">Jawa Timur, Kota Surabaya, Tegalsari, 60262</option>
                    <option value="Bali, Kota Denpasar, Denpasar Selatan, 80223">Bali, Kota Denpasar, Denpasar Selatan, 80223</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                <textarea required name="street" placeholder="Nama Jalan, Gedung, No. Rumah" rows={3} value={formData.street} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2.5 rounded text-sm focus:border-gray-500 outline-none transition-colors resize-none" />
                <input type="text" name="details" placeholder="Detail Lainnya (Cth: Blok / Unit No., Patokan)" value={formData.details} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2.5 rounded text-sm focus:border-gray-500 outline-none transition-colors" />

                <div className="w-full h-20 bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden rounded">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://maps.gstatic.com/mapfiles/transparent.png')] bg-repeat"></div>
                  <button 
                    type="button" 
                    onClick={() => alert("Fitur Google Maps membutuhkan Integrasi API Key khusus. Saat ini gunakan input manual.")}
                    className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 text-sm rounded shadow-sm z-10 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">+</span> Tambah Lokasi
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-2">Tandai Sebagai:</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => handleLabelClick('Rumah')} className={`px-4 py-1.5 text-sm rounded border ${formData.label === 'Rumah' ? 'border-[#EE4D2D] text-[#EE4D2D]' : 'border-gray-300 text-gray-600'}`}>Rumah</button>
                    <button type="button" onClick={() => handleLabelClick('Kantor')} className={`px-4 py-1.5 text-sm rounded border ${formData.label === 'Kantor' ? 'border-[#EE4D2D] text-[#EE4D2D]' : 'border-gray-300 text-gray-600'}`}>Kantor</button>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input type="checkbox" id="is_primary" name="is_primary" checked={formData.is_primary} onChange={handleInputChange} className="w-4 h-4 accent-[#EE4D2D] cursor-pointer" />
                  <label htmlFor="is_primary" className="text-sm text-gray-600 cursor-pointer">Atur sebagai Alamat Pribadi / Utama</label>
                </div>
              </form>
            </div>

            <div className="p-6 pt-4 flex justify-end gap-3 mt-auto border-t border-gray-100 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors font-medium">
                Batal
              </button>
              <button type="submit" form="addressForm" disabled={isLoading} className="bg-[#EE4D2D] hover:bg-[#D73211] text-white px-8 py-2 text-sm rounded transition-colors disabled:opacity-70 font-medium shadow-sm">
                {isLoading ? "Menyimpan..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}