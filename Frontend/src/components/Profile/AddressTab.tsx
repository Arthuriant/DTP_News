"use client";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";

export default function AddressTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  
  // State untuk mengontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

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

  const handleAddNewClick = () => {
    setEditData(null); // Mode Tambah Baru
    setIsModalOpen(true);
  };

  const handleEditClick = (address: any) => {
    setEditData(address); // Mode Edit Data
    setIsModalOpen(true);
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

      {/* Memanggil Komponen Modal */}
      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAddresses} 
        editData={editData} 
      />
    </div>
  );
}