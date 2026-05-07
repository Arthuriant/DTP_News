import { api } from "@/lib/api";

export const DashboardService = {
  getStats: async () => {
    return await api<any>("/dashboard-stats", {
      method: "GET",
    });
  },

  downloadReport: async () => {
    // 👇 Ubah URL ini menggunakan jalur proxy Next.js Anda 👇
    const urlEndpoint = "/api-fe/proxy/dashboard-report/pdf"; 
    
    const response = await fetch(urlEndpoint, {
      method: "GET",
      credentials: "include", // Membawa cookie otentikasi Sanctum
      headers: {
        "Accept": "application/pdf",
      }
    });

    if (!response.ok) {
      throw new Error("Gagal mengunduh dokumen dari server");
    }

    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Eksekutif_UpToYou_${new Date().getTime()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};