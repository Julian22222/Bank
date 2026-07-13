"use server";

import { cookies } from "next/headers";
require("dotenv").config();

export async function editUserPasswordActions(
  customerId: number | undefined,
  oldPassword: string,
  newPassword: string,
) {
  const cookieStore = await cookies();

  try {
    const res = await fetch(
      //`${process.env.NEXT_PUBLIC_BACK_END_URL}/users/${customerId}/password`,
      // use customerId from JWT in Nest.js
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/password`,
      {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      },
    );

    console.log("Response from password update API:", res);

    const result = await res.json();

    if (!res.ok) {
      // throw new Error("Failed to update user password");
      throw new Error(result.message || "Password update failed");
    }

    console.log("User password updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
}
