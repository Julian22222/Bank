import Header from "@/src/app/(home)/Header";
import Link from "next/link";
import React from "react";
import "./login.css";
import LoginForm from "@/src/app/login/LoginForm";
import Footer from "@/src/components/Footer";
require("dotenv").config();

async function fetchAllUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/users`);
  return res.json();
}

async function fetchAllAccounts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts`);
  return res.json();
}

export default async function LoginPage() {
  const users = await fetchAllUsers();
  const AllUsersAccounts = await fetchAllAccounts();
  // console.log("Fetched All Users from useEffect:", users);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f8f8",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Header />

      {/* Login Form */}
      <LoginForm users={users} AllUsersAccounts={AllUsersAccounts} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
