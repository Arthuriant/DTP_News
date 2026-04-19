// src/services/ProfileService.ts
import { api } from "@/lib/api";

export const ProfileService = {
  getProfile: async () => {
    return await api<any>("/profile", {
      method: "GET",
      cache: "no-store", 
    });
  },

  updateProfile: async (data: any) => {
    return await api<any>("/profile", {
      method: "PUT",
      body: JSON.stringify(data), 
    });
  },

};