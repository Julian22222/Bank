import Header from "@/src/app/(home)/Header";
import Link from "next/link";
import React from "react";
import "./login.css";
import LoginForm from "@/src/app/login/LoginForm";

async function fetchAllUsers() {
  const res = await fetch("http://localhost:3005/users");
  return res.json();
}

export default async function LoginPage() {
  const users = await fetchAllUsers();
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
      <LoginForm users={users} />

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#004c3f",
          color: "white",
          textAlign: "center",
          padding: "30px 20px",
          marginTop: "60px",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          &copy; {new Date().toLocaleDateString().slice(-4)} Big Bank. All
          rights reserved.
        </p>
        <div>
          <a href="#" style={footerLinkStyle}>
            Privacy
          </a>
          <a href="#" style={footerLinkStyle}>
            Security
          </a>
          <a href="#" style={footerLinkStyle}>
            Accessibility
          </a>
        </div>
      </footer>
    </div>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  margin: "0 10px",
  fontSize: "14px",
};
