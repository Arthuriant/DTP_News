// src/services/ProductService.ts
import { api } from "@/lib/api";

export const ProductService = {
  // 1. Mengambil semua data
  getProducts: async () => {
    const response = await api<any>("/products", {
      method: "GET",
      cache: "no-store",
    });
    // Menyesuaikan dengan JSON backend Anda yang mengembalikan format { success: true, data: [...] }
    return response.data; 
  },

  // 2. Membuat produk baru (Penting: menggunakan FormData karena ada gambar)
  createProduct: async (formData: FormData) => {
    const response = await api<any>("/products", {
      method: "POST",
      body: formData, // Jangan set Content-Type, biar browser yang atur untuk FormData
    });
    return response;
  },

  // 3. Mengupdate produk (Menggunakan Method Spoofing POST -> PUT)
  updateProduct: async (id: string, formData: FormData) => {
    formData.append('_method', 'PUT'); // Trik ajaib Laravel
    const response = await api<any>(`/products/${id}`, {
      method: "POST",
      body: formData,
    });
    return response;
  },

  // 4. Menghapus produk
  deleteProduct: async (id: string) => {
    const response = await api<any>(`/products/${id}`, {
      method: "DELETE",
    });
    return response;
  }
};