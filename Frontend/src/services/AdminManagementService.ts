import { api } from "@/lib/api";

export const AdminManagementService = {
  getAdmins: async () => {
    return await api<any>("/admins", {
      method: "GET",
      cache: "no-store",
    });
  },

  createAdmin: async (data: any) => {
    return await api<any>("/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateAdmin: async (id: number | string, data: any) => {
    return await api<any>(`/admins/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteAdmin: async (id: number | string) => {
    return await api<any>(`/admins/${id}`, {
      method: "DELETE",
    });
  },

  // --- Data Role ---
  getRoles: async () => {
    return await api<any>("/roles", {
      method: "GET",
      cache: "no-store",
    });
  },
};