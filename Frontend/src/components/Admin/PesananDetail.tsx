"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OrderService } from '@/services/OrderService';
import { AlertService } from '@/services/AlertService';

export default function PesananDetail({ orderId }: { orderId: string }) {
  const router = useRouter();
  
  // Aset Nusantara
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";
  const batikPatternUrl = "https://www.transparenttextures.com/patterns/black-thread.png";

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [deadline, setDeadline] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 👇 STATE BARU UNTUK RAJAONGKIR 👇
  const [resi, setResi] = useState('');
  const [isRequestingResi, setIsRequestingResi] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await OrderService.downloadPDF(orderId);
    } catch (error) {
      console.error("Gagal mendownload PDF:", error);
      alert("Terjadi kesalahan saat mengunduh dokumen referensi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId || orderId === 'undefined') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await OrderService.getOrderDetail(orderId);
      
      if (response && response.data) {
        setData(response.data);
        
        if (response.data.deadline) {
          const dateStr = new Date(response.data.deadline).toISOString().split('T')[0];
          setDeadline(dateStr);
        }
        if (response.data.catatan) {
          setCatatan(response.data.catatan);
        }
        // Jika data dari database sudah punya resi, masukkan ke state
        if (response.data.resi) {
          setResi(response.data.resi);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data detail pesanan:", error);
      alert("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // FUNGSI SIMULASI API RAJAONGKIR
  const handleRequestResi = async () => {
    setIsRequestingResi(true);
    
    // Simulasi jeda waktu menembak API Komerce (1.5 detik)
    setTimeout(async () => { // 👈 Tambahkan kata async di sini
      try {
        const dummyResi = "JP" + Math.floor(100000000 + Math.random() * 900000000);
        
        // 1. SIMPAN RESI KE DATABASE LARAVEL 👇
        await OrderService.updateResi(orderId, dummyResi);
        
        // 2. JIKA BERHASIL, UBAH TAMPILAN DI LAYAR 👇
        setResi(dummyResi);
        setIsRequestingResi(false);
        
        AlertService.success(
          "Resi Berhasil Diterbitkan!", 
          `Sistem RajaOngkir telah merilis nomor resi ${dummyResi} secara Cashless. Data telah tersimpan di database.`
        );
      } catch (error) {
        console.error("Gagal menyimpan resi:", error);
        setIsRequestingResi(false);
        AlertService.error("Error", "Gagal menyimpan resi ke database.");
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D9B35A]"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-10 text-center text-red-500 font-sans">Data pesanan tidak ditemukan.</div>;
  }

  const renderPreview = (pov: 'front' | 'back' | 'top') => {
    const parts = data?.detail_material?.parts;
    const colors = data?.detail_material?.colors || {};
    const visibleParts = data?.detail_material?.visibleParts || {};

    if (!parts || parts.length === 0) {
      return <div className="text-white/30 text-xs tracking-wider">Menunggu Data API</div>;
    }

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {parts.map((part: any, index: number) => {
          if (visibleParts[part.id] === false) return null;

          const variant = part.variants?.[0];
          const texture = variant?.textures?.[0];
          
          if (!texture) return null;
          let imageUrl = '';
          if (pov === 'front') imageUrl = texture.img_front;
          else if (pov === 'back') imageUrl = texture.img_back;
          else if (pov === 'top') imageUrl = texture.img_top;

          if (!imageUrl) return null;

          const hexColor = colors[part.id] || "#FFFFFF";
          const zIndex = part.z_index ? part.z_index[pov.charAt(0).toUpperCase() + pov.slice(1)] : (index * 10);

          return (
            <div 
              key={`${part.id}-${pov}`}
              className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
              style={{ zIndex }}
            >
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundColor: hexColor,
                  WebkitMaskImage: `url('${imageUrl}')`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url('${imageUrl}')`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
              <img 
                src={imageUrl} 
                alt={part.name}
                className="absolute inset-0 w-full h-full object-contain mix-blend-multiply opacity-90"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2D1A11] animate-fadeIn p-4 md:p-8" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER & BACK BUTTON ================= */}
      <div className="flex flex-col md:flex-row md:items-end gap-8 border-b border-[#D9B35A]/20 pb-8 px-2 relative z-10">
        <button 
          onClick={() => router.push('/admin/pesanan')}
          className="group flex items-center justify-center w-12 h-12 bg-transparent border border-[#D9B35A]/50 rounded-none shadow-sm hover:bg-[#2D1A11] transition-all duration-500 ease-out shrink-0"
        >
          <svg className="w-5 h-5 text-[#8B7355] group-hover:text-[#D9B35A] transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex-1">
          <p className="text-[#D9B35A] font-sans text-[10px] tracking-[0.4em] uppercase mb-3 font-semibold">
            Manajemen Transaksi <span className="text-[#8B7355] mx-2">|</span> ID: {orderId?.split('-')[0]}
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-[#2D1A11] mb-2">Detail Pesanan Custom</h1>
          <p className="text-[#8B7355] font-sans text-sm font-light tracking-wide flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#D9B35A]/50"></span>
            Verifikasi desain pelanggan dan terbitkan instruksi produksi bengkel.
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="relative w-full min-h-[600px] bg-[#FFFDF5] border border-[#D9B35A]/20 shadow-sm p-6 md:p-10 overflow-hidden rounded-sm">
        
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url('${batikPatternUrl}')`, backgroundRepeat: 'repeat' }}></div>

        <div 
          className="absolute -right-32 -bottom-32 w-[700px] h-[700px] opacity-[0.03] pointer-events-none grayscale sepia mix-blend-multiply transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundPosition: 'bottom right', backgroundRepeat: 'no-repeat' }}
        ></div>

        <div className="relative z-10 space-y-8 font-sans">
          
          {/* PREVIEW 3 SISI */}
          <div className="bg-[#2D1A11] rounded-sm p-8 shadow-xl border border-[#D9B35A]/30 relative overflow-hidden">
            <h2 className="text-[#D9B35A] font-sans text-xs font-semibold uppercase tracking-[0.3em] mb-8 text-center relative z-10">
              Preview Visual 3D
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-sm p-4 border border-white/10 flex flex-col items-center">
                <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-3">Tampak Depan</span>
                <div className="w-full h-48 md:h-56 relative drop-shadow-2xl">{renderPreview('front')}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-sm p-4 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-3">Tampak Atas</span>
                <div className="w-full h-48 md:h-56 relative drop-shadow-2xl">{renderPreview('top')}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-sm p-4 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-3">Tampak Belakang</span>
                <div className="w-full h-48 md:h-56 relative drop-shadow-2xl">{renderPreview('back')}</div>
              </div>
            </div>
          </div>

          {/* GRID BAWAH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* KOLOM KIRI: INFO & PENGIRIMAN */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/90 backdrop-blur-md rounded-sm p-8 shadow-sm border border-[#D9B35A]/20">
                <h3 className="text-xl font-bold mb-6 border-b border-[#D9B35A]/20 pb-4 text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', serif" }}>Informasi Transaksi</h3>
                <div className="space-y-5 text-sm">
                  <div>
                    <span className="block text-[#8B7355] text-[10px] uppercase font-bold tracking-widest mb-1">ID Transaksi</span>
                    <span className="font-medium text-gray-800">{data.id_transaksi || data.id}</span>
                  </div>
                  <div>
                    <span className="block text-[#8B7355] text-[10px] uppercase font-bold tracking-widest mb-1">Total Pembayaran</span>
                    <span className="font-bold text-[#D9B35A] text-base tracking-wide">Rp {Number(data.total_amount || 0).toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="block text-[#8B7355] text-[10px] uppercase font-bold tracking-widest mb-1">Customer</span>
                    <span className="font-medium text-gray-800">{data.customer || data.user?.name || '-'}</span>
                  </div>
                  {data.refnumber && (
                    <div className="bg-[#FFFDF5] p-4 rounded-sm border border-[#D9B35A]/30 mt-6">
                      <span className="block text-[#D9B35A] text-[10px] uppercase font-bold tracking-widest mb-1.5">No. Referensi (Work Order)</span>
                      <span className="font-mono font-bold text-lg text-[#2D1A11] tracking-widest">{data.refnumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 👇 PANEL LOGISTIK RAJAONGKIR BARU 👇 */}
              <div className="bg-white/90 backdrop-blur-md rounded-sm p-8 shadow-sm border border-[#D9B35A]/20">
                <h3 className="text-xl font-bold mb-6 border-b border-[#D9B35A]/20 pb-4 text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', serif" }}>Pengiriman & Logistik</h3>
                
                <div className="space-y-5 text-sm">
                  <div>
                    <span className="block text-[#8B7355] text-[10px] uppercase font-bold tracking-widest mb-1">Alamat Tujuan</span>
                    <span className="font-medium text-gray-800 leading-relaxed block">{data.shipping_address || 'Alamat belum diatur saat checkout'}</span>
                  </div>
                  
                  {/* Status Resi / Tombol */}
                  <div className="mt-6 p-5 bg-[#D9B35A]/5 border border-[#D9B35A]/30 rounded-sm">
                     <span className="block text-[#D9B35A] text-[10px] uppercase font-bold tracking-widest mb-3">Status Pengiriman (RajaOngkir)</span>
                     
                     {resi ? (
                       <div className="animate-fadeIn">
                         <p className="text-gray-800 font-medium mb-2">Nomor Resi Resmi:</p>
                         <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                           <span className="font-mono font-black text-xl text-[#2D1A11] tracking-widest bg-white px-4 py-2 border border-[#D9B35A]/50 rounded shadow-sm">{resi}</span>
                           <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-200 text-center">Menunggu Pick-up Kurir</span>
                         </div>
                         <button className="mt-4 w-full py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors">
                           Cetak Label Pengiriman (AWB)
                         </button>
                       </div>
                     ) : (
                       <div>
                         <p className="text-gray-600 text-xs mb-4 leading-relaxed">Pesanan ini belum memiliki nomor resi. Pastikan tas sudah diproduksi sebelum men-generate resi otomatis secara Cashless.</p>
                         <button 
                           onClick={handleRequestResi}
                           disabled={isRequestingResi}
                           className="w-full py-3 bg-[#2D1A11] text-[#D9B35A] font-bold text-[11px] uppercase tracking-[0.1em] rounded-sm shadow-md hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                         >
                           {isRequestingResi ? (
                             <>
                               <svg className="animate-spin h-4 w-4 text-[#D9B35A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                               Menghubungi RajaOngkir...
                             </>
                           ) : (
                             'Request Resi RajaOngkir'
                           )}
                         </button>
                       </div>
                     )}
                  </div>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN: DETAIL MATERIAL (TETAP SAMA) */}
            <div className="lg:col-span-7 flex flex-col h-full space-y-6">
              <div className="bg-white/90 backdrop-blur-md rounded-sm p-8 shadow-sm border border-[#D9B35A]/20 flex-grow">
                <div className="flex justify-between items-end mb-6 border-b border-[#D9B35A]/20 pb-4">
                  <h3 className="text-xl font-bold text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', serif" }}>Anatomi & Material</h3>
                  <span className="px-4 py-1.5 bg-[#2D1A11] text-[#D9B35A] text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-md">
                    Ukuran: {data.detail_material?.size || '-'}
                  </span>
                </div>
                <div className="overflow-auto pr-2 max-h-[420px] custom-scrollbar">
                {data.detail_material?.parts && data.detail_material.parts.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                      <tr>
                        <th className="pb-3 pt-2 text-[#8B7355] text-[10px] uppercase font-bold tracking-widest border-b border-[#D9B35A]/30 w-1/3">Komponen Bagian</th>
                        <th className="pb-3 pt-2 text-[#8B7355] text-[10px] uppercase font-bold tracking-widest border-b border-[#D9B35A]/30 w-1/3">Varian Bentuk</th>
                        <th className="pb-3 pt-2 text-[#8B7355] text-[10px] uppercase font-bold tracking-widest border-b border-[#D9B35A]/30 text-right w-1/3">Material</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.detail_material.parts.map((part: any, index: number) => {
                        const selectedVariant = part.variants?.[0];
                        const selectedTexture = selectedVariant?.textures?.[0];

                        return (
                          <tr key={index} className="hover:bg-[#FFFDF5] transition-colors duration-300 group">
                            <td className="py-4 pr-4 align-top">
                              <p className="font-bold text-[#2D1A11] text-sm tracking-wide">{part.name}</p>
                              <p className="text-[10px] font-mono text-gray-400 tracking-wider mt-1.5">{part.part_code || '-'}</p>
                            </td>
                            <td className="py-4 pr-4 align-top">
                              <p className="text-gray-800 text-[11px] font-semibold uppercase tracking-wider mb-0.5 mt-0.5">{selectedVariant?.name || 'Default Variant'}</p>
                              <p className="text-[9px] font-mono text-gray-400 mt-1.5">{selectedVariant?.variant_code || '-'}</p>
                            </td>
                            <td className="py-4 align-top text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-[#D9B35A] bg-[#D9B35A]/10 px-3 py-1.5 rounded-sm border border-[#D9B35A]/20 shadow-sm inline-block uppercase tracking-wider">{selectedTexture?.name || 'Default Texture'}</span>
                                <span className="text-[9px] font-mono text-[#D9B35A]/70 mt-2 tracking-wider">{selectedTexture?.texture_code || '-'}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-10 text-center border border-dashed border-[#D9B35A]/30 rounded-sm">
                    <p className="text-[#8B7355] text-xs font-light tracking-wide italic">Menunggu sinkronisasi blueprint komponen...</p>
                  </div>
                )}
              </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="px-10 py-3.5 rounded-sm bg-[#2D1A11] border border-[#D9B35A]/30 text-[#D9B35A] font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? 'Menyiapkan PDF...' : 'Cetak Referensi PDF'}
                </button> 
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}