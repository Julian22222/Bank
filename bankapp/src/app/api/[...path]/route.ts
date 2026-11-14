// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
//this Route Handler file handles different paths in one file.

//Route Handlers for Login and Refresh keep as separate files. Don't use [...path] for them. Because they have different requirements for cookies and headers.
//Login and refresh stay as dedicated routes (api/auth/login/route.ts, api/auth/refresh/route.ts) because they set cookies rather than just forwarding them.
// The server fetch function can read httpOnly cookies, while the client fetch function cannot.
// The client fetch function needs to use Route Handling to set cookies in the browser, while the server fetch function can directly read cookies from the request.

//Keep the allowlist. Without it, anyone could make your server call any backend path with their token attached.
// encodeURIComponent on each segment also stops .. path tricks.
// only these backend prefixes are reachable through the proxy
const ALLOWED = ["users", "accounts", "transactions", "admin", "admins"];

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }, // Next.js 15: params is a Promise
) {
  const backend = process.env.BACK_END_URL;
  if (!backend) {
    return NextResponse.json(
      { message: "Server misconfigured" },
      { status: 500 },
    );
  }

  const { path } = await params;

  if (!ALLOWED.includes(path[0])) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // admin and customer sessions use different cookie names
  const cookieName = ["admin", "admins"].includes(path[0])
    ? "admin_access_token"
    : "access_token";
  const token = req.cookies.get(cookieName)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = `${backend}/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(req.method);

  try {
    const res = await fetch(url, {
      method: req.method,
      headers: {
        Cookie: `access_token=${token}`, // the name your backend strategy reads
        ...(hasBody && {
          "Content-Type": req.headers.get("content-type") ?? "application/json",
        }),
      },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });

    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (err) {
    console.error("proxy failed:", url, err);
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
