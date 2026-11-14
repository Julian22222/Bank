"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogOut() {
  const cookieStore = await cookies();

  //if F-end and B-end on the same site / not BFF
  // const res = await fetch(`${process.env.BACK_END_URL}/auth-admin/logout`, {
  //   method: "POST",
  //   headers: {
  //     Cookie: cookieStore.toString(),
  //     "Content-Type": "application/json",
  //   },
  // });

  // if (!res.ok) {
  //   const errorText = await res.text();
  //   console.error("API ERROR during logout:", errorText);
  //   return {
  //     success: false,
  //     error: errorText || "Logout failed",
  //   };
  // }

  // return {
  //   success: true,
  // };

  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    path: "/",
    maxAge: 0,
  };

  cookieStore.set("admin_access_token", "", opts);
  cookieStore.set("admin_refresh_token", "", opts);

  redirect("/");
}
