"use server";

import { cookies } from "next/headers";

export async function sendVerificationEmailActions(): Promise<{
  ok: boolean;
  message: string;
}> {
  const accessToken = (await cookies()).get("access_token")?.value; // adjust to your auth setup

  console.log("sendVerificationEmailActions", accessToken);

  if (!accessToken) return { ok: false, message: "Please sign in again." };

  try {
    const res = await fetch(
      `${process.env.BACK_END_URL}/auth/send-verification`,
      {
        method: "POST",
        headers: { Cookie: `access_token=${accessToken}` },
        cache: "no-store",
      },
    );

    if (res.status === 429)
      return { ok: false, message: "Too many requests. Try again shortly." };

    if (!res.ok)
      return { ok: false, message: "Could not send email. Please try again." };

    return { ok: true, message: "Verification email sent. Check your inbox." };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
