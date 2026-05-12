import { api } from "@/lib/api";

export const WishlistService = {
  getWishlists: async () => {
    const response = await api<any>("/wishlist", {
      method: "GET",
      cache: "no-store",
    });
    return response.data || response;
  },
  
  checkWishlist: async (productId: string) => {
    return await api<any>(`/wishlist/check/${productId}`, {
      method: "GET",
      cache: "no-store",
    });
  },

  addToWishlist: async (payload: { product_id: string }) => {
    return await api<any>("/wishlist", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  removeFromWishlist: async (productId: string) => {
    return await api<any>(`/wishlist/${productId}`, {
      method: "DELETE",
    });
  },
};