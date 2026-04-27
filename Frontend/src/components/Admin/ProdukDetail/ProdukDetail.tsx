"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductPartsTab from './Tabs/ProductPartsTab';
import ProductGalleriesTab from './Tabs/ProductGalleriesTab';
import ProductDimensionsTab from './Tabs/ProductDimensionsTab';
import ProductMarketingTab from './Tabs/ProductMarketingTab';
import ProductSizesTab from './Tabs/ProductSizesTab';

interface ProdukDetailProps {
  productId: string;
}

export default function ProdukDetail({ productId }: ProdukDetailProps) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState('galeri');
  const [productName, setProductName] = useState('Detail Mahakarya');

  // Asset Nusantara (Bisa diganti dengan aset lokal kamu di folder public jika ada)
  const gununganUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_Wayang_Kulit.svg/1024px-Gunungan_Wayang_Kulit.svg.png";
  const batikPatternUrl = "https://www.transparenttextures.com/patterns/black-thread.png"; // Tekstur kain/batik halus

  // Daftar Tab Konfigurasi dengan SVG Icons Minimalis
  const tabs = [
    { 
      id: 'galeri', 
      label: 'Galeri Visual', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      )
    },
    { 
      id: 'dimensi', 
      label: 'Spesifikasi Dimensi', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
        </svg>
      )
    },
    { 
      id: 'proporsi', 
      label: 'Panduan Proporsi', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    },
    { 
      id: 'marketing', 
      label: 'Nilai Jual', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      )
    },
    { 
      id: 'parts', 
      label: 'Komponen Slicing', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2D1A11] animate-fadeIn" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER & BACK BUTTON ================= */}
      <div className="flex flex-col md:flex-row md:items-end gap-8 border-b border-[#D9B35A]/20 pb-8 px-2 relative z-10">
        
        {/* Tombol Kembali Eksklusif */}
        <button 
          onClick={() => router.push('/admin/produk')}
          className="group flex items-center justify-center w-12 h-12 bg-transparent border border-[#D9B35A]/50 rounded-none shadow-sm hover:bg-[#2D1A11] transition-all duration-500 ease-out"
        >
          <svg className="w-5 h-5 text-[#8B7355] group-hover:text-[#D9B35A] transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex-1">
          <p className="text-[#D9B35A] font-sans text-[10px] tracking-[0.4em] uppercase mb-3 font-semibold">
            Identitas Mahakarya <span className="text-[#8B7355] mx-2">|</span> ID: {id.split('-')[0]}
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-[#2D1A11] mb-2">{productName}</h1>
          <p className="text-[#8B7355] font-sans text-sm font-light tracking-wide flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#D9B35A]/50"></span>
            Lengkapi anatomi visual dan arsitektur produk.
          </p>
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex overflow-x-auto hide-scrollbar px-2 space-x-2 md:space-x-4 relative z-10 font-sans border-b border-[#D9B35A]/10 pb-4">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-3 px-6 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#2D1A11] text-[#D9B35A] border border-[#D9B35A]/30 shadow-md transform -translate-y-0.5' 
                : 'bg-transparent text-[#8B7355] border border-transparent hover:border-[#D9B35A]/30 hover:text-[#2D1A11]'
            }`}
          >
            <span className={`${activeTab === tab.id ? 'text-[#D9B35A]' : 'text-[#D9B35A]/70'}`}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="relative w-full min-h-[600px] bg-[#FFFDF5] border border-[#D9B35A]/20 shadow-sm p-8 md:p-12 overflow-hidden rounded-sm">
        
        {/* Latar Belakang Tekstur Kain/Batik Halus */}
        <div 
          className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url('${batikPatternUrl}')`, backgroundRepeat: 'repeat' }}
        ></div>

        {/* Aksen Gunungan Wayang (Pojok Kanan Bawah) */}
        <div 
          className="absolute -right-32 -bottom-32 w-[700px] h-[700px] opacity-[0.03] pointer-events-none grayscale sepia mix-blend-multiply transition-transform duration-1000 hover:scale-105"
          style={{ 
            backgroundImage: `url('${gununganUrl}')`, 
            backgroundSize: 'contain', 
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat' 
          }}
        ></div>

        {/* Konten Tab Aktif */}
        <div className="relative z-10 font-sans">
          {activeTab === 'galeri' && <ProductGalleriesTab />}
          {activeTab === 'dimensi' && <ProductDimensionsTab />}
          {activeTab === 'proporsi' && <ProductSizesTab />}
          {activeTab === 'marketing' && <ProductMarketingTab />}
          {activeTab === 'parts' && <ProductPartsTab />}
        </div>
      </div>

    </div>
  );
}