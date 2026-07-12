import { cookies } from "next/headers";
//this work only in server side components

export const loadUserAllTransactions = async () => {
  const cookieStore = await cookies();

  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions/my`,
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
