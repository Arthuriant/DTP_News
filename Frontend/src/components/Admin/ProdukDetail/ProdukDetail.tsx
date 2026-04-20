"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductPartsTab from './Tabs/ProductPartsTab'; // Pastikan path-nya sesuai
import ProductGalleriesTab from './Tabs/ProductGalleriesTab';
import ProductDimensionsTab from './Tabs/ProductDimensionsTab';
import ProductMarketingTab from './Tabs/ProductMarketingTab';
import ProductSizesTab from './Tabs/ProductSizesTab';
// import { ProductService } from '@/services/ProductService'; // Nanti kita gunakan untuk ambil nama produk

interface ProdukDetailProps {
  productId: string;
}

export default function ProdukDetail({ productId }: ProdukDetailProps) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Ini adalah UUID produk yang dilempar dari halaman sebelumnya

  // State untuk Tab Aktif
  const [activeTab, setActiveTab] = useState('galeri');
  const [productName, setProductName] = useState('Detail Mahakarya');

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  // Daftar Tab Konfigurasi
  const tabs = [
    { id: 'galeri', label: 'Galeri Visual', icon: '📸' },
    { id: 'dimensi', label: 'Spesifikasi Dimensi', icon: '📏' },
    { id: 'proporsi', label: 'Panduan Proporsi (Size)', icon: '🛍️' },
    { id: 'marketing', label: 'Nilai Jual (Marketing)', icon: '✨' },
    { id: 'parts', label: 'Komponen Slicing', icon: '✂️' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER & BACK BUTTON ================= */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2 relative z-10">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => router.push('/admin/produk')}
          className="group flex items-center justify-center w-12 h-12 bg-white border border-[#D9B35A]/30 rounded-full shadow-sm hover:bg-[#D9B35A] transition-all duration-300"
        >
          <svg className="w-5 h-5 text-[#D9B35A] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">
            Konfigurasi Produk ID: <span className="text-[#8B7355] font-mono lowercase tracking-normal">{id.split('-')[0]}...</span>
          </p>
          <h1 className="text-4xl font-bold tracking-tight">{productName}</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full"></span>
            Lengkapi detail visual dan teknis untuk produk ini.
          </p>
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex overflow-x-auto hide-scrollbar px-2 space-x-4 relative z-10 font-sans">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap shadow-sm border ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] border-[#FFF6C5]/50 shadow-[#D9B35A]/20' 
                : 'bg-white text-[#8B7355] border-gray-100 hover:border-[#D9B35A]/50 hover:text-[#2D1A11]'
            }`}
          >
            <span className="text-sm">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="relative w-full min-h-[500px] bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_15px_40px_-15px_rgba(45,26,17,0.08)] p-8 md:p-12 overflow-hidden">
        
        {/* Aksen Batik Transparan di Background Area */}
        <div 
          className="absolute -right-20 -bottom-20 w-[600px] h-[600px] opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
        ></div>

        <div className="relative z-10">
          {/* DI SINI KITA AKAN ME-RENDER KOMPONEN BERDASARKAN TAB YANG AKTIF */}
          {activeTab === 'galeri' && (
        <ProductGalleriesTab /> // 👈 Panggil komponen GaleriTab yang baru dibuat
      )}

         {activeTab === 'dimensi' && (
        <ProductDimensionsTab /> // 👈 Panggil komponen Dimensi
      )}

          {activeTab === 'proporsi' && (
        <ProductSizesTab /> // 👈 Panggil komponennya
      )}

          {activeTab === 'marketing' && (
        <ProductMarketingTab /> // 👈 Panggil komponen ini
      )}
          {activeTab === 'parts' && (
  <ProductPartsTab /> // 👈 Hapus parameter di dalamnya!
)}
        </div>
      </div>

    </div>
  );
}