"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/AuthService'; 
import Swal from 'sweetalert2';

export default function KategoriRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const user = await AuthService.getUser();
        
        // Cek izin 'view_categories' yang sudah didaftarkan di RBAC
        const isSuperAdmin = user?.roles?.includes("super_admin");
        const canViewCategories = user?.permissions?.includes("view_categories");

        if (isSuperAdmin || canViewCategories) {
          setIsAuthorized(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            text: 'Anda tidak memiliki otoritas untuk mengakses Manajemen Kategori.',
            background: '#F8F3E9',
            color: '#2A1B14',
            showConfirmButton: false,
            timer: 2000
          });
          router.replace('/admin'); 
        }
      } catch (error) {
        router.replace('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [router]);

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

  if (!isAuthorized) return null;

  return <>{children}</>;
}