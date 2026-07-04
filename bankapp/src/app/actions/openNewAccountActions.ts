"use server";

import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
require("dotenv").config();

interface Props {
  accountType: string;
  customer_id: number | undefined;
}

export async function openNewAccountAction({
  accountType,
  customer_id,
}: Props) {
  const generating6Digits = randomInt(100000, 1000000).toString();
  const gen8Digits = randomInt(10000000, 100000000).toString();

  let newAccountNr =
    generating6Digits.slice(0, 2) +
    "-" +
    generating6Digits.slice(2, 4) +
    "-" +
    generating6Digits.slice(4) +
    " / " +
    gen8Digits;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/saving`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customer_id,
          account_type: accountType,
          account_nr: newAccountNr,
        }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result.message || "Failed to open new account",
      };
      // throw new Error("Failed to open new account");
    }

    revalidatePath("/accounts"); // Revalidate the accounts page to reflect the new account
    //revalidateTag("user-accounts");

    console.log("New account opened successfully:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error opening new account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
