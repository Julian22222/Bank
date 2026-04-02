"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "../(home)/Header";
import Footer from "@/src/components/Footer";

export default function RegistrationPage() {
  type FormInput = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    customer_address: string;
    dob: string;
  };

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [data, setData] = useState<FormInput>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    customer_address: "",
    dob: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // "use server";

    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <>
      {/* Header */}
      <Header />

      <main className="main-login-container">
        <div className="login-box">
          <h2 className="login-title">Register for Internet Banking</h2>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter your first name"
              value={data.first_name}
              name="first_name"
              onChange={(e) => setData({ ...data, first_name: e.target.value })}
            />

            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter your last name"
              value={data.last_name}
              name="last_name"
              onChange={(e) => setData({ ...data, last_name: e.target.value })}
            />

            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              placeholder="Enter your email"
              value={data.email}
              name="email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />

            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="Enter your password"
              value={data.password}
              name="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="Confirm your password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter your phone number"
              value={data.phone}
              name="phone"
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />

            <label style={labelStyle}>Address</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter your address"
              value={data.customer_address}
              name="customer_address"
              onChange={(e) =>
                setData({ ...data, customer_address: e.target.value })
              }
            />

            <label style={labelStyle}>DOB</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter your date of birth"
              value={data.dob}
              name="dob"
              onChange={(e) => setData({ ...data, dob: e.target.value })}
            />

            <input type="submit" value="Register" className="login-button" />
          </form>

          <div
            style={{
              marginTop: "15px",
              color: "red",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Invalid User ID or Password
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link href="/login" style={linkStyle}>
              Already have an account? Log in
            </Link>
            <br />
            <Link href="/forgot-password" style={linkStyle}>
              Forgotten your login details?
            </Link>
          </div>
          <br />

          {/* Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#ddd",
              margin: "25px 0",
            }}
          ></div>

          {/* Security Info */}
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.5" }}>
            <strong>Security notice:</strong> We’ll never ask you to move money
            or share your login details. If you receive a suspicious message,
            contact us immediately.
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  color: "#333",
  fontSize: "14px",
  fontWeight: "bold",
};
