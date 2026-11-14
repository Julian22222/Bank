// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch(`${process.env.BACK_END_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  //   const nextResponse = Response.json({
  //   user: data.user,
  // });

  // nextResponse.cookies.set("access_token", data.accessToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "lax",
  // });

  // nextResponse.cookies.set("refresh_token", data.refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "lax",
  // });

  // return nextResponse;

  const { userResponse, accessToken, refreshToken } = data;

  const res = NextResponse.json({ userResponse });

  //🍪 STORE BOTH IN HTTPONLY COOKIES
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true, // true in production (HTTPS)
    sameSite: "none", //in production-  sameSite:"none", or 'lax' if you want to allow cross-site requests,
    // sameSite: "lax" - is used when F-End and B-End has the same domain
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

//Note: cookies().set() only works inside Server Actions or Route Handlers or middleware — not in arbitrary Server Components
//set cookies in Next.js can be implemented only in Route Handler or Middleware
//✅ Client component -> Route Handler -> Set cookies in the browser (httpOnly cookies) -> Client component can read and set the cookies to/from the browser
//❌ Server component -> Route Handler -> Set cookies in the browser. Server component can't set the cookies to the browser.Server component can ONLY read the cookies from the browser
// Therefore we use middleware to set the cookies in the browser, and then the server component can read the cookies from the browser
//The cookie has to be set by a server response header, which means it must go through a Next.js Route Handler.
//NextResponse.cookies.set(...) only works inside a Route Handler (a route.ts file) or Middleware — server-side execution contexts.
//If it you dont set the new cookies in the middleware or route handler, it will take old access token from the browser cookie and will keep failing with 401 Unauthorized error.
