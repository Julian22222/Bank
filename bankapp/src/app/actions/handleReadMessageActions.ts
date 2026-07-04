"use server";

import { revalidateTag } from "next/cache";

export async function handleReadMessage(messageId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/messages/${messageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_read: true }),
      },
    );

    const updatedMessage = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: updatedMessage.message || "Failed to update message",
      };
    }

    revalidateTag("allUserMessages");

    return { success: true, data: updatedMessage };
  } catch (error) {
    console.error("Error marking message as read");
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
