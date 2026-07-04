"use client";

import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import Link from "next/link";
import { useUser } from "../UserContext";
import { OpenNewAccountBtn } from "./OpenNewAccountBtn";

export default function LeftSideAccounts({
  userAllAccounts_withBalance,
}: {
  userAllAccounts_withBalance: AccountWithBalance[];
}) {
  const { activeUser } = useUser();

  if (!activeUser) return null;

  if (!userAllAccounts_withBalance.length) {
    return <p>No accounts found</p>;
  }

  return (
    <div className="col-lg-6">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#004c3f" }}>
        Customer Accounts
      </h2>

      <div className="row g-3">
        {userAllAccounts_withBalance.length > 0 ? (
          userAllAccounts_withBalance.map((account) => (
            <div key={account.account_id} className="col-12 col-md-6">
              <div className="card shadow-sm border-0 p-3 h-100">
                <h5 className="fw-bold" style={{ color: "#004c3f" }}>
                  {account.account_type} Account
                </h5>

                <p className="mb-1">
                  Account Number: <strong>{account.account_nr}</strong>
                </p>

                <h4 style={{ color: "#004c3f" }}>£{account.balance}</h4>

                <p className="text-muted small">1.25% AER (variable)</p>

                <Link
                  className="btn btn-outline-success btn-sm mt-2"
                  href={`/transactions/${account.account_type}/${activeUser?.last_name}`}
                >
                  Manage {account.account_type}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center fw-semibold text-success">
            No accounts found for this customer OR No Logged In User
          </p>
        )}
      </div>

      <div className="mt-3">
        <OpenNewAccountBtn />
      </div>
    </div>
  );
}
