// src/services/AdminService.ts
import { api } from "@/lib/api";

export const AdminService = {
  // Mengambil semua data pesanan dari Laravel
  getAllOrders: async () => {
    return await api<any>("/admin/orders", {
      method: "GET",
    });
  },

  // (Opsional untuk nanti) Mengubah status pesanan
  updateOrderStatus: async (orderId: string, status: string) => {
    return await api<any>(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }
};