import { api } from "@/lib/api";

export const AuthService = {
  login: async (credentials: Record<string, string>) => {
    return await api<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getUser: async () => {
    return await api<any>("/user", {
      method: "GET",
    });
  },

  logout: async () => {
    return await fetch("/api/auth/logout", {
      method: "POST", 
    });
  },

};