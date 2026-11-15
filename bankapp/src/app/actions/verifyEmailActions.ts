//email link redirects to verify-email page -> then clicking verify button -> go to this actions

"use server";

type VerifyResult = {
  ok: boolean;
  message: string;
};

export async function verifyEmailAction(token: string): Promise<VerifyResult> {
  if (!token) {
    return { ok: false, message: "This link is missing its token." };
  }

  try {
    // Assumed endpoint: adjust the path/body to match your Nest controller.
    // const res = await fetch(`${process.env.BACK_END_URL}/auth/verify-email`, {
    const res = await fetch(
      `${process.env.BACK_END_URL}/email-verification/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : "This link is invalid or has expired.";
      return { ok: false, message };
    }

    return { ok: true, message: "Your email address is verified." };
  } catch {
    return {
      ok: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}
