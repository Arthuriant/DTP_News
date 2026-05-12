import { api } from "@/lib/api";

export const ShippingService = {
  getDestinations: async (query: string) => {
    return await api<any>(`/shipping/destinations?search=${query}&limit=10`, {
      method: "GET",
      cache: "no-store",
    });
  },

  getCouriers: async () => {
    return await api<any>("/shipping/couriers", {
      method: "GET",
      cache: "no-store",
    });
  },

  calculateCost: async (payload: { origin: number; destination: number; weight: number; courier: string }) => {
    return await api<any>("/shipping/cost", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};