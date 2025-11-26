"use client";
import React, { useEffect } from "react";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import Link from "next/link";

async function fetchUserTransactions() {
  const res = await fetch("http://localhost:3005/statements");
  return res.json();
}

export default function AccountOverview() {
  // console.log("All Transactions in AccountOverview:", allTransactions);
  const { activeUser, allTransactions, setAllTransactions } = useGlobal();

  useEffect(() => {
    try {
      const fetchData = async () => {
        if (!activeUser) return; // ⬅ avoid running too early

        const transactions = await fetchUserTransactions();

        // console.log("Fetched Transactions:", transactions);

        if (activeUser) {
          const allUserTransactions = transactions.filter(
            (tx: any) => tx.customer_id === activeUser.customer_id
          );
          console.log(
            `Transactions for user ${activeUser.customer_id}:`,
            allUserTransactions
          );

          setAllTransactions(allUserTransactions);
          // setActiveUser({ ...activeUser, transactions: userTransactions });
        }
      };

      fetchData();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }, [activeUser]);

  console.log("activeUser console", activeUser?.customer_id);

  if (!activeUser) {
    return <p>Loading account...</p>;
  }

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
      <h3 style={{ color: "#004c3f" }}>Current Account</h3>
      <p style={{ marginTop: "10px" }}>
        Account Number: <strong>12-34-56 / 98765432</strong>
      </p>
      <h1 style={{ fontSize: "36px", color: "#006a4d", margin: "20px 0" }}>
        {"£" +
          Number(
            allTransactions?.[allTransactions.length - 1]?.balance
          ).toFixed(2)}
        {/* Get last object from transactions and get balance from that */}
        {/* £4,285.27 */}
      </h1>
      <div>
        <Link href="#" style={buttonStyle}>
          Make a Payment
        </Link>
        <Link href="#" style={buttonStyle}>
          Transfer Money
        </Link>
        <Link
          href={`/statement/${activeUser?.customer_id}`}
          style={buttonStyle}
        >
          View Statements
        </Link>
      </div>
    </section>
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
