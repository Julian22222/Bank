"use server";

import { editUser } from "@/src/shared/types/editUser.type";
import { revalidateTag } from "next/cache";

export async function editUserAction(
  userId: number | undefined,
  updatedUser: editUser,
) {
  if (!userId) {
    console.error("User ID is required to edit user details.");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      },
    );

    let result;

    try {
      result = await res.json();
    } catch {
      result = null;
    }

    if (!res.ok) {
      return { success: false, error: result.message || "Failed to edit user" };
      // throw new Error("Failed to update user details");
    }

    // console.log("User details updated successfully:", result);

    revalidateTag("userData-Page");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating user details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
