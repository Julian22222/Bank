// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const { userResponse, accessToken, refreshToken } = data;

  const res = NextResponse.json({ userResponse });

  //🍪 STORE BOTH IN HTTPONLY COOKIES
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true, // true in production (HTTPS)
    sameSite: "none", //in production-  sameSite:"none", or 'lax' if you want to allow cross-site requests,
    maxAge: 15 * 60, //expire in 15min
  });
  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60, //expire in 7 days
  });

  return res;
}

//set cookies in Next.js can be implemented only in Route Handler or Middleware
//The cookie has to be set by a server response header, which means it must go through a Next.js Route Handler.
//NextResponse.cookies.set(...) only works inside a Route Handler (a route.ts file) or Middleware — server-side execution contexts.
