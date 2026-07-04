"use server";

import { revalidatePath, revalidateTag } from "next/cache";
require("dotenv").config();

export async function addPayment(formData: FormData) {
  const { additionalParam, LastBalance, money_amount, details, payee } =
    Object.fromEntries(formData.entries());

  // const additionalParam = formData.get("additionalParam"); //To know is it payment or adding money to bank account
  const isPayment = additionalParam === "Make A Payment";
  // const lastName = formData.get("last_name"); // Get last_name from hidden input, from the form
  const accountBalanceNum = Number(LastBalance); // Get last balance from hidden input, from the form and convert string to Number

  const moneyAmount = Number(money_amount); // Get money_amount from the form as string and convert it to Number
  const moneyAmounNum = Number(Math.abs(moneyAmount).toFixed(2)); //

  const moduleDetails = payee + " - " + details;

  if (isPayment) {
    console.log(
      "test calculation = accountBalance - moneyAmount",
      (accountBalanceNum - moneyAmounNum).toFixed(2),
    );
  } else {
    console.log(
      "test calculation = accountBalance + moneyAmount",
      (accountBalanceNum + moneyAmounNum).toFixed(2),
    );
  }

  let finalBalance_string;

  // If it's a payment and the money amount is less than the last balance,
  // we will deduct the money amount from the last balance, and make sure the money amount is negative.
  // Otherwise, we will add the money amount to the last balance, and make sure the money amount is positive.
  // if (isPayment && moneyAmount < accountBalance) {}
  if (isPayment) {
    finalBalance_string = (accountBalanceNum - moneyAmounNum).toFixed(2);
  } else {
    finalBalance_string = (accountBalanceNum + moneyAmounNum).toFixed(2);
  }

  // console.log("LastBalanceFromDBbeforeChange", accountBalanceNum);
  // console.log("moneyAmounNum", moneyAmounNum);
  // console.log("finalBalanceAfterChange", finalBalance_string);
  // console.log("accountType", accountType);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: Number(formData.get("accountId")), // Get account_id from hidden input, from the form
          customer_id: Number(formData.get("userId")), // Get customer_id from hidden input, from the form
          money_amount: isPayment ? -moneyAmounNum : moneyAmounNum, // KEY FIXED, All the keys should be like in DB.
          balance: Number(finalBalance_string),
          details: moduleDetails, // payee + description
        }),
      },
    );

    const newTransaction = await res.json();

    if (!res.ok) {
      throw new Error(
        newTransaction.message || "Failed to add payment to statements",
      );
    }

    revalidateTag("transactions");

    return {
      success: true,
      data: newTransaction,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
