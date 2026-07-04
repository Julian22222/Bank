"use server";

import { revalidateTag } from "next/cache";

export async function handleAddNewTransactioninAdmin(data: {
  customerId: number;
  actionType: "ADD" | "DEDUCT";
  amount: string;
  details: string;
  accountId: string;
}) {
  let amount = Number(data.amount);

  if (data.actionType === "DEDUCT") {
    amount = -amount;
  }

  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions/${data.customerId}/accounts/${data.accountId}`,
    );

    if (!result.ok) {
      const errorText = await result.text();
      //   console.error("API ERROR:", errorText);
      return {
        success: false,
        error: errorText,
      };
    }

    const neededAccountData = await result.json();
    const lastBalanceFromDb = neededAccountData[0].balance;
    let balance;

    if (data.actionType === "ADD") {
      balance = (Number(lastBalanceFromDb) + Number(data.amount)).toFixed(2);
    } else {
      balance = (Number(lastBalanceFromDb) - Number(data.amount)).toFixed(2);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: Number(data.accountId),
          customer_id: data.customerId,
          money_amount: amount,
          balance: Number(balance),
          details: data.details,
        }),
      },
    );

    const newAddedTransaction = await res.json();

    if (!res.ok) {
      // const errorText = await res;
      //   console.error("API ERROR:", errorText);
      return {
        success: false,
        error: Array.isArray(newAddedTransaction.message)
          ? newAddedTransaction.message
          : [newAddedTransaction.message || "Adding Transaction failed"],
      };
    }

    revalidateTag(`userTransactionsAdminPage`);

    return {
      success: true,
      data: newAddedTransaction,
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
