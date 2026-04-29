import { api } from "@/lib/api";

export const OrderService = {
  // Mengirim data checkout ke backend
  checkout: async (payload: {
    shipping_address: string;
    payment_method: string;
  }) => {
    return await api<any>("/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getOrderDetail: async (id: string) => {
    return await api<any>(`/admin/order-details/${id}`, {
      method: "GET",
      cache: "no-store",
    });
  },

  downloadPDF: async (id: string) => {
    const response = await fetch(`/api-fe/proxy/admin/order-details/${id}/download-pdf`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil file PDF dari server.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Referensi-Produksi-${id.split('-')[0]}.pdf`; 
    document.body.appendChild(a);
    a.click();
    
    
    a.remove();
    window.URL.revokeObjectURL(url);
  },

};