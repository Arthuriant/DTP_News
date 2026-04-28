"use client";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import { AddressService } from "@/services/AddressService";
import Swal from 'sweetalert2';

export default function AddressTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";


  const fetchAddresses = async () => {
    try {
      const data = await AddressService.getAddresses();
      setAddresses(data);
    } catch (error: any) {
      console.error("Gagal mengambil alamat:", error.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
  const result = await Swal.fire({
      title: 'Hapus Alamat?',
      text: "Data lokasi pengiriman ini akan dihapus secara permanen.",
      icon: 'warning',
      showCancelButton: true,
      background: '#F8F3E9',
      color: '#2D1A11',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      buttonsStyling: false, 
      customClass: {
        confirmButton: 'bg-[#2D1A11] text-[#D9B35A] px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] mx-2 shadow-md hover:bg-[#3d2417] transition-colors',
        cancelButton: 'bg-white text-[#8B7355] border border-[#8B7355]/30 px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] mx-2 shadow-sm hover:bg-[#EFE8DC] transition-colors'
      }
    });
      if (!result.isConfirmed) return;

      try {
        await AddressService.deleteAddress(id);
        fetchAddresses();

        Swal.fire({
          title: 'Terhapus!',
          text: 'Alamat berhasil dihapus dari daftar.',
          icon: 'success',
          confirmButtonColor: '#D9B35A', 
          background: '#F8F3E9',
          color: '#2D1A11',
        });
        
      } catch (error: any) {
        console.error("Gagal menghapus alamat:", error.message);
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menghapus alamat.',
          icon: 'error',
          confirmButtonColor: '#2D1A11',
        });
      }
    };

  const handleSetPrimary = async (id: number) => {
    try {
      await AddressService.setPrimaryAddress(id);
      fetchAddresses();
    } catch (error: any) {
      console.error("Gagal mengubah alamat utama:", error.message);
    }
  };

  return (
    <div className="w-full font-sans animate-fadeIn relative min-h-[600px] pb-20">
      
      {/* 1. GUNUNGAN WAYANG BACKGROUND */}
      <div 
        className="fixed right-10 bottom-10 w-96 h-96 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right' }}
      ></div>

      {/* 2. HEADER SECTION */}
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
          <span className="text-lg leading-none group-hover:rotate-90 transition-transform duration-500">✧</span> 
          Tambah Alamat Baru
        </button>
      </div>

      {/* 3. ADDRESS LIST */}
      <div className="flex flex-col gap-5 relative z-10">
        {addresses.length === 0 ? (
          // Keadaan Kosong
          <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-[#FDFBF7] rounded-[2.5rem] border-2 border-dashed border-[#E8DFD0] shadow-[inset_8px_8px_16px_rgba(45,26,17,0.03),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]">
            <div className="w-20 h-20 bg-[#F8F3E9] rounded-full flex items-center justify-center mb-6 shadow-inner text-[#D9B35A] text-3xl">✧</div>
            <p className="text-[#2D1A11] font-bold text-xl">Daftar alamat masih kosong</p>
            <p className="text-[#8B7355] text-xs mt-2 uppercase tracking-widest font-medium">Klik tombol di atas untuk menambahkan alamat pertama Anda.</p>
          </div>
        ) : (
          addresses.map((address) => (
            // CARD ALAMAT: Sekarang seluruh card bisa diklik
            <div 
              key={address.id} 
              onClick={() => !address.is_primary && handleSetPrimary(address.id)}
              className={`group bg-white rounded-[1.5rem] p-6 md:px-8 md:py-6 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 ${
                address.is_primary 
                ? 'border-[#D9B35A]/50 shadow-[8px_8px_20px_rgba(217,179,90,0.08),-8px_-8px_20px_rgba(255,255,255,0.9)] bg-gradient-to-r from-[#FFFDF5] to-white cursor-default' 
                : 'border-transparent shadow-[8px_8px_20px_rgba(45,26,17,0.03),-8px_-8px_20px_rgba(255,255,255,0.9)] hover:shadow-[12px_12px_25px_rgba(45,26,17,0.06),-8px_-8px_20px_rgba(255,255,255,0.9)] hover:border-[#D9B35A]/40 cursor-pointer'
              }`}
            >
              
              {/* --- KIRI: Indikator Select & Detail Alamat --- */}
              <div className="flex gap-4 md:gap-6 items-start flex-1 w-full">
                
                {/* Indikator Bulat (Radio Button Custom) - Diubah menjadi div pasif karena klik ditangani oleh card */}
                <div 
                  className={`mt-1.5 flex-shrink-0 w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    address.is_primary 
                    ? "border-[#D9B35A] bg-[#FFFDF5] shadow-sm" 
                    : "border-[#E8DFD0] group-hover:border-[#D9B35A] bg-white"
                  }`}
                >
                  {address.is_primary && (
                    <div className="w-2.5 h-2.5 bg-[#D9B35A] rounded-full shadow-[0_0_5px_rgba(217,179,90,0.5)]"></div>
                  )}
                </div>

                {/* Konten Alamat */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-[#2D1A11] font-bold text-lg font-serif">{address.recipient_name}</h3>
                    <span className="text-[#8B7355] text-sm">({address.phone_number})</span>
                    
                    {/* Badge Label */}
                    <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ml-auto md:ml-2 ${
                      address.is_primary 
                      ? 'bg-[#2D1A11] text-[#EAC135] border-[#2D1A11]' 
                      : 'bg-[#F8F3E9] text-[#8B7355] border-[#E8DFD0]'
                    }`}>
                      {address.label || "Alamat"}
                    </span>
                  </div>
                  
                  <p className="text-[#5A4A3B] text-sm leading-relaxed max-w-2xl pr-4">
                    {address.street}
                  </p>
                  <p className="text-[#2D1A11] text-[10px] font-black uppercase tracking-wider mt-1 opacity-60">
                    {address.region}
                  </p>
                  
                  {address.details && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#F8F3E9] rounded-lg text-[10px] text-[#8B7355] font-medium border border-[#E8DFD0]/50 w-fit">
                      <span className="opacity-70 text-[#D9B35A]">📍</span> {address.details}
                    </div>
                  )}
                </div>
              </div>

              {/* --- KANAN: Tombol Aksi (Ubah & Hapus) --- */}
              {/* Penting: stopPropagation agar klik tombol tidak memicu klik kartu */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="flex items-center gap-6 shrink-0 ml-10 md:ml-0 md:pl-8 md:border-l border-[#E8DFD0]/40 w-full md:w-auto justify-end mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0"
              >
                
                {/* Tombol Ubah */}
                <button 
                  onClick={() => { setEditData(address); setIsModalOpen(true); }}
                  className="text-[#D9B35A] text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#2D1A11] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D9B35A] hover:after:w-full after:transition-all duration-300"
                >
                  Ubah
                </button>
                
                {/* Tombol Hapus */}
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-[#8B7355] border border-transparent hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
                >
                  Hapus
                </button>
                
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