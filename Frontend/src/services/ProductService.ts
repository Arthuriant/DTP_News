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
  },

  // === PRODUCT PARTS API ===
  getParts: async () => {
    const response = await api<any>("/product-parts", { method: "GET", cache: "no-store" });
    return response.data; 
  },
  createPart: async (payload: any) => {
    const response = await api<any>("/product-parts", {
      method: "POST",
      body: JSON.stringify(payload), // Kembali gunakan JSON
    });
    return response;
  },
  updatePart: async (id: string, payload: any) => {
    const response = await api<any>(`/product-parts/${id}`, {
      method: "PUT", // Gunakan PUT murni
      body: JSON.stringify(payload), // Kembali gunakan JSON
    });
    return response;
  },
  deletePart: async (id: string) => {
    const response = await api<any>(`/product-parts/${id}`, { method: "DELETE" });
    return response;
  },
  // === PART VARIANTS API ===
  // === PART VARIANTS API ===
  getPartVariants: async (partId: string) => {
    // KITA UBAH URL-NYA MENJADI QUERY PARAMETER
    const response = await api<any>(`/part-variants?part_id=${partId}`, { method: "GET", cache: "no-store" });
    return response.data;
  },
  createPartVariant: async (payload: any) => {
    const response = await api<any>("/part-variants", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },
  updatePartVariant: async (id: string, payload: any) => {
    const response = await api<any>(`/part-variants/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response;
  },
  deletePartVariant: async (id: string) => {
    const response = await api<any>(`/part-variants/${id}`, { method: "DELETE" });
    return response;
  },

  // === PART TEXTURES API ===
  getTextures: async (variantId: string) => {
    // Memanggil endpoint berdasarkan variant_id
    const response = await api<any>(`/part-textures?variant_id=${variantId}`, { method: "GET", cache: "no-store" });
    return response.data;
  },
  createTexture: async (formData: FormData) => {
    const response = await api<any>("/part-textures", {
      method: "POST", // Menggunakan FormData karena ada file gambar
      body: formData,
    });
    return response;
  },
  updateTexture: async (id: string, formData: FormData) => {
    formData.append('_method', 'PUT'); // Trik Method Spoofing Laravel untuk Upload File
    const response = await api<any>(`/part-textures/${id}`, {
      method: "POST", 
      body: formData,
    });
    return response;
  },
  deleteTexture: async (id: string) => {
    const response = await api<any>(`/part-textures/${id}`, { method: "DELETE" });
    return response;
  },

  // === PRODUCT GALLERIES API ===
  getGalleries: async (productId: string) => {
    // Sesuai dengan rute: GET /product-galleries/{productId}
    const response = await api<any>(`/product-galleries/${productId}`, { method: "GET", cache: "no-store" });
    // Pastikan kita mengembalikan array yang benar (kadang backend membungkus di dalam properti 'data')
    return response.data || response; 
  },
  uploadGalleries: async (formData: FormData) => {
    // Sesuai dengan rute: POST /product-galleries
    const response = await api<any>("/product-galleries", {
      method: "POST",
      body: formData, // Menggunakan FormData karena kita mengirim multiple files
    });
    return response;
  },
  deleteGallery: async (id: string) => {
    // Sesuai dengan rute: DELETE /product-galleries/{id}
    const response = await api<any>(`/product-galleries/${id}`, { method: "DELETE" });
    return response;
  },
  reorderGalleries: async (orders: { id: string; sort_order: number }[]) => {
    // Sesuai dengan rute: PUT /product-galleries/reorder
    const response = await api<any>("/product-galleries/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders }), // Mengirim array of objects
    });
    return response;
  },

  // === PRODUCT DIMENSIONS API ===
  getDimension: async (productId: string) => {
    try {
      const response = await api<any>(`/product-dimensions/${productId}`, { method: "GET", cache: "no-store" });
      return response;
    } catch (error: any) {
      // Jika error 404 (Belum ada data), kita kembalikan null agar form kosong, bukan error merah
      if (error.message && error.message.includes("belum diatur")) return null;
      throw error;
    }
  },
  saveDimension: async (productId: string, formData: FormData) => {
    // Menggunakan POST untuk Upsert sesuai Controller Anda
    const response = await api<any>(`/product-dimensions/${productId}`, {
      method: "POST",
      body: formData,
    });
    return response;
  },
  deleteDimension: async (productId: string) => {
    const response = await api<any>(`/product-dimensions/${productId}`, { method: "DELETE" });
    return response;
  },
  // === PRODUCT MARKETING BLOCKS API ===
  getMarketingBlocks: async (productId: string) => {
    const response = await api<any>(`/product-marketing-blocks/${productId}`, { method: "GET", cache: "no-store" });
    return response.data || response;
  },
  createMarketingBlock: async (formData: FormData) => {
    const response = await api<any>("/product-marketing-blocks", { method: "POST", body: formData });
    return response;
  },
  updateMarketingBlock: async (id: string, formData: FormData) => {
    formData.append('_method', 'PUT'); // Spoofer untuk upload gambar
    const response = await api<any>(`/product-marketing-blocks/${id}`, { method: "POST", body: formData });
    return response;
  },
  deleteMarketingBlock: async (id: string) => {
    const response = await api<any>(`/product-marketing-blocks/${id}`, { method: "DELETE" });
    return response;
  },

  // === PRODUCT MARKETING FEATURES API ===
  createMarketingFeature: async (payload: any) => {
    const response = await api<any>("/product-marketing-features", {
      method: "POST",
      body: JSON.stringify(payload), // JSON murni karena hanya teks
    });
    return response;
  },
  deleteMarketingFeature: async (id: string) => {
    const response = await api<any>(`/product-marketing-features/${id}`, { method: "DELETE" });
    return response;
  },
  // === PRODUCT SIZES API ===
  getProductSizes: async (productId: string) => {
    const response = await api<any>(`/product-sizes/${productId}`, { method: "GET", cache: "no-store" });
    return response.data || response;
  },
  createProductSize: async (formData: FormData) => {
    const response = await api<any>("/product-sizes", {
      method: "POST",
      body: formData, // Menggunakan FormData karena ada upload gambar
    });
    return response;
  },
  updateProductSize: async (id: string, formData: FormData) => {
    formData.append('_method', 'PUT'); // Trik Laravel untuk update dengan file
    const response = await api<any>(`/product-sizes/${id}`, {
      method: "POST",
      body: formData,
    });
    return response;
  },
  deleteProductSize: async (id: string) => {
    const response = await api<any>(`/product-sizes/${id}`, { method: "DELETE" });
    return response;
  }
};