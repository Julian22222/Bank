//Next.js middleware handle refresh transparently before the page even renders — middleware can set cookies on the outgoing response.
// This is the more robust, idiomatic pattern for Next.js: check token expiry in middleware.ts, refresh there, and forward the Set-Cookie on the middleware's response before the page ever calls apiServerFetch.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

async function userMiddleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Access token missing/expired but refresh token exists — refresh now
  const needsRefresh = (!accessToken || isExpired(accessToken)) && refreshToken;
  console.log("DEBUG middleware:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    needsRefresh,
  });

  if (needsRefresh) {
    const refreshRes = await fetch(`${process.env.BACK_END_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });

    if (refreshRes.ok) {
      const { accessToken: newAccessToken } = await refreshRes.json();

      const res = NextResponse.next();
      res.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60,
      });

      return res;
    }
  }

  if (!accessToken && !refreshToken) {
    // const res = NextResponse.next();
    //       res.cookies.set("access_token", "", {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

    //     }

    // refresh token itself is dead — no point letting the request through
    const response = NextResponse.redirect(new URL("/login", req.url));
    // refresh failed (refresh token also expired/invalid) — let it through,
    // downstream will 401 and you can redirect to /login
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }

  return NextResponse.next();
}

async function adminMiddleware(req: NextRequest) {
  const accessToken = req.cookies.get("admin_access_token")?.value;
  const refreshToken = req.cookies.get("admin_refresh_token")?.value;

  // Access token missing/expired but refresh token exists — refresh now
  const needsRefresh = (!accessToken || isExpired(accessToken)) && refreshToken;
  console.log("DEBUG middleware:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    needsRefresh,
  });

  if (needsRefresh) {
    const refreshRes = await fetch(
      `${process.env.BACK_END_URL}/auth-admin/refresh`,
      {
        method: "POST",
        headers: { Cookie: `admin_refresh_token=${refreshToken}` },
      },
    );

    if (refreshRes.ok) {
      const { accessToken: newAccessToken } = await refreshRes.json();

      const res = NextResponse.next();
      res.cookies.set("admin_access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60,
      });

      return res;
    }
  }

  if (!accessToken && !refreshToken) {
    const response = NextResponse.redirect(new URL("/admin-login", req.url));
    response.cookies.delete("admin_access_token");
    response.cookies.delete("admin_refresh_token");

    //Without "return response", the function returns undefined and not redirect to /admin-login.
    // The middleware will continue to the next middleware or route handler, which may result in a 401 Unauthorized response if the access token is missing or invalid.
    return response;
  }
  return NextResponse.next();
}

function logRequest(req: NextRequest) {
  console.log(`Request logger: [${req.method}] ${req.nextUrl.pathname}`);
}

// Check if a JWT access token is expired
function isExpired(token: string): boolean {
  try {
    //it just reads the claims that are already sitting in the token
    // checks whether a JWT has expired, without needing to verify its signature or call the backend.
    const { exp } = jwtDecode<{ exp: number }>(token); //takes a JWT string and decodes its payload
    //exp- destructuring the exp claim from the decoded payload, which represents the expiration time of the token in seconds since the Unix epoch.
    //If the current time is greater than or equal to the expiry time, the token has expired (or is expiring this exact millisecond) → returns true.
    return Date.now() >= exp * 1000;
  } catch {
    return true; // treat unparseable token as expired
  }
}

export async function middleware(req: NextRequest) {
  logRequest(req); //to check that middleware is running for the correct routes
  // you should be able to see each request logged in the console

  const { pathname } = req.nextUrl;

  //user routes logic to refresh user access token if expired/ redirect to login if both access and refresh tokens are missing
  if (
    pathname.startsWith("/accounts") ||
    pathname.startsWith("/charts") ||
    pathname.startsWith("/contacts") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/user-page")
  ) {
    return userMiddleware(req);
  }

  //admin routes logic to refresh admin access token if expired/ redirect to login if both access and refresh tokens are missing
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-users") ||
    pathname.startsWith("/registration")
  ) {
    return adminMiddleware(req);
  }

  return NextResponse.next();
}

//Make sure config.matcher actually covers every route that renders a Server Component needing auth
export const config = {
  matcher: [
    "/accounts/:path*",
    "/charts/:path*",
    "/contacts/:path*",
    "/messages/:path*",
    "/transactions/:path*",
    "/user-page/",
    "/user-page/:path*",
    "/admin/:path*",
    "/admin-users/:path*",
    "/registration/:path*",
    "/manage-admins/:path*",
  ], // only run where auth matters
  // If the route matches, this middleware will run
  // If you dont use a matcher, it runs for every request.
};

//Note: cookies().set() only works inside Server Actions, Route Handlers or middleware — not in arbitrary Server Components
//set cookies in Next.js can be implemented only in Server Actions, Route Handler or Middleware
//✅ Client component -> Route Handler -> Set cookies in the browser (httpOnly cookies) -> Client component can read and set the cookies to/from the browser
//❌ Server component -> Route Handler -> Set cookies in the browser. Server component can't set the cookies to the browser.Server component can ONLY read the cookies from the browser
// Therefore we use middleware to set the cookies in the browser, and then the server component can read the cookies from the browser
//The cookie has to be set by a server response header, which means it must go through a Next.js Route Handler.
//NextResponse.cookies.set(...) only works inside a Route Handler (a route.ts file) or Middleware — server-side execution contexts.
//If it you dont set the new cookies in the middleware or route handler, it will take old access token from the browser cookie and will keep failing with 401 Unauthorized error.
