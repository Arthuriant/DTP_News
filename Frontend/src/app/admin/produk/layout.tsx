"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/AuthService'; 
import Swal from 'sweetalert2';

export default function ProdukRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const user = await AuthService.getUser();
        
        // Cek apakah user adalah super_admin ATAU punya izin 'view_products'
        const isSuperAdmin = user?.roles?.includes("super_admin");
        const canViewProducts = user?.permissions?.includes("view_products");

        if (isSuperAdmin || canViewProducts) {
          setIsAuthorized(true); // Izinkan masuk
        } else {
          // Jika tidak punya izin, tendang keluar!
          Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            text: 'Anda tidak memiliki otoritas untuk mengakses Manajemen Produk.',
            background: '#F8F3E9',
            color: '#2A1B14',
            confirmButtonColor: '#2D1A11',
            showConfirmButton: false,
            timer: 2000
          });
          router.replace('/admin'); // Kembalikan ke Dashboard
        }
      } catch (error) {
        router.replace('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [router]);

  // Layar loading sementara saat satpam mengecek KTP (agar data tidak bocor sekilas)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F3E9]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#8B7355] font-bold text-[10px] uppercase tracking-widest animate-pulse">Memverifikasi Otoritas...</p>
        </div>
      </div>
    );
  }

  // Jika tidak berhak, jangan render apapun (karena sedang dialihkan)
  if (!isAuthorized) return null;

  // Jika lolos, silakan masuk ke halaman produk dan anak-anaknya!
  return <>{children}</>;
}