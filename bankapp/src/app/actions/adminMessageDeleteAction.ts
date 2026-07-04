"use server";

import { revalidateTag } from "next/cache";

export async function handleAdminMessageDeletion(message_id: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/messages/${message_id}`,
      {
        method: "DELETE",
      },
    );

    let result;

    try {
      result = await res.json();
    } catch {
      result = null;
    }

    if (!res.ok) {
      return {
        success: false,
        error: result.message || "Failed to delete message",
      };
    }

    revalidateTag("userMessages");
    revalidateTag("allUsersMessages");

    console.log("result", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error deleting message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
