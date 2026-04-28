import { api } from "@/lib/api";

export const RoleService = {
  getRoles: async () => {
    return await api<any>("/roles", {
      method: "GET",
      cache: "no-store",
    });
  },

  createRole: async (data: any) => {
    return await api<any>("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateRole: async (id: number | string, data: any) => {
    return await api<any>(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteRole: async (id: number | string) => {
    return await api<any>(`/roles/${id}`, {
      method: "DELETE",
    });
  },
};