"use client";

import React from "react";
import "./user-page.css";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import UserPageHeader from "@/src/components/UserPageHeader";
import UserBanner from "@/src/components/UserBanner";
import AccountOverview from "@/src/components/AccountOverview";
import Savings from "@/src/components/Savings";
import CreditCard from "@/src/components/CreditCard";
import Loan from "@/src/components/Loan";
import RecentTransactions from "@/src/components/RecentTransactions";
import UserFooter from "@/src/components/UserFooter";

export default function UserPage() {
  const { activeUser, setActiveUser } = useGlobal();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f8f8",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <UserPageHeader />

      {/* User Banner */}
      <UserBanner />

      {/* Main Dashboard */}
      <main
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Account Overview */}
        <AccountOverview />

        {/* Savings & Credit Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            marginBottom: "40px",
          }}
        >
          {/* Savings */}
          <Savings />

          {/* Credit Card */}
          <CreditCard />

          {/* Loan */}
          <Loan />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Quick Actions */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            backgroundColor: "#e6f2ef",
            borderRadius: "10px",
            padding: "30px",
          }}
        >
          {[
            { icon: "💰", label: "Top Up Account" },
            { icon: "💳", label: "Pay Credit Card" },
            { icon: "🏦", label: "Open New Account" },
            { icon: "📊", label: "Spending Insights" },
            { icon: "📄", label: "Download Statement" },
          ].map((action, i) => (
            <a
              key={i}
              href="#"
              style={{
                textDecoration: "none",
                backgroundColor: "white",
                padding: "20px",
                width: "180px",
                textAlign: "center",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                color: "#004c3f",
                fontWeight: "bold",
              }}
            >
              <div style={{ fontSize: "36px" }}>{action.icon}</div>
              {action.label}
            </a>
          ))}
        </section>
      </main>

      {/* User Footer */}
      <UserFooter />
    </div>
  );
}
