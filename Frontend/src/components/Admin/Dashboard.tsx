'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardService } from '@/services/DashboardService';
import { AlertService } from '@/services/AlertService'; // Pastikan ini ada

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [isDownloading, setIsDownloading] = useState(false);
  
  // State Data Dasbor yang sudah disesuaikan dengan API Laravel terbaru
  const [dashboardData, setDashboardData] = useState({
    stats: {
      revenue: 0,
      totalOrders: 0,
      activeProducts: 0,
      totalCustomers: 0,
      customer_aktif: 0,
      customer_baru: 0,
    },
    revenueChart: [0, 0, 0, 0, 0, 0] as number[],
    chartLabels: ['Bln 1', 'Bln 2', 'Bln 3', 'Bln 4', 'Bln 5', 'Bln 6'] as string[],
    orderStatus: {
      completed: 0,
      processing: 0,
      pending: 0
    },
    topCategories: [] as {name: string, percentage: number}[],
    gender: {
      laki_laki: 0,
      perempuan: 0,
      belum_diisi: 0
    },
    customer_terbaru: [] as any[]
  });

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const data = await DashboardService.getStats();
        
        if (data.admin_login) setAdminName(data.admin_login);

        setDashboardData({
          stats: {
            revenue: data.stats?.revenue || 0,
            totalOrders: data.stats?.totalOrders || 0,
            activeProducts: data.stats?.activeProducts || 0,
            totalCustomers: data.stats?.totalCustomers || 0,
            customer_aktif: data.stats?.customer_aktif || 0,
            customer_baru: data.stats?.customer_baru || 0,
          },
          revenueChart: data.revenueChart || [0, 0, 0, 0, 0, 0], 
          chartLabels: data.chartLabels || ['Bln 1', 'Bln 2', 'Bln 3', 'Bln 4', 'Bln 5', 'Bln 6'],
          orderStatus: {
            completed: data.orderStatus?.completed || 0,
            processing: data.orderStatus?.processing || 0,
            pending: data.orderStatus?.pending || 0
          },
          topCategories: data.topCategories || [],
          gender: {
            laki_laki: data.gender?.laki_laki || 0,
            perempuan: data.gender?.perempuan || 0,
            belum_diisi: data.gender?.belum_diisi || 0,
          },
          customer_terbaru: data.customer_terbaru || []
        });
      } catch (error) {
        console.error("Gagal mengambil data dasbor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    

    fetchDashboardStats();
  }, []);

  const handleDownloadReport = async () => {
      setIsDownloading(true);
      try {
        // Alert transisi (opsional, agar pengguna tahu sistem sedang memproses)
        AlertService.success("Menyiapkan Dokumen...", "Laporan PDF sedang dirakit oleh server.");
        
        await DashboardService.downloadReport();
        
        // Munculkan notifikasi sukses
        setTimeout(() => {
          AlertService.success("Berhasil", "Dokumen laporan eksekutif berhasil diunduh.");
        }, 500);
      } catch (error) {
        console.error("Gagal mendownload laporan:", error);
        AlertService.error("Gagal Mengunduh", "Terjadi kesalahan sistem saat mencoba menyiapkan dokumen laporan.");
      } finally {
        setIsDownloading(false);
      }
    };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <span className="w-12 h-12 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin mb-4"></span>
          <p className="text-[#8B7355] font-sans text-xs font-bold tracking-[0.2em] uppercase">Sinkronisasi Data Server...</p>
        </div>
      </div>
    );
  }

  // Hitung persentase gender untuk visualisasi
  const totalGender = dashboardData.gender.laki_laki + dashboardData.gender.perempuan + dashboardData.gender.belum_diisi;
  const pctPria = totalGender > 0 ? (dashboardData.gender.laki_laki / totalGender) * 100 : 0;
  const pctWanita = totalGender > 0 ? (dashboardData.gender.perempuan / totalGender) * 100 : 0;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-[#2D1A11] font-sans relative pb-10">
      
      {/* Background Aksen Halus */}
      <div 
        className="fixed right-0 top-20 w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0"
        style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      ></div>

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2 relative z-10">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Pusat Komando</p>
          <h1 className="text-4xl font-bold tracking-tight font-serif text-[#2D1A11]">Selamat Datang, {adminName}</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full shadow-[0_0_5px_#D9B35A]"></span>
            Analisis performa penjualan, logistik, dan demografi pelanggan UpToYou.
          </p>
        </div>
        <button 
          onClick={handleDownloadReport}
          disabled={isDownloading}
          className="bg-white border border-[#D9B35A] text-[#D9B35A] hover:bg-[#D9B35A] hover:text-[#2D1A11] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></span>
              Menyiapkan...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Unduh Laporan PDF
            </>
          )}
        </button>
      </div>

      {/* ================= 4 KARTU STATISTIK UTAMA ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Kartu 1: Pendapatan */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#D9B35A]/20 rounded-3xl p-6 shadow-[0_10px_30px_-15px_rgba(45,26,17,0.08)] hover:-translate-y-1 transition-transform relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D9B35A]/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#2D1A11] rounded-2xl flex items-center justify-center shadow-lg relative z-10">
              <svg className="w-6 h-6 text-[#D9B35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <p className="text-[#8B7355] text-[11px] font-bold uppercase tracking-widest mb-1 relative z-10">Total Pendapatan</p>
          <h3 className="text-2xl font-black text-[#2D1A11] font-serif relative z-10">Rp {dashboardData.stats.revenue.toLocaleString('id-ID')}</h3>
        </div>

        {/* Kartu 2: Pesanan */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#D9B35A]/20 rounded-3xl p-6 shadow-[0_10px_30px_-15px_rgba(45,26,17,0.08)] hover:-translate-y-1 transition-transform relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D9B35A]/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#FFFDF5] border border-[#D9B35A]/40 rounded-2xl flex items-center justify-center shadow-sm relative z-10">
              <svg className="w-6 h-6 text-[#D9B35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
          </div>
          <p className="text-[#8B7355] text-[11px] font-bold uppercase tracking-widest mb-1 relative z-10">Total Pesanan</p>
          <h3 className="text-2xl font-black text-[#2D1A11] font-serif relative z-10">{dashboardData.stats.totalOrders} <span className="text-sm font-sans font-medium text-[#8B7355]">Transaksi</span></h3>
        </div>

        {/* Kartu 3: Produk Aktif */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#D9B35A]/20 rounded-3xl p-6 shadow-[0_10px_30px_-15px_rgba(45,26,17,0.08)] hover:-translate-y-1 transition-transform relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D9B35A]/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#FFFDF5] border border-[#D9B35A]/40 rounded-2xl flex items-center justify-center shadow-sm relative z-10">
              <svg className="w-6 h-6 text-[#D9B35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
            </div>
            <Link href="/admin/produk" className="text-[#D9B35A] text-[10px] font-bold uppercase tracking-wider hover:underline z-10">Kelola</Link>
          </div>
          <p className="text-[#8B7355] text-[11px] font-bold uppercase tracking-widest mb-1 relative z-10">Katalog Mahakarya</p>
          <h3 className="text-2xl font-black text-[#2D1A11] font-serif relative z-10">{dashboardData.stats.activeProducts} <span className="text-sm font-sans font-medium text-[#8B7355]">Produk</span></h3>
        </div>

        {/* Kartu 4: Pelanggan (Disempurnakan dengan Data Teman Anda) */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#D9B35A]/20 rounded-3xl p-6 shadow-[0_10px_30px_-15px_rgba(45,26,17,0.08)] hover:-translate-y-1 transition-transform relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D9B35A]/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#FFFDF5] border border-[#D9B35A]/40 rounded-2xl flex items-center justify-center shadow-sm relative z-10">
              <svg className="w-6 h-6 text-[#D9B35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <div className="flex flex-col items-end z-10">
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider mb-1">+{dashboardData.stats.customer_baru} Bulan Ini</span>
            </div>
          </div>
          <p className="text-[#8B7355] text-[11px] font-bold uppercase tracking-widest mb-1 relative z-10">Total Pelanggan</p>
          <h3 className="text-2xl font-black text-[#2D1A11] font-serif relative z-10 mb-1">{dashboardData.stats.totalCustomers} <span className="text-sm font-sans font-medium text-[#8B7355]">Akun</span></h3>
          <p className="text-[10px] text-[#8B7355] font-semibold relative z-10">⭐ {dashboardData.stats.customer_aktif} aktif 30 hari terakhir</p>
        </div>

      </div>

      {/* ================= BAGIAN TENGAH: GRAFIK & STATUS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* GRAFIK PENDAPATAN (Line Chart Kustom Lebar) */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-[#D9B35A]/20 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(45,26,17,0.08)] p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#2D1A11] font-serif">Tren Penjualan</h3>
              <p className="text-[#8B7355] text-[11px] uppercase tracking-widest font-bold mt-1">6 Bulan Terakhir</p>
            </div>
          </div>

          <div className="relative w-full h-[250px] flex items-end justify-between gap-2 sm:gap-6 pt-10">
            {/* Garis Grid Horizontal di latar belakang */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              <div className="w-full border-t border-dashed border-gray-200"></div>
              <div className="w-full border-t border-dashed border-gray-200"></div>
              <div className="w-full border-t border-dashed border-gray-200"></div>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Render Batang Grafik */}
            {dashboardData.revenueChart.map((nominal, idx) => {
              // Cari nilai tertinggi untuk batas skala (Minimal skala 1 juta agar tidak error jika Rp 0)
              const maxRevenue = Math.max(...dashboardData.revenueChart, 1000000); 
              // Hitung persentase tinggi batang (minimal 2% agar batang tidak hilang jika 0)
              const heightPct = nominal === 0 ? 2 : Math.max(5, (nominal / maxRevenue) * 100);

              return (
                <div key={idx} className="relative flex-1 flex flex-col items-center group h-full justify-end z-10">
                  {/* Tooltip Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#2D1A11] text-[#D9B35A] text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none">
                    Rp {nominal.toLocaleString('id-ID')}
                  </div>

                  {/* Batang Grafik */}
                  <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-[#D9B35A] to-[#F4D145] rounded-t-xl transition-all duration-1000 ease-out group-hover:shadow-[0_0_15px_rgba(217,179,90,0.5)] group-hover:brightness-110"
                    style={{ height: `${heightPct}%` }}
                  ></div>

                  {/* Label Nama Bulan di bawah garis */}
                  <span className="absolute -bottom-7 text-[#8B7355] text-[10px] font-bold uppercase tracking-widest">
                    {dashboardData.chartLabels ? dashboardData.chartLabels[idx] : `Bln ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATUS LOGISTIK (Kanan) */}
        <div className="bg-[#2D1A11] border border-[#D9B35A]/30 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(45,26,17,0.5)] p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9B35A] opacity-10 rounded-bl-full blur-2xl"></div>
          
          <div>
            <h3 className="text-lg font-bold text-[#D9B35A] font-serif mb-1">Status Logistik</h3>
            <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold mb-8">Distribusi Pesanan Aktif</p>

            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Selesai / Terkirim</span>
                  <span>{dashboardData.orderStatus.completed}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_#34d399] transition-all duration-1000" style={{ width: `${dashboardData.orderStatus.completed}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D9B35A]"></span>Sedang Diproses</span>
                  <span>{dashboardData.orderStatus.processing}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-[#D9B35A] h-2 rounded-full shadow-[0_0_10px_#D9B35A] transition-all duration-1000" style={{ width: `${dashboardData.orderStatus.processing}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-400"></span>Menunggu Pembayaran</span>
                  <span>{dashboardData.orderStatus.pending}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-rose-400 h-2 rounded-full shadow-[0_0_10px_#fb7185] transition-all duration-1000" style={{ width: `${dashboardData.orderStatus.pending}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/admin/pesanan" className="block w-full py-3.5 text-center text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10">
              Kelola Semua Pesanan
            </Link>
          </div>
        </div>

      </div>

      {/* ================= BAGIAN BAWAH: DEMOGRAFI & KATEGORI ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Kategori Populer & Gender */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-[#D9B35A]/20 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(45,26,17,0.08)] p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-[#D9B35A]/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#2D1A11] font-serif">Wawasan Pasar</h3>
              <p className="text-[#8B7355] text-[11px] uppercase tracking-widest font-bold mt-1">Kategori Favorit & Demografi</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Kategori Populer */}
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-2">Model Paling Diminati</h4>
              {dashboardData.topCategories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold text-[#2D1A11] mb-1">
                    <span>{cat.name}</span>
                    <span>{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 rounded-full h-1.5">
                    <div className="bg-[#D9B35A] h-1.5 rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              {dashboardData.topCategories.length === 0 && (
                <p className="text-xs text-gray-400 italic">Belum ada data penjualan kategori.</p>
              )}
            </div>

            {/* Demografi Gender */}
            <div className="w-full md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#D9B35A]/10 pt-6 md:pt-0 md:pl-8">
              <h4 className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-4">Distribusi Gender</h4>
              
              <div className="flex items-end gap-2 h-24 mb-4">
                {/* Bar Pria */}
                <div className="w-1/2 flex flex-col justify-end items-center h-full group">
                  <span className="text-[10px] font-bold text-[#8B7355] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{Math.round(pctPria)}%</span>
                  <div className="w-full max-w-[40px] bg-[#2D1A11] rounded-t-lg transition-all duration-1000" style={{ height: `${pctPria}%` }}></div>
                  <span className="text-xs font-bold mt-2 text-[#2D1A11]">Pria</span>
                </div>
                {/* Bar Wanita */}
                <div className="w-1/2 flex flex-col justify-end items-center h-full group">
                  <span className="text-[10px] font-bold text-[#D9B35A] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{Math.round(pctWanita)}%</span>
                  <div className="w-full max-w-[40px] bg-[#D9B35A] rounded-t-lg transition-all duration-1000 shadow-[0_0_10px_rgba(217,179,90,0.3)]" style={{ height: `${pctWanita}%` }}></div>
                  <span className="text-xs font-bold mt-2 text-[#D9B35A]">Wanita</span>
                </div>
              </div>
              <p className="text-[9px] text-center text-gray-400 italic">
                * {dashboardData.gender.belum_diisi} pelanggan belum mengatur gender
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Pelanggan Terbaru (Data Teman Anda) */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#D9B35A]/20 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(45,26,17,0.08)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#2D1A11] font-serif">Pendaftar Baru</h3>
            <Link href="/admin/customer" className="text-[#D9B35A] hover:text-[#2D1A11] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="space-y-4">
            {dashboardData.customer_terbaru.map((cust, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FFFDF5] transition-colors border border-transparent hover:border-[#D9B35A]/20 cursor-default">
                <div className="w-10 h-10 rounded-full bg-[#D9B35A]/10 text-[#D9B35A] flex items-center justify-center font-bold font-serif uppercase shrink-0">
                  {cust.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-[#2D1A11] truncate">{cust.name}</h4>
                  <p className="text-[10px] text-[#8B7355] truncate">{cust.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {cust.bergabung}
                  </span>
                </div>
              </div>
            ))}
            {dashboardData.customer_terbaru.length === 0 && (
              <p className="text-xs text-center text-gray-400 italic py-4">Belum ada pelanggan baru.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}