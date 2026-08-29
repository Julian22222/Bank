"use server";

import { cookies } from "next/headers";

export async function userLogOut() {
  console.log("Start Logout");

  try {
    const cookieStore = await cookies();

    console.log("Cpookies", JSON.stringify(cookieStore));

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

    console.log("response", JSON.stringify(res));

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
