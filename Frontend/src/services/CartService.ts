// src/services/CartService.ts
import { api } from "@/lib/api";

export const CartService = {
  // 1. Mengambil seluruh isi keranjang belanja
  getCart: async () => {
    return await api<any>("/cart", {
      method: "GET",
    });
  },

  // 2. Menambahkan tas kustom ke keranjang (Lengkap dengan gambar screenshot)
  addToCart: async (payload: {
    product_id: string;
    price: number;
    custom_configuration: Record<string, any>; // 👈 UBAH MENJADI INI
    image_preview: string | null;
  }) => {
    return await api<any>("/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // 3. Menghapus satu barang dari keranjang berdasarkan ID item-nya
  removeItem: async (itemId: string) => {
    return await api<any>(`/cart/${itemId}`, {
      method: "DELETE",
    });
  },
};