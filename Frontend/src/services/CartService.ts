// src/services/CartService.ts
import { api } from "@/lib/api";

export const CartService = {
  getCart: async () => {
    return await api<any>("/cart", {
      method: "GET",
    });
  },
};