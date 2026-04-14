// app/api-fe/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    // 1. Tembak endpoint login di Laravel
    const backendResponse = await fetch(`${LARAVEL_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Jika password salah / validasi gagal, lempar error kembali ke frontend
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // 2. Jika sukses, ambil token dari response Laravel
    // Sesuaikan "data.token" dengan format response API Laravel kamu!
    const token = data.token; 

    if (token) {
      const cookieStore = await cookies();
      
      // 3. Simpan token ke dalam Brankas Cookie (Aman dari XSS)
      cookieStore.set("session_token", token, {
        httpOnly: true, // Javascript browser tidak bisa mencuri ini
        secure: process.env.NODE_ENV === "production", // Wajib HTTPS jika di production
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // Berlaku 7 hari
      });
    }

    // 4. Kembalikan data user ke Frontend (Token tidak dikembalikan demi keamanan)
    return NextResponse.json({ user: data.user, message: "Login berhasil" }, { status: 200 });

  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}