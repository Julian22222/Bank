//can send cookies from server component - without route handling, but only in server components

import { cookies } from "next/headers";

export const loadUserServer = async () => {
  const cookieStore = await cookies();

  const meRes = await fetch(`${process.env.BACK_END_URL}/users/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!meRes.ok) {
    return null; // better for redirects
  }

  return meRes.json();
};
