//Server actions must live in a server-only file, so we created actions.ts with "use server"
//❌ You can't use a server action inside a Client Component file. You have to make separate file with server action and import it inside the Client Component
//If you want a server action, it must be defined outside the client component, or the file must be server-side only.

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

"use server";

export async function addPayment(formData: FormData) {
  const additionalParam = formData.get("additionalParam"); //To know is it payment or adding money to bank account
  const isPayment = additionalParam === "Make A Payment" ? true : false;

  const customer_id = formData.get("userId"); // Get customer_id from hidden input, from the form
  const account_id = formData.get("accountId"); // Get account_id from hidden input, from the form
  const LastBalance = Number(formData.get("LastBalance")); // Get last balance from hidden input, from the form and convert string to Number
  const moneyAmount = Number(formData.get("money_amount")); // Get money_amount from the form and convert string to Number

  const money_amount = formData.get("money_amount");

  let modifiedMoneyAmount;
  let finalBalance;

  if (isPayment && moneyAmount < LastBalance) {
    modifiedMoneyAmount = -Math.abs(Number(money_amount)).toFixed(2); // Ensure it's negative and rounded to 2 decimal places
    // const modifiedMoneyAmountStr = modifiedMoneyAmount.toString();

    finalBalance = LastBalance - moneyAmount;
  } else {
    modifiedMoneyAmount = +Math.abs(Number(money_amount)).toFixed(2);

    finalBalance = LastBalance + moneyAmount;
  }

  const payee = formData.get("payee");
  const details = payee + " - " + formData.get("details");

  const balance = finalBalance.toFixed(2); // Round to 2 decimal places and convert to string
  const account_type = formData.get("accountType");
  const account_nr = formData.get("accountNumber");

  console.log("account_id", account_id);
  console.log("customer_id", customer_id); //this is server side file - server actions, will appear in terminal
  console.log("money_amount", modifiedMoneyAmount);
  console.log("balance", balance);
  console.log("details", details);

  console.log("LastBalanceFromDB", LastBalance);
  console.log("finalBalanceAfterDeduction", finalBalance);
  ///////////////////////////////////////////////////////////////////////////

  const res = await fetch("http://localhost:3005/statements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id,
      customer_id,
      money_amount: modifiedMoneyAmount, // KEY FIXED, All the keys should be like in DB.
      balance,
      details,
    }),
  });

  console.log("RES STATUS", res.status);

  let data = await res.json();
  console.log(data);

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
