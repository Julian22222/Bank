//Server actions must live in a server-only file, so we created actions.ts with "use server"
//❌ You can't use a server action inside a Client Component file. You have to make separate file with server action and import it inside the Client Component
//If you want a server action, it must be defined outside the client component, or the file must be server-side only.

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
"use server";

require("dotenv").config();

export async function addPayment(formData: FormData) {
  // const {additionalParam, userId } = Object.fromEntries(formData); // Convert FormData to an object for easier access

  const additionalParam = formData.get("additionalParam"); //To know is it payment or adding money to bank account
  console.log("additionalParam in addPayment", additionalParam);
  const isPayment = additionalParam === "Make A Payment" ? true : false;
  console.log("isPayment in addPayment", isPayment);

  const customer_id = formData.get("userId"); // Get customer_id from hidden input, from the form
  console.log("customer_id in addPayment", customer_id);
  const account_id = formData.get("accountId"); // Get account_id from hidden input, from the form
  console.log("account_id in addPayment", account_id);
  const accountBalance = Number(formData.get("LastBalance")); // Get last balance from hidden input, from the form and convert string to Number
  console.log("LastBalanceFromDB", accountBalance);
  console.log("Type of LastBalanceFromDB", typeof accountBalance);

  const moneyAmount = Number(formData.get("money_amount")); // Get money_amount from the form as string and convert it to Number
  const moneyAmounModified = Number(Math.abs(moneyAmount).toFixed(2)); //
  console.log("moneyAmounModified", moneyAmounModified);
  console.log("Type of moneyAmount", typeof moneyAmounModified);

  const money_amount = formData.get("money_amount");
  console.log("money_amount in addPayment", money_amount);

  if (isPayment) {
    console.log(
      "test calculation = accountBalance - moneyAmount",
      (accountBalance - moneyAmounModified).toFixed(2),
    );
  } else {
    console.log(
      "test calculation = accountBalance + moneyAmount",
      (accountBalance + moneyAmounModified).toFixed(2),
    );
  }

  let modifiedMoneyAmount;
  let finalBalance;

  // If it's a payment and the money amount is less than the last balance,
  // we will deduct the money amount from the last balance, and make sure the money amount is negative.
  // Otherwise, we will add the money amount to the last balance, and make sure the money amount is positive.
  // if (isPayment && moneyAmount < accountBalance) {}
  if (isPayment) {
    finalBalance = (accountBalance - moneyAmounModified).toFixed(2);
  } else {
    finalBalance = (accountBalance + moneyAmounModified).toFixed(2);
  }

  const payee = formData.get("payee");
  const details = payee + " - " + formData.get("details");

  // const balance = finalBalance.toFixed(2); // Round to 2 decimal places and convert to string
  const account_type = formData.get("accountType");
  const account_nr = formData.get("accountNumber");

  console.log("account_id", account_id);
  console.log("customer_id", customer_id); //this is server side file - server actions, will appear in terminal
  console.log("money_amount", modifiedMoneyAmount);
  // console.log("balance", balance);
  console.log("details", details);

  console.log("LastBalanceFromDBbeforeChange", accountBalance);
  console.log("finalBalanceAfterChange", finalBalance);
  ///////////////////////////////////////////////////////////////////////////

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BACK_END_URL}/statements`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       account_id,
  //       customer_id,
  //       money_amount: isPayment ? -moneyAmounModified : moneyAmounModified, // KEY FIXED, All the keys should be like in DB.
  //       finalBalance,
  //       details,
  //     }),
  //   },
  // );

  // console.log("RES STATUS", res.status);

  // let data = await res.json();
  // console.log(data);

  ///////////

  // if (!res.ok) {
  //   throw new Error("Failed to add payment to statements");
  // }else {
  //   console.log("Success:", res.status);
  // }

  // const res2 = await fetch(`http://localhost:3005/accounts/${account_id}`, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     customer_id,
  //     account_type,
  //     account_nr,
  //     balance,
  //   }),
  // });

  // if (!res2.ok) {
  //   throw new Error("Failed to add data to accounts");
  // }

  // revalidatePath(`/statements/${customer_id}`); // Revalidate the statements page for the current user
  // redirect(`/user-page`); // Redirect to the user-page, main page for the current user after payment is added
  // // return res.json();
}
