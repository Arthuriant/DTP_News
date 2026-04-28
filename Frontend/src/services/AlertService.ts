import Swal, { SweetAlertOptions } from 'sweetalert2';

const baseSwalConfig: SweetAlertOptions = {
  background: '#F8F3E9',
  color: '#2D1A11',
  buttonsStyling: false,
  customClass: {
    confirmButton: 'bg-[#2D1A11] text-[#D9B35A] px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] mx-2 shadow-md hover:bg-[#3d2417] transition-colors',
    cancelButton: 'bg-white text-[#8B7355] border border-[#8B7355]/30 px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] mx-2 shadow-sm hover:bg-[#EFE8DC] transition-colors'
  }
};

export const AlertService = {
  // Notifikasi Berhasil
  success: (title: string, text: string) => {
    return Swal.fire({
      ...baseSwalConfig,
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'TUTUP',
    });
  },

  // Notifikasi Gagal/Error
  error: (title: string, text: string) => {
    return Swal.fire({
      ...baseSwalConfig,
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'MENGERTI',
    });
  },

  // Konfirmasi Aksi (Hapus, Ubah Status, dll)
  confirm: async (title: string, text: string, confirmBtnText: string = 'YA, LANJUTKAN') => {
    const result = await Swal.fire({
      ...baseSwalConfig,
      icon: 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmBtnText,
      cancelButtonText: 'BATAL',
    });
    return result.isConfirmed; 
  }
};