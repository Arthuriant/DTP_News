"use client";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";

export default function AddressTab() {
  const [addresses, setAddresses] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/previews/024/036/944/large_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

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

  const handleAddNewClick = () => {
    setEditData(null); 
    setIsModalOpen(true);
  };

  const handleEditClick = (address: any) => {
    setEditData(address); 
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fadeIn relative font-sans">

      <div className="flex justify-end mb-8 relative z-10">
        <button 
          onClick={handleAddNewClick}
          className="bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] text-[#1A1A1A] px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border-none shadow-[6px_6px_15px_rgba(217,179,90,0.4),-6px_-6px_15px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_20px_rgba(217,179,90,0.5),-8px_-8px_20px_rgba(255,255,255,1)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
        >
          <span className="text-lg group-hover:rotate-180 transition-transform duration-500">✧</span> 
          Tambah Alamat
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-[#F8F3E9] rounded-[2rem] border-none shadow-[inset_8px_8px_20px_rgba(45,26,17,0.05),inset_-8px_-8px_20px_rgba(255,255,255,0.9)]">
          <span className="text-4xl opacity-30 text-[#8B7355] mb-4">✧</span>
          <p className="text-[#2D1A11] font-bold font-serif text-xl">Belum Ada Lokasi Terdaftar</p>
          <p className="text-[#8B7355] text-xs mt-2 uppercase tracking-widest font-semibold">Silakan tambahkan alamat pengiriman.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {addresses.map((address) => (
            <div key={address.id} className="bg-[#F8F3E9] rounded-[2rem] border-none overflow-hidden relative group shadow-[10px_10px_30px_rgba(45,26,17,0.08),-10px_-10px_30px_rgba(255,255,255,1)] hover:shadow-[15px_15px_40px_rgba(217,179,90,0.15),-15px_-15px_40px_rgba(255,255,255,1)] transition-all duration-500 hover:-translate-y-2">

              <div className="h-28 relative bg-[#2D1A11]" 
                   style={{ backgroundImage: `linear-gradient(to bottom, rgba(45, 26, 17, 0.4), rgba(45, 26, 17, 0.9)), url('${brownBatikUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                 <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain' }}></div>
                 <div className="absolute inset-0 shadow-[inset_0_-15px_20px_rgba(248,243,233,0.2)]"></div>
              </div>

              <div className="absolute top-16 left-6 w-16 h-16 bg-[#F8F3E9] rounded-full border-none shadow-[6px_6px_15px_rgba(45,26,17,0.12),-6px_-6px_15px_rgba(255,255,255,1)] flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-500">
                 <span className="text-[#D9B35A] text-2xl font-serif italic drop-shadow-sm">
                    {address.label ? address.label.charAt(0).toUpperCase() : "A"}
                 </span>
              </div>

              <div className="p-6 pt-10 bg-transparent h-full flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="text-lg font-bold text-[#2D1A11] tracking-tight drop-shadow-sm">{address.recipient_name}</h3>
                       <p className="text-[#8B7355] text-[11px] font-black tracking-widest uppercase mt-0.5">{address.phone_number}</p>
                     </div>
                     {address.is_primary && (
                       <span className="bg-gradient-to-r from-[#D9B35A] to-[#C5A059] text-[#1A1A1A] px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black shadow-[4px_4px_10px_rgba(217,179,90,0.3),-2px_-2px_5px_rgba(255,255,255,0.5)]">
                         Utama
                       </span>
                     )}
                  </div>

                  <p className="text-[#5A4A3B] text-xs leading-relaxed mb-2 line-clamp-2">{address.street}</p>
                  <p className="text-[#D9B35A] text-[9px] uppercase font-black tracking-[0.2em] mb-6">{address.region}</p>
                </div>

                <div className="flex items-center justify-between pt-5 mt-auto shadow-[0_-10px_15px_-15px_rgba(45,26,17,0.15)] relative">
                  <div className="flex gap-4">
                     <button onClick={() => handleEditClick(address)} className="text-[#8B7355] hover:text-[#D9B35A] text-[10px] font-black uppercase tracking-[0.15em] transition-colors drop-shadow-sm">Ubah</button>
                     <button onClick={() => handleDelete(address.id)} className="text-[#C5A059]/50 hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.15em] transition-colors drop-shadow-sm">Hapus</button>
                  </div>

                  {!address.is_primary && (
                    <button onClick={() => handleSetPrimary(address.id)} className="bg-[#F8F3E9] border-none text-[#8B7355] px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold shadow-[4px_4px_10px_rgba(45,26,17,0.1),-4px_-4px_10px_rgba(255,255,255,1)] hover:shadow-[inset_4px_4px_10px_rgba(45,26,17,0.1),inset_-4px_-4px_10px_rgba(255,255,255,1)] hover:text-[#D9B35A] transition-all duration-300">
                      Jadikan Utama
                    </button>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAddresses} 
        editData={editData} 
      />
    </div>
  );
}