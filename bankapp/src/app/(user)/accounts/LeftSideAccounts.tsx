"use client";

import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import Link from "next/link";
import { useUser } from "../UserContext";
import { OpenNewAccountBtn } from "./OpenNewAccountBtn";
import { ISaverAccountType } from "../../../../../shared/types/saverAccountType.interface";

export default function LeftSideAccounts({
  userAllAccounts_withBalance,
  allSaverAccounTypes,
}: {
  userAllAccounts_withBalance: AccountWithBalance[];
  allSaverAccounTypes: ISaverAccountType[];
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
        {userAllAccounts_withBalance.map((account) => {
          const saverType = allSaverAccounTypes.find(
            (s) => s.account_name === account.account_type,
          );

          return (
            <div key={account.account_id} className="col-12 col-md-6">
              <div className="card shadow-sm border-0 p-3 h-100">
                <h5 className="fw-bold" style={{ color: "#004c3f" }}>
                  {account.account_type} Account
                </h5>

                <p className="mb-1">
                  Account Number: <strong>{account.account_nr}</strong>
                </p>

                <h4 style={{ color: "#004c3f" }}>£{account.balance}</h4>

                {saverType && (
                  <p className="text-muted small">
                    {saverType.interest}% interest
                  </p>
                )}

                <Link
                  className="btn btn-outline-success btn-sm mt-auto"
                  href={`/transactions/${account.account_type}/${activeUser?.last_name}`}
                >
                  Manage {account.account_type}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <OpenNewAccountBtn
          userAllAccounts_withBalance={userAllAccounts_withBalance}
          allSaverAccounTypes={allSaverAccounTypes}
        />
      </div>
    </div>
  );
}
