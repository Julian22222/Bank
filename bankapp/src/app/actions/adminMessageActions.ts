"use server";

import { revalidateTag } from "next/cache";

export async function handleAdminMessage(formData: FormData) {
  const userID = formData.get("customerId");
  const messageSubject = formData.get("messageSubject");
  const messageStatus = formData.get("messageStatus");
  const messageBody = formData.get("messageBody");
  const msgCreatedBy = formData.get("msgCreatedBy");

  console.log("userID", userID);
  console.log("messageSubject", messageSubject);
  console.log("messageStatus", messageStatus);
  console.log("messageBody", messageBody);
  console.log("msgCreatedBy", msgCreatedBy);

  if (
    !userID ||
    !messageSubject ||
    !messageStatus ||
    !messageBody ||
    !msgCreatedBy
  ) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: Number(userID),
          msg_subject: messageSubject,
          msg_status: messageStatus,
          msg_body: messageBody,
          msg_created_by: msgCreatedBy,
        }),
      },
    );

    const newMessage = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: newMessage?.message || "Failed to create message",
      };
    }

    revalidateTag("userMessages");

    return {
      success: true,
      data: newMessage,
    };
  } catch (error) {
    console.error("Error adding message:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
