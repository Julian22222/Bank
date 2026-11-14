"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function userLogOut() {
  console.log("Start Logout");

  const cookieStore = await cookies();

  console.log("Cookies", JSON.stringify(cookieStore));

  //if F-end and B-end on the same site / not BFF
  // const res = await fetch(`${process.env.BACK_END_URL}/auth/logout`, {
  //   method: "POST",
  //   headers: {
  //     Cookie: cookieStore.toString(),
  //     "Content-Type": "application/json",
  //   },
  // });

  // console.log("response", JSON.stringify(res));
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
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  cookieStore.set("access_token", "", opts);
  cookieStore.set("refresh_token", "", opts);

  redirect("/");
}
