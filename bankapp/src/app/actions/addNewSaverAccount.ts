"use server";

import { revalidateTag } from "next/cache";
import { ISaverAccountType } from "../../../../shared/types/saverAccountType.interface";

export async function addNewSaverAccount(
  newSaverAccountTypeData: ISaverAccountType,
) {
  const { account_name, interest, money_limit, account_duration } =
    newSaverAccountTypeData;

  try {
    const result = await fetch(
      `${process.env.BACK_END_URL}/accounts/saver-account/types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_name,
          interest,
          money_limit,
          account_duration,
        }),
      },
    );

    const newSaverAccount = await result.json();

    if (!result.ok) {
      return {
        success: false,
        error: newSaverAccount.message,
      };
    }

    revalidateTag(`accountTypes`);

    return {
      success: true,
      data: newSaverAccount,
    };
  } catch (error) {
    console.error("Error adding new transaction from Admin:", error);

    return {
      success: false,
      error:
        error instanceof Error ? [error.message] : ["Unknown error occurred"],
    };
  }
}
