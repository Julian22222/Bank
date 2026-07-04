"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import Link from "next/link";

export function Savings() {
  const { currUserAllAccounts } = useUser();

  const { activeUser } = useUser();

  const [userAccountsNoMain, setUserAccountsNoMain] = useState<
    AccountWithBalance[]
  >([]);

  useEffect(() => {
    if (!currUserAllAccounts.length) return;

    const fetchAccounts_withBalance = async () => {
      try {
        const savingsAccounts = currUserAllAccounts.filter(
          (a) => a.account_type !== "Main",
        );

        const results = await Promise.all(
          savingsAccounts.map(async (account) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/${account.account_id}/with-balance`,
            );

            return res.json();
          }),
        );

        setUserAccountsNoMain(results);
      } catch (error) {
        console.error("Error fetching accounts with balance:", error);
        throw error;
      }
    };

    fetchAccounts_withBalance();
  }, [currUserAllAccounts]);

  return (
    <>
      {/* {userAccountsNoMain.length ? ( */}
      <ul className="list-unstyled d-flex flex-wrap gap-3 p-0 m-0">
        {userAccountsNoMain.map((account) => (
          <li
            key={`${account.account_id}-${account.account_type}`}
            className="flex-fill"
            style={{ minWidth: "300px" }}
          >
            <div className="bg-white rounded shadow-sm p-4 h-100">
              <h3 className="text-success">{account.account_type}</h3>

              <p className="mb-2">
                Account Number: <strong>{account.account_nr}</strong>
              </p>

              <h2 className="fw-bold" style={{ color: "#006a4d" }}>
                £{account.balance}
              </h2>

              <p className="small text-muted">1.25% AER (variable)</p>

              <Link
                href={`/transactions/${account.account_type}/${activeUser?.last_name}`}
                className="fw-bold text-decoration-none text-success"
              >
                Manage {account.account_type} Account
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {userAccountsNoMain.length < 2 && (
        <div
          className="bg-white rounded shadow-sm p-4"
          style={{ minWidth: "300px" }}
        >
          <h3 className="text-success">Create new Account</h3>

          <p>
            We pay up to <strong>6%</strong> interest
          </p>

          <p className="small text-muted">
            Start saving today and watch your money grow with our competitive
            interest rates.
          </p>

          <Link
            href="/accounts"
            className="fw-bold text-decoration-none text-success"
          >
            Open A Saver Account
          </Link>
        </div>
      )}
    </>
  );
}
