// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  const opts = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "lax" as const,
    // sameSite: "none",
    path: "/",
    maxAge: 0,
  };

  res.cookies.set("access_token", "", opts);
  res.cookies.set("refresh_token", "", opts);

  return res;
}

// That Nest endpoint can’t clear the browser’s cookies in your setup. The cookies are set by the Next.js login route handler, and the browser only ever talks to Next.js. Nest’s res.clearCookie(...) sends a Set-Cookie header back to the Next.js server (in the fetch inside your route handler), and Next.js discards it unless you forward it. So the browser keeps the old cookies, which is why you still see the previous admin.
// Nest’s login also returns the tokens in the JSON body rather than setting cookies, so the logout endpoint is mostly redundant. The cookie lifecycle should live entirely in Next.js.

//Call it from your logout button:
//await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

//Keep the sameSite: "lax" and path: "/" settings in the login handler. They must match the logout handler’s attributes.
//With the BFF pattern, the Nest logout controller can’t clear those cookies, because the cookies belong to the Next.js origin and Nest never set them.

// Why it doesn’t work:
// in Nest.js controller - res.clearCookie(...) doesn’t delete anything directly. It adds a Set-Cookie header (with an expiry in the past) to Nest’s HTTP response. The browser only acts on that header if the response reaches the browser.
// In your flow, the browser calls Next.js, and Next.js calls Nest with server-side fetch. So Nest’s response goes to the Next.js server, not the browser. The Set-Cookie header is received by your route handler and then discarded, because NextResponse.json(data) doesn’t forward it. The browser never sees it.
// Even if you did forward it, the cookie also has to match on name, domain and path. Nest’s clearCookie would use Nest’s defaults, which may not match the attributes you set in Next.js.

// Rule of thumb for BFF:
// Whoever sets the cookie must clear it, and the cookie is set by the Next.js server, so Next.js owns the whole cookie lifecycle: set on login, refresh on /refresh, clear on logout. Nest only deals with tokens in request headers and JSON bodies.
// The path and other attributes in the clearing call should match what you used when setting the cookie, so keep the login and logout handlers in sync.
