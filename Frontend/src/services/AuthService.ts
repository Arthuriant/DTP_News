import { api } from "@/lib/api";

export const AuthService = {
  login: async (credentials: Record<string, string>) => {
    return await api<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getUser: async (silent: boolean = false) => {
    const headers: Record<string, string> = {};
    
    if (silent) {
      headers["X-Skip-Redirect"] = "true";
    }

    return await api<any>("/user", {
      method: "GET",
      cache: "no-store",
      skipRedirect: silent, 
    });
  },

  logout: async () => {
    return await fetch("/api-fe/auth/logout", {
      method: "POST", 
    });
  },

};