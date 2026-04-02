"use client";
import React, { useEffect, useState } from "react";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import Link from "next/link";
import { PayModule } from "@/src/components/PayModule";
import { Account } from "@/src/shared/types/account.interface";
import { Transaction } from "@/src/shared/types/transaction.interface";
import { useMemo } from "react";

interface Props {
  allTx: Transaction[];
}

export default function AccountOverview({ allTx }: Props) {
  // console.log("All Transactions in AccountOverview:", allTransactions);
  const {
    activeUser,
    currUserAllAccounts,
    allTransactions,
    userAccountType,
    setCurrUserTrx,
    currUserTrx,
    setAllTransactions,
  } = useGlobal();

  const [showPayModule, setShowPayModule] = useState<boolean>(false);
  const [additionalParam, setAdditionalParam] = useState<string>("");

  const [card_details, setCardDetails] = useState<Account | undefined>(
    undefined,
  );

  ///////////////////////////////////////////////

  // const allcurrUserTrx = useMemo(() => {
  //   return allTransactions.filter(
  //     (tx) =>
  //       tx.customer_id === activeUser?.customer_id &&
  //       tx.account_id === currUserAllAccounts[0]?.account_id,
  //   );
  // }, [allTransactions, activeUser]);

  //////////////////////////////////////////////////
  useEffect(() => {
    try {
      const fetchData = async () => {
        if (!activeUser) return; // ⬅ avoid running too early

        // Set global allTransactions if not set
        if (allTransactions.length === 0) {
          setAllTransactions(allTx);
        }

        const accountID = currUserAllAccounts.find(
          (account: Account) =>
            account.customer_id === activeUser.customer_id &&
            account.account_type === userAccountType,
        )?.account_id;

        // console.log(
        //   "accountID in AccountOverview useEffect:",
        //   typeof accountID,
        // );

        if (activeUser) {
          const thisUserAllTransactionsInMainAccount = allTx.filter(
            (tx: Transaction) =>
              tx.customer_id === activeUser.customer_id &&
              tx.account_id === accountID,
          );
          // console.log(
          //   `Transactions for user ${activeUser.customer_id}:`,
          //   allUserTransactions
          // );

          console.log(
            "thisUserAllTransactions in AccountOverview useEffect:",
            thisUserAllTransactionsInMainAccount,
          );

          //format transaction_date from YYYY-MM-DD to DD MMM YYYY
          const formatedUserTx = thisUserAllTransactionsInMainAccount.map(
            (tx: Transaction) => ({
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
          // setActiveUser({ ...activeUser, transactions: userTransactions });

          // console.log("currUserAllAccounts in UserPage:", currUserAllAccounts);
        }

        const user_AccountObject = currUserAllAccounts.filter(
          (account: Account) => {
            return (
              account.customer_id === activeUser.customer_id &&
              account.account_type === userAccountType
            );
          },
        );

        setCardDetails(user_AccountObject[0]);
      };

      fetchData();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }, [activeUser, allTx, currUserAllAccounts, userAccountType]); //<--- add balance as dependency to re-fetch when it changes

  /////////////////////////////////////////////////////////////////////////////////

  // console.log("activeUser console", activeUser?.customer_id);

  if (!activeUser) {
    return <p>Loading account...</p>;
  }

  // console.log("allTransactions in AccountOverview:", allTransactions);
  // console.log("userAccountType in AccountOverview:", userAccountType);
  // console.log("activeUser in AccountOverview:", activeUser);

  return (
    <div>
      {showPayModule ? (
        <PayModule
          setShowPayModule={setShowPayModule}
          additionalParam={additionalParam}
        />
      ) : (
        <section
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >
          <h3 style={{ color: "#004c3f" }}>Current Account</h3>
          <p style={{ marginTop: "10px" }}>
            Account Number: <strong>{card_details?.account_nr}</strong>
          </p>
          <h1 style={{ fontSize: "36px", color: "#006a4d", margin: "20px 0" }}>
            {"£" + Number(card_details?.balance).toFixed(2)}
            {/* Get last object from transactions and get balance from that */}
            {/* £4,285.27 */}
          </h1>
          <div>
            <button
              onClick={() => {
                (setShowPayModule(true), setAdditionalParam("Make A Payment"));
              }}
              style={buttonStyle}
            >
              Make a Payment
            </button>
            <button
              onClick={() => {
                (setShowPayModule(true),
                  setAdditionalParam("Add Money to Your Account"));
              }}
              style={buttonStyle}
            >
              Add Money
            </button>
            <Link
              href={`/statement/${userAccountType}/${activeUser?.last_name}`}
              style={buttonStyle}
            >
              View Statements
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#006a4d",
  color: "white",
  textDecoration: "none",
  padding: "10px 18px",
  borderRadius: "4px",
  marginRight: "10px",
  fontWeight: "bold",
};
