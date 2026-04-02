"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState

// const GetAllUserAccounts = async () => {
//   const response = await fetch("http://localhost:3005/accounts");

//   const result = await response.json();

//   if (!result || result.length === 0) {
//     throw new Error("No posts found"); // Handle error if no posts are found, will send this message to Error page- error.tsx
//     //throw new Error("Failed to fetch posts"); // Handle error if fetch failss
//   }

//   return result;
// };

export default function UserPageHeader() {
  const { activeUser, setActiveUser, userAccountType } = useGlobal();
  const router = useRouter();

  const handleLogout = () => {
    setActiveUser(null);
    router.push("/");
  };

  // useEffect(() => {
  //   try {
  //     const fetchAccounts = async () => {
  //       const allUsersAccts = await GetAllUserAccounts();

  //       const allCurrentUserAccounts = allUsersAccts.filter(
  //         (acct: any) => acct.customer_id === activeUser?.customer_id,
  //       );

  //       setCurrUserAllAccounts(allCurrentUserAccounts);
  //     };

  //     fetchAccounts();
  //   } catch (error) {
  //     console.error("Error fetching accounts:", error);
  //     throw error;
  //   }
  // }, []);

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
      <Link href="/" style={{ color: "white", textDecoration: "none" }}>
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
        <Link href="/" style={navLinkStyle}>
          Home
        </Link>
        <Link href="/user-page" style={navLinkStyle}>
          Dashboard
        </Link>
        <Link
          href={`/statement/${userAccountType}/${activeUser?.last_name}`}
          style={navLinkStyle}
        >
          Transactions
        </Link>
        <Link href={`/account/${activeUser?.customer_id}`} style={navLinkStyle}>
          Account info
        </Link>
        <button onClick={handleLogout} style={navLinkStyle}>
          Log out
        </button>
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
