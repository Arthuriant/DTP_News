"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Success = () => {
  const params = useParams();
  const orderId = params.id as string;

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  return (
    <div className="min-h-screen bg-[#F9F6EE] flex items-center justify-center pt-54 pb-20 px-4 relative overflow-hidden" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* Aksesoris Latar Belakang */}
      <div
        className="absolute -left-20 -top-20 w-96 h-96 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      ></div>
      <div
        className="absolute -right-20 -bottom-20 w-96 h-96 opacity-[0.03] pointer-events-none rotate-180"
        style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      ></div>

      {/* Kartu Sukses */}
      <div className="max-w-2xl w-full bg-[#FFFDF5] rounded-3xl shadow-2xl border border-[#D9B35A]/30 p-8 md:p-12 relative z-10 text-center">
        
        {/* Ikon Ceklis Besar */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#EAC135] to-[#DFB121] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#D9B35A]/30">
          <svg className="w-12 h-12 text-[#2D1A11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-[#2D1A11] mb-4">Checkout Berhasil!</h1>
        <p className="text-[#8B7355] font-sans text-base md:text-lg mb-8 max-w-lg mx-auto">
          Terima kasih atas pesanan Anda. Kami akan segera memulai proses pengerjaan tas kustom impian Anda setelah pembayaran dikonfirmasi.
        </p>

        {/* Kotak Detail Pesanan & Instruksi */}
        <div className="bg-[#D9B35A]/5 border border-[#D9B35A]/20 rounded-2xl p-6 mb-8 text-left font-sans shadow-inner">
          <div className="flex flex-col md:flex-row justify-between mb-5 border-b border-[#D9B35A]/20 pb-5">
            <div>
              <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold mb-1">ID Pesanan Anda</p>
              <p className="text-[#2D1A11] font-black text-xl tracking-wide">{orderId || "ORD-XXXX"}</p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold mb-1">Status Saat Ini</p>
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
                Menunggu Pembayaran
              </span>
            </div>
          </div>

          <div>
            <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold mb-3">Instruksi Pembayaran (Manual Transfer)</p>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#D9B35A]/20 shadow-sm">
              <div className="w-16 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center font-black text-blue-800 text-lg italic">
                BCA
              </div>
              <div>
                <p className="font-bold text-[#2D1A11] text-xl tracking-widest font-mono">8720 1928 331</p>
                <p className="text-[#8B7355] text-sm font-medium">a.n. UpToYou Custom Bags</p>
              </div>
            </div>
            <p className="text-xs text-rose-500 mt-3 font-medium bg-rose-50 p-2 rounded-lg inline-block border border-rose-100">
              * Silakan simpan struk transfer Anda sebagai bukti pembayaran.
            </p>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center font-sans">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-full font-bold text-[#8B7355] bg-white border border-[#D9B35A]/40 hover:bg-[#F9F6EE] hover:text-[#2D1A11] hover:border-[#D9B35A] transition-all shadow-sm w-full sm:w-auto text-sm uppercase tracking-widest"
          >
            Kembali Belanja
          </Link>
          <Link
  href="/order/history"
  className="px-8 py-4 rounded-full font-bold text-[#1A1A1A] bg-gradient-to-r from-[#EAC135] to-[#DFB121] hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20 transition-all w-full sm:w-auto text-sm uppercase tracking-widest text-center"
>
  Lihat Pesanan Saya
</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;