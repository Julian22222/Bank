"use client";

import React, { useEffect, useState } from "react";
import UserPageHeader from "../../user-page/UserPageHeader";
import { Transaction } from "@/src/shared/types/transaction.interface";
import { useGlobal } from "../../Context"; //IMPORT GLOBAL CONTEXT, Global UseState

export default function BankStatement() {
  const { currUserTrx } = useGlobal();

  return (
    <>
      <UserPageHeader />

      <section
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "25px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ color: "#004c3f", marginBottom: "20px" }}>
          Bank Statement
        </h2>

        <table
          style={{
            width: "100%",
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
            {currUserTrx.map((tx, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{tx.transaction_date}</td>
                <td style={tdStyle}>{tx.details}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: tx.money_amount.startsWith("-") ? "red" : "#006a4d",
                  }}
                >
                  {tx.money_amount.startsWith("-")
                    ? `${
                        tx.money_amount.slice(0, 1) +
                        "£" +
                        tx.money_amount.slice(1)
                      }`
                    : `£${tx.money_amount}`}
                </td>
                <td style={tdStyle}>£{tx.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "right", marginTop: "15px" }}>
          <a href="#" style={linkButtonStyle}>
            Download Statement
          </a>
          <a href="#" style={linkButtonStyle}>
            Print Bank Statement
          </a>
        </div>
      </section>
    </>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px",
  fontWeight: 600,
  fontSize: "14px",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  fontSize: "14px",
};

const linkButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  backgroundColor: "#004c3f",
  padding: "8px 15px",
  borderRadius: "5px",
  marginLeft: "10px",
};
