"use server";

import { revalidateTag } from "next/cache";

export async function editFlaggedMessageStatus(
  messageId: number | undefined,
  data: boolean,
) {
  try {
    const response = await fetch(
      `${process.env.BACK_END_URL}/messages/${messageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flagged: data }),
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      const message = result?.message ?? "Failed to add new admin";
      return {
        success: false,
        error: Array.isArray(message) ? message : [message],
      };
    }

    revalidateTag("allUserMessages");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding new admin:", error);
    return { success: false, error: ["Backend unreachable"] };
  }
}
