import { api } from "@/lib/api";

export const AddressService = {
  createAddress: async (payload: any) => {
    return await api<any>("/addresses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateAddress: async (id: number | string, payload: any) => {
    return await api<any>(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  getAddresses: async () => {
    return await api<any>("/addresses", {
      method: "GET",
      cache: "no-store", 
    });
  },

  deleteAddress: async (id: number) => {
    return await api<any>(`/addresses/${id}`, {
      method: "DELETE",
    });
  },

  setPrimaryAddress: async (id: number) => {
    return await api<any>(`/addresses/${id}/set-primary`, {
      method: "PATCH",
    });
  },

};