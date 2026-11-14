////Separate the client and server fetch functions, because the the have different requirements for cookies and headers. The server fetch function can read httpOnly cookies, while the client fetch function cannot. The client fetch function needs to use Route Handling to set cookies in the browser, while the server fetch function can directly read cookies from the request.
// if fetch() is running on the server
import { cookies } from "next/headers";

export async function adminApiServerFetch(
  url: string,
  options: RequestInit = {},
) {
  const cookieStore = await cookies();
  const adminAccessToken = cookieStore.get("admin_access_token")?.value;
  // const refreshToken = cookieStore.get("admin_refresh_token")?.value;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      //JwtAuthGuard requires a JWT, If your JWT is stored in a cookie, then req.user. Needs this code
      Cookie: `admin_access_token=${adminAccessToken}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}
