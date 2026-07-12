"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "../UserContext";
import Link from "next/link";
import PaymentForm from "@/src/app/(user)/user-page/PayModule";
import { IAccount } from "../../../../../shared/types/account.interface";
import { ITransaction } from "../../../../../shared/types/transaction.interface";
import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import { apiFetch } from "@/src/lib/api";

interface Props {
  allUserTransactions: ITransaction[];
  showPayModule: boolean;
  setShowPayModule: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountOverview({
  allUserTransactions,
  showPayModule,
  setShowPayModule,
}: Props) {
  const { activeUser, currUserAllAccounts, userAccountType, setCurrUserTrx } =
    useUser();

  const [additionalParam, setAdditionalParam] = useState<string>("");

  const [userCardDetails, setUserCardDetails] = useState<
    AccountWithBalance | undefined
  >(undefined);

  const [messageStatus, setMessageStatus] = useState<string | null>(null);

  useEffect(() => {
    if (messageStatus) {
      const timer = setTimeout(() => {
        setMessageStatus(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [messageStatus]);

  useEffect(() => {
    const fetchAccount_withBalance = async () => {
      const mainAccountId = currUserAllAccounts?.[0]?.account_id;
      if (!mainAccountId) return;

      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/${mainAccountId}/with-balance`,
        );

        const userData = await data.json();

        setUserCardDetails(userData);
      } catch (error) {
        console.error("Error fetching accounts with balance:", error);
        throw error;
      }
    };

    fetchAccount_withBalance();
  }, [activeUser, currUserAllAccounts]);

  useEffect(() => {
    if (!activeUser) return;

    const accountId = currUserAllAccounts.find(
      (account: IAccount) =>
        account.customer_id === activeUser.customer_id &&
        account.account_type === userAccountType,
    )?.account_id;

    if (!accountId) return;

    const thisUserAllTransactionsInMainAccount = allUserTransactions.filter(
      (tx: ITransaction) => tx.account_id === accountId,
    );

    const formatedUserTx = thisUserAllTransactionsInMainAccount.map(
      (tx: ITransaction) => ({
        ...tx,
        transaction_date: new Date(
          tx.transaction_date || "",
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }),
    );

    setCurrUserTrx(formatedUserTx);
  }, [activeUser, allUserTransactions, currUserAllAccounts, userAccountType]);

  return (
    <>
      {messageStatus && (
        <div className="alert alert-success position-absolute top-0 start-50 translate-middle-x mt-3">
          {messageStatus}
        </div>
      )}

      {showPayModule ? (
        <PaymentForm
          setShowPayModule={setShowPayModule}
          additionalParam={additionalParam}
          setMessageStatus={setMessageStatus}
        />
      ) : (
        <section className="bg-white rounded shadow-sm p-4 mb-5">
          <h3 className="text-success">Main Account</h3>

          <p className="mt-3 mb-2">
            Account Number: <strong>{userCardDetails?.account_nr}</strong>
          </p>

          <h1
            className="fw-bold my-4"
            style={{ fontSize: "36px", color: "#006a4d" }}
          >
            {userCardDetails
              ? "£" + Number(userCardDetails?.balance).toFixed(2)
              : "Loading..."}
          </h1>

          <div className="d-flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowPayModule(true);
                setAdditionalParam("Make A Payment");
              }}
              className="btn fw-bold text-white"
              style={{ backgroundColor: "#006a4d" }}
            >
              Payments / Transfers
            </button>

            <button
              onClick={() => {
                setShowPayModule(true);
                setAdditionalParam("Add Money to Your Account");
              }}
              className="btn fw-bold text-white"
              style={{ backgroundColor: "#006a4d" }}
            >
              Add Money
            </button>

            <Link
              href={`/transactions/${userAccountType ?? "Main"}/${activeUser?.last_name}`}
              className="btn fw-bold text-white"
              style={{ backgroundColor: "#006a4d" }}
            >
              View Statement
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
