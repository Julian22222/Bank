"use client";

import UserPageHeader from "../../user-page/UserPageHeader";
import { useGlobal } from "../../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import { Account } from "@/src/shared/types/account.interface";

export default function CustomerAccountsPage({}) {
  const { CurrUserAllAccounts, setCurrUserAllAccounts } = useGlobal();

  return (
    <div>
      <UserPageHeader />
      <h1>Customer Accounts Page</h1>
      {/* Add your customer accounts page content here */}

      <div>
        <h2>Accounts for Customer</h2>
        {CurrUserAllAccounts && CurrUserAllAccounts.length > 0 ? (
          <ul>
            {CurrUserAllAccounts.map((account: Account) => (
              <li key={account.account_id}>
                Account Number: {account.account_nr} - Type:{" "}
                {account.account_type}{" "}
                {/* - Balance: ${account.balance.toFixed(2)} */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No accounts found for this customer.</p>
        )}
      </div>
    </div>
  );
}
