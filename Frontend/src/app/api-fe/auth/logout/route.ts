// app/api-fe/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Hapus cookie session_token
  cookieStore.delete("session_token");

  return NextResponse.json({ message: "Berhasil logout" }, { status: 200 });
}