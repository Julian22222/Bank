import { cookies } from "next/headers";
//this work only in server side components

export const loadAdminServer = async () => {
  const cookieStore = await cookies();

  const meRes = await fetch(`${process.env.BACK_END_URL}/admin/me`, {
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
