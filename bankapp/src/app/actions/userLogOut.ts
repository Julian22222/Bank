"use server";

import { cookies } from "next/headers";

export async function userLogOut() {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API ERROR during logout:", errorText);
      return {
        success: false,
        error: errorText || "Logout failed",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error during logout:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
