// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // const cookieStore = await cookies();
  // const refreshToken = cookieStore.get("refresh_token")?.value;

  const refreshToken = req.cookies.get("admin_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const backendRes = await fetch(
    `${process.env.BACK_END_URL}/auth-admin/refresh`,
    {
      method: "POST",
      headers: {
        Cookie: `admin_refresh_token=${refreshToken}`,
      },
      cache: "no-store",
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    const response = NextResponse.json(data, { status: backendRes.status });

    // response.cookies.delete("access_token");
    // response.cookies.delete("refresh_token");

    response.cookies.set("admin_access_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(0),
    });

    // response.cookies.set("refresh_token", "", {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/",
    //   expires: new Date(0),
    // });

    //if refresh and access token are expired  redirect to /login

    return response;
  }

  const response = NextResponse.json({
    message: "token refreshed",
  });

  // const setCookie = backendRes.headers.get("set-cookie");

  // response.cookies.set("access_token", data.accessToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   path: "/",
  //   maxAge: 15 * 60,
  // });

  response.cookies.set("admin_access_token", data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 60,
  });

  // Only do this if Nest returns a new refresh token
  if (data.refreshToken) {
    response.cookies.set("admin_refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}
