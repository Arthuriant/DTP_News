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

};