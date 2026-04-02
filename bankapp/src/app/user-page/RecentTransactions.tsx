"use client";

import Link from "next/link";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import { useEffect, useState } from "react";
import { Transaction } from "@/src/shared/types/transaction.interface";

interface Props {
  allTx: Transaction[];
}

export default function RecentTransactions({ allTx }: Props) {
  const {
    activeUser,
    currUserTrx,
    setCurrUserTrx,
    userAccountType,
    currUserAllAccounts,
  } = useGlobal();

  // const [transActs, setTransActs] = useState<Transaction[]>([]);
  const [lastFiveTxns, setLastFiveTxns] = useState<Transaction[]>([]);
  const [thisUserTrx, setThisUserTrx] = useState<Transaction[]>([]);

  const fetchAllUsrTransactions = (allTx: Transaction[]) => {
    //   //all transaction for the current user
    //   const data = await fetch("http://localhost:3005/statements");
    //   const allTx = await data.json();

    // console.log("All Transactions fetched:", allTx);

    // const accountID = allTx.filter(
    //   (tx: Transaction) =>
    //     tx.customer_id === activeUser?.customer_id &&
    //     tx.account_id === currUserAllAccounts[0]?.account_id, // Filter by the first account's ID
    // );

    const accountID = currUserAllAccounts.find(
      (account) => account.account_type === userAccountType,
    )?.account_id;

    const userTx = allTx.filter(
      (tx: Transaction) =>
        tx.customer_id === activeUser?.customer_id &&
        tx.account_id === accountID,
    );

    // console.log("User Transactions filtered:", userTx);

    //sort transactions by date descending
    // const sortedTxns = userTx.sort((a: Transaction, b: Transaction) => {
    //   const dateA = a.transaction_date
    //     ? new Date(a.transaction_date).getTime()
    //     : 0;
    //   const dateB = b.transaction_date
    //     ? new Date(b.transaction_date).getTime()
    //     : 0;
    //   return dateB - dateA;
    // });

    // const sortedTxns = userTx.reverse(); // Reverse to show most recent first

    //format transaction_date from YYYY-MM-DD to DD MMM YYYY
    const formatedUserTx = userTx.map((tx: Transaction) => ({
      ...tx,
      transaction_date: new Date(tx.transaction_date || "").toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    }));

    setThisUserTrx(formatedUserTx); //React schedules the update, but DOES NOT update immediately
    //therefore we need to use 2 useEffects to handle dependent state updates, wait until currUserTrx is updated before deriving lastFiveTxns from it
    // console.log("currUserTrx: CONTEXT ", currUserTrx);
  };

  useEffect(() => {
    fetchAllUsrTransactions(allTx);
  }, [activeUser, allTx]);

  useEffect(() => {
    const recentFive = thisUserTrx.reverse().slice(0, 5);
    setLastFiveTxns(recentFive);
  }, [thisUserTrx]);

  //First effect sets currUserTrx
  //Second effect automatically runs once currUserTrx changes
  //Now your last 5 transactions always show up.

  return (
    <section
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "25px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "40px",
      }}
    >
      <h3 style={{ color: "#004c3f" }}>Recent Transactions</h3>
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e6f2ef", textAlign: "left" }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {lastFiveTxns.map((t, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{t.transaction_date}</td>
              <td style={tdStyle}>{t.details}</td>
              <td
                style={{
                  ...tdStyle,
                  color: t.money_amount?.startsWith("-") ? "red" : "#006a4d",
                }}
              >
                {t.money_amount}
              </td>
              <td style={tdStyle}>{t.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Link
          href={`http://localhost:3000/statement/${userAccountType}/${activeUser?.last_name}`} // Adjust the URL as needed
          style={linkButtonStyle}
        >
          View All Transactions
        </Link>
      </div>
    </section>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "10px",
  fontSize: "14px",
};

const linkButtonStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "10px",
};

const thStyle: React.CSSProperties = {
  padding: "10px",
  fontSize: "14px",
};
