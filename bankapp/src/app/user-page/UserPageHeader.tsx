"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState

const GetAllUserAccounts = async () => {
  const response = await fetch("http://localhost:3005/accounts");

  const result = await response.json();

  if (!result || result.length === 0) {
    throw new Error("No posts found"); // Handle error if no posts are found, will send this message to Error page- error.tsx
    //throw new Error("Failed to fetch posts"); // Handle error if fetch failss
  }

  return result;
};

export default function UserPageHeader() {
  const { activeUser, setCurrUserAllAccounts } = useGlobal();

  useEffect(() => {
    try {
      const fetchAccounts = async () => {
        const allUsersAccts = await GetAllUserAccounts();

        const allCurrentUserAccounts = allUsersAccts.filter(
          (acct: any) => acct.customer_id === activeUser?.customer_id
        );

        setCurrUserAllAccounts(allCurrentUserAccounts);
      };

      fetchAccounts();
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  }, []);

  return (
    <header
      style={{
        backgroundColor: "#006a4d",
        color: "white",
        padding: "12px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        href="http://localhost:3000/"
        style={{ color: "white", textDecoration: "none" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/elephant3.png"
            alt="Bank Logo"
            width={40}
            height={40}
            style={{ marginRight: "10px" }}
          />

          <h1 style={{ margin: 0, fontSize: "22px" }}>BIG BANK</h1>
        </div>
      </Link>
      <nav>
        <Link href="http://localhost:3000/" style={navLinkStyle}>
          Home
        </Link>
        <Link href="http://localhost:3000/user-page" style={navLinkStyle}>
          Dashboard
        </Link>
        <Link href="/accounts/123" style={navLinkStyle}>
          Accounts
        </Link>
        <Link
          href={`http://localhost:3000/statement/${activeUser?.customer_id}`}
          style={navLinkStyle}
        >
          Payments
        </Link>
        <Link href="#" style={navLinkStyle}>
          Log out
        </Link>
      </nav>
    </header>
  );
}

// Inline style constants
const navLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  marginLeft: "20px",
  fontWeight: "bold",
};
