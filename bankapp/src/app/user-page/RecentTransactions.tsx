"use client";

import Link from "next/link";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import { useEffect, useState } from "react";
import { Transaction } from "@/src/shared/types/transaction.interface";

export default function RecentTransactions() {
  const { activeUser, allTransactions, currUserTrx, setCurrUserTrx } =
    useGlobal();

  // const [transActs, setTransActs] = useState<Transaction[]>([]);
  const [lastFiveTxns, setLastFiveTxns] = useState<Transaction[]>([]);

  const fetchAllUsrTransactions = async () => {
    //all transaction for the current user
    const data = await fetch("http://localhost:3005/statements");
    const allTx = await data.json();

    // console.log("All Transactions fetched:", allTx);

    const userTx = allTx.filter(
      (tx: Transaction) => tx.customer_id === activeUser?.customer_id
    );

    //sort transactions by date descending
    const sortedTxns = userTx.sort((a: Transaction, b: Transaction) => {
      const dateA = a.transaction_date
        ? new Date(a.transaction_date).getTime()
        : 0;
      const dateB = b.transaction_date
        ? new Date(b.transaction_date).getTime()
        : 0;
      return dateB - dateA;
    });

    //format transaction_date from YYYY-MM-DD to DD MMM YYYY
    const formatedUserTx = sortedTxns.map((tx: Transaction) => ({
      ...tx,
      transaction_date: new Date(tx.transaction_date || "").toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
    }));

    setCurrUserTrx(formatedUserTx);

    ///////////////////////////////?????????????????????????
    console.log("currUserTrx: CONTEXT ", currUserTrx);
  };

  const getUSerTxns = async () => {
    const recentFive = currUserTrx.slice(0, 5);

    setLastFiveTxns(recentFive);
  };

  useEffect(() => {
    fetchAllUsrTransactions();
    getUSerTxns();
  }, [activeUser]);

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
                  color: t.money_amount.startsWith("-") ? "red" : "#006a4d",
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
          href={`http://localhost:3000/statement/${activeUser?.customer_id}`}
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
