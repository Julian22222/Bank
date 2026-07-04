"use server";

import { cookies } from "next/headers";

import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import { revalidateTag } from "next/cache";

export async function transferActions(
  formData: FormData,
  fromAccountValue: string,
  toAccountValue: string,
) {
  const cookieStore = await cookies();

  const customerId = formData.get("userId");
  // console.log("customerId type from TRANSFER ACTIONS", typeof customerId);
  const moneyAmount = Number(formData.get("money_amount")); // Get money_amount from the form as string and convert it to Number
  const moneyAmounNum = Number(Math.abs(moneyAmount).toFixed(2));

  try {
    //all accounts array with balance
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/my-accounts-balance`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    const allAccountsWithBalance = await res.json();
    console.log(
      "allAccountsWithBalance from transferModuleActions",
      allAccountsWithBalance,
    );

    const fromAccountObject = allAccountsWithBalance.find(
      (account: AccountWithBalance) =>
        account.account_type === fromAccountValue,
    );

    const toAccountObject = allAccountsWithBalance.find(
      (account: AccountWithBalance) => account.account_type === toAccountValue,
    );

    // console.log("firstObject from transferModuleActions", fromAccountObject);
    // console.log("secondObject from transferModuleActions", toAccountObject);

    const {
      account_id: account_id1,
      customer_id,
      balance: balance1,
    } = fromAccountObject;
    const { account_id: account_id2, balance: balance2 } = toAccountObject;

    const deductedBalance = (Number(balance1) - moneyAmounNum).toFixed(2);
    const addedBalance = (Number(balance2) + moneyAmounNum).toFixed(2);

    const deductionTransaction = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: account_id1,
          customer_id,
          money_amount: -moneyAmounNum,
          balance: Number(deductedBalance),
          details: `Money transfer to your ${toAccountObject.account_type} account`,
        }),
      },
    );

    const newAddedDeductionTransaction = await deductionTransaction.json();

    if (!deductionTransaction.ok) {
      return {
        success: false,
        error: Array.isArray(newAddedDeductionTransaction.message)
          ? newAddedDeductionTransaction.message
          : [
              newAddedDeductionTransaction.message ||
                "Adding Transaction failed",
            ],
      };
    }
    /////////////////////////////////////////////////////
    const additionTransaction = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: account_id2,
          customer_id,
          money_amount: moneyAmounNum,
          balance: Number(addedBalance),
          details: `Money added from your ${fromAccountObject.account_type} account`,
        }),
      },
    );

    const newAddedAdditionTransaction = await additionTransaction.json();

    if (!additionTransaction.ok) {
      return {
        success: false,
        error: Array.isArray(newAddedAdditionTransaction.message)
          ? newAddedAdditionTransaction.message
          : [
              newAddedAdditionTransaction.message ||
                "Adding Transaction failed",
            ],
      };
    }

    revalidateTag("transactions");

    return {
      success: true,
      data1: newAddedDeductionTransaction,
      data2: newAddedAdditionTransaction,
    };
  } catch (error) {
    console.error("Error adding payment to statements:", error);
    return {
      success: false,
      message:
        error instanceof Error ? [error.message] : ["Unknown error occurred"],
    };
  }
}
