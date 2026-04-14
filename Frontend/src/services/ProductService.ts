import { api } from "@/lib/api";

export const ProductService = {

  getAllProducts: async () => {
    return await api<any>("/products", {
      method: "GET",
    });
  },

  getProductDetail: async (id: string) => {
    return await api<any>(`/products/${id}`, {
      method: "GET",
    });
  }
};