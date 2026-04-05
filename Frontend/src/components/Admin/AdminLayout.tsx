'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // STATE UNTUK RBAC DAN DATA USER
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/user", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.roles && data.roles.includes("admin")) {
            setUserData({ name: data.name, email: data.email });
            setIsAuthorized(true); // Izinkan masuk
          } else {
            window.location.replace("/"); // Tendang ke Home
          }
        } else {
          window.location.replace("/signin"); // Tendang ke Signin
        }
      } catch (error) {
        console.error("Gagal mengecek akses:", error);
        window.location.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.replace("/signin");
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { title: 'Produk & Kustom', path: '/admin/produk', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: 'Pesanan Custom', path: '/admin/pesanan', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: 'Data Customer', path: '/admin/customer', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Mitra Pengrajin', path: '/admin/pengrajin', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
  ];

  // LAYAR LOADING KHUSUS: Mengikuti desain background tim frontend
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-[#E0EFFF] to-[#E6E6FA] items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-[#2D3E5E] font-bold tracking-tight animate-pulse">Menyiapkan Ruang Kendali...</p>
        </div>
      </div>
    );
  }

  // Ambil nama depan saja untuk sapaan
  const firstName = userData.name.split(' ')[0] || 'Admin';

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#E0EFFF] to-[#E6E6FA] font-sans overflow-hidden text-[#2D3E5E]">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-[#2D3E5E]/80 to-[#4B5E8C]/80 backdrop-blur-xl shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out w-20 hover:w-64 overflow-hidden group flex flex-col rounded-r-[2.5rem]">
        
        <div className="h-28 flex items-center px-6 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center font-black text-xl text-[#3B82F6] shrink-0 shadow-[0_8px_30px_rgb(255,255,255,0.3)]">
            U
          </div>
          <span className="ml-4 font-black text-xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap tracking-tight">
            UpToYou<span className="text-[#A5B4FC]">.</span>
          </span>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path} className="list-none">
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group/menu relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white shadow-[0_10px_30px_0px_rgba(59,130,246,0.35)]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover/menu:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className={`ml-5 text-sm font-semibold transition-opacity duration-300 whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {item.title}
                  </span>
                  {isActive && <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>}
                </Link>
              </li>
            );
          })}
        </nav>

        {/* Footer Sidebar (Fungsi Logout Aktif) */}
        <div className="p-4 border-t border-white/5">
            <button onClick={handleLogout} className="w-full flex items-center text-slate-400 hover:text-white transition p-3 rounded-2xl hover:bg-white/5 group/logout">
                <svg className="w-5 h-5 group-hover/logout:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="ml-5 text-sm font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap">Keluar</span>
            </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-20 flex flex-col h-screen overflow-hidden">
        
        <header className="h-24 bg-white/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-10 z-20 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-[#2D3E5E] tracking-tighter">
              {menuItems.find(item => item.path === pathname)?.title || 'Admin Panel'}
            </h2>
            <p className="text-xs text-slate-500 font-medium -mt-1">Selamat datang kembali, {firstName}!</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center bg-[#F3F6F9] rounded-2xl px-5 py-3 w-72 border border-slate-100 focus-within:border-blue-300 transition-all focus-within:bg-white focus-within:shadow-inner">
                <input type="text" placeholder="Cari pesanan atau produk..." className="bg-transparent border-none outline-none text-sm w-full text-slate-600" />
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="flex items-center gap-4 border-l pl-6 border-slate-100">
              <div className="text-right">
                <p className="text-xs font-bold text-[#2D3E5E] truncate max-w-[120px]">{userData.name}</p>
                <p className="text-[10px] text-[#3B82F6] font-bold tracking-widest uppercase">Administrator</p>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-white ring-1 ring-slate-100 p-0.5 shrink-0">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3B82F6&color=fff&rounded=true&bold=true`} 
                  alt="Profile" 
                  className="rounded-xl w-full h-full" 
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}