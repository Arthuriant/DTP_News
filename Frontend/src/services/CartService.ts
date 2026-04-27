// src/services/CartService.ts
import { api } from "@/lib/api";

export const CartService = {
  // 1. Mengambil seluruh isi keranjang belanja
  getCart: async () => {
    try {
      // Coba ambil data dari API
      return await api<any>("/cart", {
        method: "GET",
        skipRedirect: true,
      });
    } catch (error) {
      // Jika api.ts melempar error (misal: 401 Unauthorized karena belum login),
      // kita tangkap error-nya di sini dan kembalikan data keranjang kosong (jangan biarkan layar merah).
      console.log("Pengguna belum login, mengatur keranjang menjadi kosong.");
      return { total: 0, items: [] }; 
    }
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

  updateQuantity: async (itemId: string, quantity: number) => {
    return await api<any>(`/cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ qty: quantity }),
    });
  },
};