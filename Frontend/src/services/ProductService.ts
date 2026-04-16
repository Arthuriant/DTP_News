// src/services/ProductService.ts
import { api } from "@/lib/api";

export const ProductService = {
  getProducts: async () => {
    const response = await api<any>("/products", {
      method: "GET",
      cache: "no-store",
    });
    return response.data; // Kita hanya mengambil array di dalam 'data'
  },
};