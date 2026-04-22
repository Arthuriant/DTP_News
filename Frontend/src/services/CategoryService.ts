import { api } from "@/lib/api"; // Pastikan import helper API Anda sesuai dengan struktur project

export const CategoryService = {
  
  // ==========================================
  // 1. KATEGORI UTAMA (Main Categories)
  // ==========================================

  // GET: Mengambil semua kategori beserta relasi sub_categories
  getAll: async () => {
    const response = await api<any>("/categories", { 
      method: "GET", 
      cache: "no-store" 
    });
    // Menyesuaikan jika backend membungkus response dalam object 'data' atau langsung array
    return response.data || response;
  },

  // POST: Membuat kategori baru
  createCategory: async (payload: { name: string; description?: string }) => {
    const response = await api<any>("/categories", {
      method: "POST",
      body: JSON.stringify(payload), // Mengirim JSON murni karena tidak ada upload gambar
    });
    return response;
  },

  // PUT: Mengubah kategori (nama/deskripsi)
  updateCategory: async (id: string, payload: { name: string; description?: string }) => {
    const response = await api<any>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response;
  },

  // DELETE: Menghapus kategori (Sub-kategori otomatis terhapus berkat cascade DB)
  deleteCategory: async (id: string) => {
    const response = await api<any>(`/categories/${id}`, { 
      method: "DELETE" 
    });
    return response;
  },


  // ==========================================
  // 2. SUB-KATEGORI (Sub Categories)
  // ==========================================

  // POST: Membuat sub-kategori baru di dalam kategori tertentu
  createSubCategory: async (payload: { categories_id: string; name: string; description?: string }) => {
    const response = await api<any>("/sub-categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },

  // PUT: Mengubah data sub-kategori
  updateSubCategory: async (id: string, payload: { name: string; description?: string }) => {
    const response = await api<any>(`/sub-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response;
  },

  // DELETE: Menghapus satu sub-kategori spesifik
  deleteSubCategory: async (id: string) => {
    const response = await api<any>(`/sub-categories/${id}`, { 
      method: "DELETE" 
    });
    return response;
  }
};