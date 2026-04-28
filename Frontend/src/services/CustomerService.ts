import { api } from "@/lib/api";
export const CustomerService = {
  getCustomers: async () => {
    return await api<any>("/customers", {
      method: "GET",
      cache: "no-store", 
    });
  },
};