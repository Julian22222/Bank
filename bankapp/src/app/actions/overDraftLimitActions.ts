"use server";

import { revalidateTag } from "next/cache";
require("dotenv").config();

export async function overDraftLimitActions(amount: string, accountId: string) {
  const overdraft = Number(amount);

  if (isNaN(overdraft) || overdraft < 0) {
    return {
      success: false,
      error: "Invalid overdraft limit",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/${accountId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ overdraft_limit: overdraft }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result.message || "Failed to change overdraft limit",
      };
    }

    revalidateTag("userAccountsWithBalanceAdminPage");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error changing overdraft limit:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
