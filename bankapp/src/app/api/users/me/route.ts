//route.ts (is server side)
//you can only set (and reliably read) httpOnly cookies from server-side code.

// src/app/api/users/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  //read accessToken/cookie from F-end Browser
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/users/me`, {
    headers: { Cookie: `access_token=${accessToken}` }, // manually written, explicit
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
