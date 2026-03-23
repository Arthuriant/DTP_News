// src/app/components/Admin/Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [animatedBars, setAnimatedBars] = useState<number[]>([]);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Data untuk bar chart (pesanan kustom per tahun)
  const barData = [40, 60, 30, 80, 50, 40, 70, 90, 40, 60, 80, 50, 30];
  const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  // Animasi bar saat komponen mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBars(barData);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Data statistik dikembalikan menggunakan ikon SVG (panah) ala referensi
  const stats = [
    { title: 'Pesanan', count: '348', color: 'text-[#ff7831]', ring: 'border-[#ff7831]', arrow: 'M5 15l7-7 7 7' },
    { title: 'Selesai', count: '128', color: 'text-[#4ccbe8]', ring: 'border-[#4ccbe8]', arrow: 'M19 9l-7 7-7-7' },
    { title: 'Menunggu', count: '10', color: 'text-[#ffc233]', ring: 'border-[#ffc233]', arrow: 'M5 15l7-7 7 7' },
    { title: 'Pengrajin', count: '3.458', color: 'text-[#5cd38a]', ring: 'border-[#5cd38a]', arrow: 'M19 9l-7 7-7-7' },
    { title: 'Customer', count: '3.488', color: 'text-[#a461f8]', ring: 'border-[#a461f8]', arrow: 'M5 15l7-7 7 7' },
  ];

  // Data untuk progress bar kapasitas pengrajin
  const capacityData = [
    { label: 'Tim Tote Bag', value: 65, color: 'bg-gradient-to-r from-[#ff8b49] to-[#ff5e1e]' },
    { label: 'Tim Sling Bag', value: 84, color: 'bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]' },
    { label: 'Tim Backpack', value: 28, color: 'bg-gradient-to-r from-[#4ccbe8] to-[#06b6d4]' },
    { label: 'Tim Clutch', value: 16, color: 'bg-gradient-to-r from-[#c084fc] to-[#a461f8]' },
  ];

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-[#2b304c]">
      {/* Header dengan sapuan dan tombol aksi */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#2b304c] tracking-tight">Hello, Admin! 👋</h1>
          <p className="text-[13px] text-[#8f95b2] mt-1 font-medium max-w-md">
            Pantau performa kustomisasi tas dan pertumbuhan penjualan bulanan Anda di sini.
          </p>
        </div>
        <button className="group relative bg-gradient-to-r from-[#ff8b49] to-[#ff5e1e] hover:shadow-[0_12px_25px_rgba(255,94,30,0.4)] text-white px-7 py-3 rounded-full text-[13px] font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 border border-white/20 overflow-hidden">
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">+</span> Buat Pengumuman
          </span>
        </button>
      </div>

      {/* Section Overview */}
      <div>
        <h2 className="text-xl font-extrabold text-[#2b304c] mb-4">Ringkasan</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              <div className="flex items-center gap-4">
                
                {/* Ikon Lingkaran Putus-putus seperti desain referensi sebelumnya */}
                <div className={`w-12 h-12 rounded-full border-[3px] border-r-transparent ${stat.ring} flex items-center justify-center transform -rotate-45 relative bg-white/60 group-hover:scale-110 transition-transform duration-300`}>
                   <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
                     <div className={`w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center ${stat.color}`}>
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={stat.arrow}></path>
                       </svg>
                     </div>
                   </div>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-[#2b304c]">{stat.count}</p>
                  <p className="text-[11px] text-[#8f95b2] font-bold uppercase tracking-wider">{stat.title}</p>
                </div>
              </div>
              {/* Trend indikator kecil (opsional) */}
              <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold">
                <span className="text-emerald-500">▲ 12%</span>
                <span className="text-[#b4b8ca]">dari bulan lalu</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row: Grafik Utama + Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart (Statistik Penjualan) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <h3 className="text-[15px] font-extrabold text-[#2b304c]">📈 Statistik Penjualan (dalam ribuan)</h3>
            <div className="flex items-center space-x-2 bg-white/70 border border-white/50 shadow-sm px-4 py-2 rounded-full text-xs font-semibold text-[#8f95b2] hover:bg-white transition cursor-pointer">
              <span>Tahun ini</span>
              <span className="text-[#2b304c]">▼</span>
            </div>
          </div>
          {/* Simplified line chart with SVG */}
          <div className="relative h-56 w-full">
            <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="180" x2="400" y2="180" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="135" x2="400" y2="135" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="45" x2="400" y2="45" stroke="#e2e8f0" strokeDasharray="4 4" />
              
              {/* Garis untuk Tote Bag (orange) */}
              <polyline
                points="20,150 70,120 120,100 170,80 220,70 270,60 320,50 370,40"
                fill="none"
                stroke="#ff7831"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              {/* Garis untuk Sling Bag (biru) */}
              <polyline
                points="20,140 70,110 120,90 170,100 220,80 270,90 320,70 370,60"
                fill="none"
                stroke="#4c6198"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              {/* Titik interaktif */}
              <circle cx="320" cy="50" r="4" fill="#ff7831" stroke="white" strokeWidth="2" className="cursor-pointer hover:r-6 transition-all" />
              <circle cx="320" cy="70" r="4" fill="#4c6198" stroke="white" strokeWidth="2" className="cursor-pointer hover:r-6 transition-all" />
            </svg>
            {/* Tooltip Sederhana (bisa dikembangkan) */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-3 text-xs border border-white/50">
              <p className="font-bold text-[#ff7831]">Tote Bag: 2.437</p>
              <p className="font-bold text-[#4c6198]">Sling Bag: 7.689</p>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-[#b4b8ca] font-bold mt-4 px-2">
            <span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span>
          </div>
        </div>

        {/* Gauge Chart (Kepuasan Pelanggan) */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-extrabold text-[#2b304c]">😊 Kepuasan Pelanggan</h3>
            <button className="p-2 bg-white/70 border border-white/50 rounded-xl text-[#8f95b2] hover:text-[#ff7831] transition shadow-sm">
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
          {/* Gauge dengan SVG circular progress */}
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#eef2f6" strokeWidth="10" />
              {/* Progress circle (74%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ff7831"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="251.2" // 2 * pi * 40 ≈ 251.2
                strokeDashoffset={251.2 * (1 - 74/100)} // 74% -> offset 65.3
                transform="rotate(-90 50 50)"
                className="drop-shadow-md transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#2b304c]">74%</span>
              <span className="text-[10px] text-[#8f95b2] font-semibold">dari 450 ulasan</span>
            </div>
          </div>
          <div className="w-full flex justify-between text-[11px] font-bold text-[#b4b8ca] mt-4 px-6">
            <span>0%</span><span>100%</span>
          </div>
          {/* Rating bintang */}
          <div className="flex items-center gap-1 mt-3 text-amber-400 text-sm">
            <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            <span className="text-[#8f95b2] text-xs ml-2">4.8 / 5</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Kapasitas Pengrajin + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {/* Kapasitas Pengrajin (Progress Bars) */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-extrabold text-[#2b304c]">👥 Kapasitas Pengrajin</h3>
            <button className="p-2 bg-white/70 border border-white/50 rounded-xl text-[#8f95b2] hover:text-[#ff7831] transition shadow-sm">
              <span className="material-symbols-outlined text-sm">more_horiz</span>
            </button>
          </div>
          <div className="space-y-5">
            {capacityData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[11px] font-extrabold text-[#8f95b2] mb-2 uppercase">
                  <span>{item.label}</span>
                  <span className="text-[#2b304c]">{item.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#f0f4fa] rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/30 text-[11px] text-[#8f95b2] flex justify-between">
            <span>Total aktif: 24 pengrajin</span>
            <span className="font-semibold text-emerald-600">+3 minggu ini</span>
          </div>
        </div>

        {/* Bar Chart (Pesanan Kustom per Tahun) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-6">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <h3 className="text-[15px] font-extrabold text-[#2b304c]">📊 Pesanan Kustom per Tahun</h3>
            <div className="flex items-center space-x-2 bg-white/70 border border-white/50 shadow-sm px-4 py-2 rounded-full text-xs font-semibold text-[#8f95b2] hover:bg-white transition cursor-pointer">
              <span>Grafik</span>
              <span className="text-[#2b304c]">▼</span>
            </div>
          </div>
          <div className="h-40 flex items-end justify-between gap-1 md:gap-2 relative mt-6">
            {/* Garis bantu horizontal */}
            <div className="absolute inset-0 border-b border-dashed border-[#e2e8f0] pointer-events-none"></div>
            <div className="absolute inset-0 border-b border-dashed border-[#e2e8f0] pointer-events-none" style={{ top: '50%' }}></div>
            
            {barData.map((value, i) => {
              const barHeight = animatedBars[i] || 0;
              const isHovered = hoveredBar === i;
              return (
                <div
                  key={i}
                  className="relative flex-1 flex flex-col items-center group h-full"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div
                    className={`w-full max-w-[20px] bg-gradient-to-t from-[#ff8b49] to-[#ff5e1e] rounded-t-lg transition-all duration-700 ease-out ${
                      isHovered ? 'scale-110 shadow-xl' : ''
                    }`}
                    style={{ height: `${barHeight}%` }}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2b304c] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20 shadow-lg">
                        {value} unit
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[#b4b8ca] font-bold mt-2 rotate-45 origin-left md:rotate-0 md:text-[10px]">
                    {years[i]}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex justify-end items-center gap-4 mt-6 text-[11px] text-[#8f95b2]">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gradient-to-t from-[#ff8b49] to-[#ff5e1e] rounded-sm"></span>
              <span>Jumlah pesanan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}