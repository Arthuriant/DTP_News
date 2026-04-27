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
};