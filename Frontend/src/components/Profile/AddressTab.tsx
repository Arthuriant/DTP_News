"use client";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";

export default function AddressTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  // URL Gunungan Wayang Emas dengan Kualitas Bagus
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";

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
    if (!window.confirm("Hapus lokasi pengiriman ini?")) return;
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

  return (
    <div className="w-full font-sans animate-fadeIn relative min-h-[600px] pb-20">
      
      {/* 1. GUNUNGAN WAYANG BACKGROUND - Posisi Fixed, Opacity Sangat Rendah (Elegan) */}
      <div 
        className="fixed right-10 bottom-10 w-96 h-96 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url('${gununganUrl}')&`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right' }}
      ></div>

      {/* 2. HEADER SECTION - Layout Rapi & Tombol Neumorphic Timbul */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10 border-b border-[#E8DFD0] pb-6">
        <div>
          <h2 className="text-[#2D1A11] text-2xl font-serif font-bold tracking-tight">
            Alamat Pengiriman
          </h2>
          <p className="text-[#8B7355] text-xs uppercase tracking-[0.2em] font-bold mt-2 opacity-70">
            Kelola tujuan pengiriman pesanan Anda
          </p>
        </div>
        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-[#2D1A11] text-[#EAC135] px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(45,26,17,0.2)] hover:bg-[#41281c] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-3 group"
        >
          {/* Aksen Bintang Kecil yang interaktif */}
          <span className="text-lg leading-none group-hover:rotate-90 transition-transform duration-500">✧</span> 
          Tambah Alamat Baru
        </button>
      </div>

      {/* 3. ADDRESS LIST - Gaya Timbul Modern (Neumorphic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {addresses.length === 0 ? (
          // Keadaan Kosong - Rapi dan Timbul ke Dalam
          <div className="md:col-span-2 py-32 flex flex-col items-center justify-center text-center bg-[#FDFBF7] rounded-[2.5rem] border-2 border-dashed border-[#E8DFD0] shadow-[inset_8px_8px_16px_rgba(45,26,17,0.03),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]">
            <div className="w-20 h-20 bg-[#F8F3E9] rounded-full flex items-center justify-center mb-6 shadow-inner text-[#D9B35A] text-3xl">✧</div>
            <p className="text-[#2D1A11] font-bold text-xl">Daftar alamat masih kosong</p>
            <p className="text-[#8B7355] text-xs mt-2 uppercase tracking-widest font-medium">Klik tombol di atas untuk menambahkan alamat pertama Anda.</p>
          </div>
        ) : (
          addresses.map((address) => (
            // CARD ALAMAT: Desain Neumorphic Timbul Luar (Outset)
            <div 
              key={address.id} 
              className={`group bg-white rounded-[2.5rem] p-8 transition-all duration-300 flex flex-col justify-between border-2 border-transparent ${
                address.is_primary 
                ? 'border-[#D9B35A] shadow-[15px_15px_30px_rgba(217,179,90,0.12),-10px_-10px_20px_rgba(255,255,255,0.9)] bg-gradient-to-br from-white to-[#FDFBF7]' 
                : 'shadow-[10px_10px_20px_rgba(45,26,17,0.04),-10px_-10px_20px_rgba(255,255,255,0.9)] hover:shadow-[15px_15px_30px_rgba(45,26,17,0.08),-10px_-10px_20px_rgba(255,255,255,0.9)] hover:border-[#E8DFD0]'
              }`}
            >
              {/* Bagian Atas: Badge & Nama */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between gap-3">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    address.is_primary 
                    ? 'bg-[#2D1A11] text-[#EAC135] border-[#2D1A11]' 
                    : 'bg-[#F8F3E9] text-[#8B7355] border-[#E8DFD0]'
                  }`}>
                    {address.label || "Alamat"}
                  </span>
                  {address.is_primary && (
                    <span className="text-[#D9B35A] text-[10px] font-black uppercase tracking-tighter animate-pulse">
                      ● Utama
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-[#2D1A11] font-bold text-xl tracking-tight">{address.recipient_name}</h3>
                  <p className="text-[#5A4A3B] font-semibold text-sm">{address.phone_number}</p>
                </div>
                
                <div className="max-w-xl">
                  <p className="text-[#8B7355] text-sm leading-relaxed line-clamp-3">
                    {address.street}
                  </p>
                  <p className="text-[#2D1A11] text-[10px] font-black uppercase tracking-wider mt-2 opacity-60">
                    {address.region}
                  </p>
                  {address.details && (
                    <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-[#F8F3E9] rounded-lg text-[10px] text-[#8B7355] font-medium border border-[#E8DFD0]/50">
                      <span className="opacity-70">📍</span> {address.details}
                    </div>
                  )}
                </div>
              </div>

              {/* Bagian Bawah: Aksi Interaktif */}
              <div className="flex items-center justify-between gap-4 pt-6 mt-auto border-t border-[#E8DFD0]/40">
                
                <div className="flex gap-4 items-center">
                  <button 
                    onClick={() => { setEditData(address); setIsModalOpen(true); }}
                    className="text-[#D9B35A] text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#2D1A11] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D9B35A] hover:after:w-full after:transition-all duration-300"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className="text-[#C5A059]/40 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {!address.is_primary && (
                  <button 
                    onClick={() => handleSetPrimary(address.id)}
                    className="bg-white text-[#8B7355] border-2 border-[#E8DFD0] px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-[4px_4px_10px_rgba(45,26,17,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] hover:border-[#D9B35A] hover:text-[#2D1A11] hover:shadow-[6px_6px_15px_rgba(45,26,17,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)] transition-all duration-300"
                  >
                    Set Utama
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. MODAL ALAMAT */}
      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAddresses} 
        editData={editData} 
      />
    </div>
  );
}