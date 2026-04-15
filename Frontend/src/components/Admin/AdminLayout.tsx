'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthService } from '@/services/AuthService';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '', email: '', roles: [] as string[], permissions: [] as string[] });

  // URL Aksen Nusantara
  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";

 // JANGAN LUPA IMPORT INI DI ATAS:
  // import { AuthService } from "@/services/AuthService";

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const data = await AuthService.getUser();

        if (data && data.roles && (data.roles.includes("admin") || data.roles.includes("super_admin"))) {
          setUserData({ 
            name: data.name, 
            email: data.email, 
            roles: data.roles,
            permissions: data.permissions || [] 
          });
          setIsAuthorized(true);
        } else {
          window.location.replace("/");
        }

      } catch (error: any) {
        console.error("Gagal mengecek akses:", error.message);
        if (error.message !== "Unauthorized: Session expired") {
          window.location.replace("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error("Gagal logout dari server:", err);
    } finally {
      localStorage.removeItem("user");
      window.location.replace("/signin");
    }
  };

  /**
   * FILTER MENU: 
   */
  const allMenuItems = [
    { 
      title: 'Dashboard', 
      path: '/admin', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', 
      permissionKey: 'view_dashboard' 
    },
    { 
      title: 'Data Pelanggan', 
      // Catatan: Jika routing Next.js kamu menggunakan nama tunggal, ganti jadi '/admin/customer'
      path: '/admin/customer', 
      // Menggunakan icon "Users Group" agar berbeda dengan admin
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
      permissionKey: 'view_customers' 
    },
    { 
      title: 'Kelola Pengguna', 
      path: '/admin/admin', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 
      permissionKey: 'view_users' 
    },
    { 
      title: 'Manajemen Role', 
      path: '/admin/roles', 
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
      permissionKey: 'view_roles' 
    },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (userData.roles.includes('super_admin')) return true;
    return userData.permissions.includes(item.permissionKey);
  });

  const displayRole = userData.roles.length > 0 ? userData.roles[0].replace('_', ' ') : 'Administrator';

  // Loading state
  if (isLoading || !isAuthorized) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0806] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] mix-blend-screen pointer-events-none" style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`, backgroundSize: '400px', backgroundPosition: 'center' }}></div>
        <div className="absolute w-[400px] h-[400px] bg-[#C5A059] opacity-5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center w-32 h-32 mb-8">
            <div className="absolute inset-0 border-[1px] border-dashed border-[#C5A059]/30 rounded-full animate-[spin_12s_linear_infinite]"></div>
            <div className="relative w-12 h-14 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
              <img src={gununganUrl} alt="Loading" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-[#C5A059] text-sm tracking-[0.4em] uppercase font-light" style={{ fontFamily: "'Cinzel', serif" }}>Mempersiapkan</h2>
        </div>
      </div>
    );
  }

  const firstName = userData.name.split(' ')[0] || 'Admin';

  return (
    <div className="flex h-screen bg-[#F8F3E9] font-sans overflow-hidden text-[#2D1A11] relative" style={{ fontFamily: "'Playfair Display', serif" }}>

      {/* Background Decor */}
      <div className="absolute right-[-5%] top-0 w-[600px] h-[800px] pointer-events-none z-0 opacity-[0.03] mix-blend-multiply grayscale fixed" style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right top' }}></div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen bg-[#2D1A11] shadow-[20px_0_60px_-15px_rgba(45,26,17,0.4)] transition-all duration-500 ease-in-out w-20 hover:w-72 overflow-hidden group flex flex-col border-r border-[#C5A059]/20 rounded-r-[2rem]">
        
        <div className="absolute bottom-0 left-0 w-full h-64 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom left' }}></div>

        {/* ============================================================ */}
        {/* AREA LOGO DENGAN EFEK SWAP & UKURAN LEBIH BESAR & TENGAH     */}
        {/* ============================================================ */}
        <div className="h-28 flex items-center justify-center w-full shrink-0 relative z-10 border-b border-[#C5A059]/10 transition-all duration-500 overflow-hidden px-4">
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* LOGO SAAT DITUTUP (HANYA ICON U) */}
            <img 
              src="/icon.png" 
              alt="Icon Logo" 
              // Menghilang saat group (sidebar) di-hover
              className="w-14 h-14 object-contain transition-all duration-500 absolute opacity-100 group-hover:opacity-0 group-hover:scale-50" 
            />
            
            {/* LOGO SAAT DIBUKA (TULISAN LENGKAP) */}
            <img 
              src="/images/logo/logo1.png" 
              alt="Full Logo" 
              // Muncul saat group (sidebar) di-hover
              className="h-14 w-auto max-w-[200px] object-contain transition-all duration-500 absolute opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-125" 
            />
          </div>
        </div>
        {/* ============================================================ */}

        <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto relative z-10 no-scrollbar pb-10">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path} className="list-none">
                <Link href={item.path} className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group/menu relative ${isActive ? 'bg-gradient-to-r from-[#C5A059] to-[#E0B976] text-[#2D1A11] shadow-[0_10px_20px_-5px_rgba(197,160,89,0.4)]' : 'text-[#F8F3E9]/60 hover:bg-[#C5A059]/10 hover:text-[#C5A059]'}`}>
                  <svg className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/menu:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className={`ml-5 text-sm font-bold font-sans tracking-wide transition-opacity duration-300 whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </nav>

        <div className="p-5 border-t border-[#C5A059]/10 relative z-10 bg-[#2D1A11]/80 backdrop-blur-md">
          <div className="mb-3 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[10px] text-[#C5A059] font-bold tracking-[0.2em] uppercase">{displayRole}</p>
            <p className="text-sm text-[#F8F3E9] font-semibold truncate mt-1">{userData.name}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center text-[#F8F3E9]/50 hover:text-[#C5A059] transition-all p-3 rounded-xl hover:bg-[#C5A059]/10 group/logout border border-transparent hover:border-[#C5A059]/30">
            <svg className="w-5 h-5 group-hover/logout:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="ml-4 text-sm font-bold font-sans tracking-wide opacity-0 group-hover:opacity-100 whitespace-nowrap">Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-20 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-24 bg-[#F8F3E9]/80 backdrop-blur-xl border-b border-[#C5A059]/20 flex items-center justify-between px-8 sm:px-12 z-20 shrink-0 shadow-sm">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D1A11]" style={{ fontFamily: "'Cinzel', serif" }}>
              {menuItems.find(item => item.path === pathname)?.title || 'Admin Panel'}
            </h2>
            <p className="text-sm text-[#C5A059] font-medium mt-1 tracking-wide font-sans">
              Selamat datang kembali, {firstName}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-4 border-l border-[#C5A059]/30 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#2D1A11] truncate max-w-[150px] font-sans">{userData.name}</p>
                <p className="text-[10px] text-[#C5A059] font-bold tracking-[0.15em] uppercase">{displayRole}</p>
              </div>
              <div className="w-12 h-12 rounded-xl border-2 border-[#C5A059] overflow-hidden bg-[#2D1A11] p-0.5">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=C5A059&color=2D1A11&bold=true`} alt="Profile" className="rounded-lg w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10 scroll-smooth">
          <div className="max-w-[1600px] mx-auto relative">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
} 