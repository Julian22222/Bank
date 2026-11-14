// src/app/api/auth-admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  const opts = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  res.cookies.set("admin_access_token", "", opts);
  res.cookies.set("admin_refresh_token", "", opts);

  return res;
}
