// src/lib/api.ts
export interface CustomRequestInit extends RequestInit {
  skipRedirect?: boolean;
}

export const api = async <T>(
  endpoint: string,
  options: CustomRequestInit = {},
): Promise<T> => {
  const { skipRedirect = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // --- LOGIKA PENENTUAN URL PROXY ---
  let finalUrl = "";

  if (endpoint.startsWith("/api-fe/auth")) {
    finalUrl = endpoint;
  } else if (endpoint.startsWith("/api/auth")) {
    finalUrl = endpoint.replace("/api/auth", "/api-fe/auth");
  } else {
    // Arahkan ke route handler Next.js (Proxy) agar Bearer Token diurus di server-side
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    finalUrl = `/api-fe/proxy/${cleanEndpoint}`;
  }

  const response = await fetch(finalUrl, {
    ...fetchOptions,
    headers,
  });

  // --- ERROR HANDLING (Unauthenticated / Session Expired) ---
  if (response.status === 401) {
    const isLoginRequest = endpoint.includes("login");

    if (isLoginRequest) {
      // Jika login gagal, lemparkan error agar ditangkap oleh form login
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Email atau Password salah");
    }

    // Jika BUKAN request login (token habis/tidak valid) -> Force Logout
    if (typeof window !== "undefined" && !skipRedirect) {
        try {
          await fetch("/api-fe/auth/logout", { method: "POST" });
        } catch (e) {
          console.error("Gagal menghapus sesi server", e);
        }

        localStorage.removeItem("user");
        localStorage.removeItem("privileges");

        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }
      
      throw new Error("Unauthorized: Session expired");
    }

  // --- ERROR HANDLING UMUM (Laravel Validation dsb.) ---
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = `API Error: ${response.statusText}`;

    if (errorData.errors) {
      const firstField = Object.keys(errorData.errors)[0];
      if (firstField && Array.isArray(errorData.errors[firstField])) {
        errorMessage = errorData.errors[firstField][0];
      }
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (Object.keys(errorData).length > 0) {
      // TANGKAP FORMAT RAW ERROR LARAVEL: {"name": ["The name field is required."]}
      const firstField = Object.keys(errorData)[0];
      if (Array.isArray(errorData[firstField])) {
        errorMessage = errorData[firstField][0];
      }
    }

    const error = new Error(errorMessage);
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
};

export const apiBlob = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Blob> => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const skipRedirect = headers["X-Skip-Redirect"] === "true";
  delete headers["X-Skip-Redirect"];

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let finalUrl = "";

  if (endpoint.startsWith("/api-fe/auth")) {
    finalUrl = endpoint;
  } else {
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    finalUrl = `/api-fe/proxy/${cleanEndpoint}`;
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
      const isLoginRequest = endpoint.includes("login");

      if (isLoginRequest) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Email atau Password salah");
      }

      if (typeof window !== "undefined" && !skipRedirect) {
        try {
          await fetch("/api-fe/auth/logout", { method: "POST" });
        } catch (e) {
          console.error("Gagal menghapus sesi server", e);
        }

        localStorage.removeItem("user");
        localStorage.removeItem("privileges");

        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }
      
      throw new Error("Unauthorized: Session expired");
    }

  if (!response.ok) {
    let errorMessage = `Download Failed: ${response.statusText}`;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else {
        const text = await response.text();
        if (text) {
          errorMessage = text.substring(0, 200);
        }
      }
    } catch (e) {
      // Gunakan status text bawaan jika JSON parsing gagal
    }

    throw new Error(errorMessage);
  }

  return response.blob();
};