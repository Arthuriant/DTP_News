// src/services/CartService.ts
import { api } from "@/lib/api";

export const CartService = {
  getCart: async () => {
    try {
      return await api<any>("/cart", {
        method: "GET",
        skipRedirect: true,
      });
    } catch (error) {
      console.log("Pengguna belum login, mengatur keranjang menjadi kosong.");
      return { total: 0, items: [] }; 
    }
  },

  addToCart: async (payload: {
    product_id: string;
    price: number;
    custom_configuration: Record<string, any>; 
    image_preview: string | null;
  }) => {
    return await api<any>("/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  removeItem: async (itemId: string) => {
    return await api<any>(`/cart/${itemId}`, {
      method: "DELETE",
    });
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    return await api<any>(`/cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ qty: quantity }),
    });
  },
};