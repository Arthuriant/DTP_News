import { api } from "@/lib/api";

export const OrderService = {
  // Mengirim data checkout ke backend
  checkout: async (payload: {
    shipping_address:  string;
    payment_method:    string;
    shipping_cost:     number;
    shipping_courier:  string;
    shipping_service:  string;
    origin_id:         number;
    destination_id:    number;
    customer_name:     string;
    customer_email:    string;
    customer_phone:    string;
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

  // 1. Menggunakan versi temanmu untuk mendukung filter tanggal di Backend
  getMyOrders: async (date?: string) => {
      const queryParam = date ? `?date=${date}` : "";
      
      return await api<any>(`/my-orders${queryParam}`, {
        method: "GET",
      });
  },

  // 2. Mempertahankan Kodemu (Jaga-jaga jika ada komponen UI yang masih memakai ini)
  confirmReceived: async (orderId: string) => {
    return await api<any>(`/my-orders/${orderId}/confirm`, {
      method: "PUT",
    });
  },

  // 3. Mempertahankan Kode Temanmu (Sesuai dengan fungsi backend confirmDelivery)
  confirmDelivery: async (id: string) => {
    return await api<any>(`/my-orders/${id}/complete`, {
      method: "POST", 
    });
  },
  
  updateResi: async (orderId: string, resi: string) => {
    return await api<any>(`/admin/orders/${orderId}/resi`, {
      method: "PUT",
      body: JSON.stringify({ resi }),
    });
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api<any>(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response;
  },

};