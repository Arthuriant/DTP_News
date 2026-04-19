// app/api-fe/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type Context = {
  params: Promise<{ path: string[] }>;
};

async function handleProxy(request: NextRequest, context: Context) {
  const { path: pathArray } = await context.params;
  const path = pathArray.join("/");
  const searchParams = request.nextUrl.search;
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  console.log("Token yang dikirim ke Laravel:", token ? "ADA" : "KOSONG!");
  console.log("Menembak ke:", `${LARAVEL_API_URL}/${path}${searchParams}`);


  const publicPaths = [
    "login", 
    "register", 
    "products", 
    "categories",
    "password"
  ];
  const isPublicPath = publicPaths.some((publicPath) => path.includes(publicPath));

  if (!token && !isPublicPath) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  // 3. Siapkan Headers ke Laravel
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  const contentType = request.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);

  let body = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.blob();
  }

  try {
    // 4. Tembak ke API Laravel
    const backendResponse = await fetch(`${LARAVEL_API_URL}/${path}${searchParams}`, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store",
    });

    const responseData = await backendResponse.arrayBuffer();

    return new NextResponse(responseData, {
      status: backendResponse.status,
      headers: {
        "Content-Type": backendResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error(`Proxy Error to ${LARAVEL_API_URL}:`, error);
    return NextResponse.json({ message: "Internal Server Error / Backend Down" }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;