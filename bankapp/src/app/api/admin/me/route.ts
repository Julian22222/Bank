//route.ts (is server side)
//you can only set (and reliably read) httpOnly cookies from server-side code.

// src/app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  //read accessToken/cookie from F-end Browser
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${process.env.BACK_END_URL}/admin/me`, {
      headers: {
        Cookie: `admin_access_token=${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("admin/me proxy failed:", err);
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }
}
