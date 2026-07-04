import { cookies } from "next/headers";
//this work only in server side components

export const loadUserAllAccounts = async () => {
  const cookieStore = await cookies();

  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/my-accounts-balance`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (!meRes.ok) {
    return null; // better for redirects
  }

  return meRes.json();
};
