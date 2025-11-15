"use client";
import Header from "@/src/components/Header";
import Link from "next/link";
import React, { useEffect } from "react";
import "./login.css";
import { User } from "../../shared/types/user.interface";
import { redirect } from "next/navigation"; // Importing redirect function for navigation
import { useRouter } from "next/navigation";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState

async function fetchAllUsers() {
  const res = await fetch("http://localhost:3005/users");
  return res.json();
}

export default function LoginPage() {
  const { allUsers, setAllUsers, activeUser, setActiveUser } = useGlobal();

  // const userEmail = "julian@test.com";
  // const pass = "123";
  const router = useRouter();

  const [formInput, setFormInput] = React.useState({ email: "", password: "" });
  const [loginError, setLoginError] = React.useState(false);
  // const [allUsers, setAllUsers] = React.useState<User[]>([]);
  // const [activeUser, setActiveUser] = React.useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchAllUsers();
        console.log("Fetched All Users from useEffect:", users);
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();

    // fetchAllUsers().then((data) => {
    //   console.log("Fetched users:", data);
    //   setAllUsers(data);
    // });
    // console.log("Active allUsers from UseEffect :", allUsers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Form Input:", formInput);

    console.log("All Users from hadleSubmit:", allUsers);

    allUsers.map((user) => {
      if (
        user.email === formInput.email &&
        user.password === formInput.password
      ) {
        console.log("User found:", user);

        setActiveUser(user);
        console.log("All Users:", allUsers);
        console.log("Active User before redirect:", activeUser);
        console.log("Active User set to:", user);
        // Redirect to user page
        // window.location.href = "http://localhost:3000/user-page";
        router.push("/user-page");
        // redirect("http://localhost:3000/user-page");
      } else {
        console.log("User not found");
        setLoginError(true);
      }
    });

    ///////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!
    // redirect() ////is server-only in Next.js. Use router.push() for client-side navigation.
    // import { useRouter } from "next/navigation";

    // const router = useRouter();
    // router.push("/user-page");
  };

  ////////////////////////////////////////////////

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

      {/* Main Section */}
      <main className="main-login-container">
        <div className="login-box">
          {/* Title */}
          <h2 className="login-title">Log on to your account</h2>

          {/* Username */}
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>User ID</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter your User ID"
              value={formInput.email}
              name="email"
              onChange={(e) =>
                setFormInput({ ...formInput, email: e.target.value })
              }
            />

            {/* Password */}
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="Enter your Password"
              value={formInput.password}
              name="password"
              onChange={(e) =>
                setFormInput({ ...formInput, password: e.target.value })
              }
            />

            {/* Remember Me */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                style={{ marginRight: "8px" }}
              />
              <label
                htmlFor="remember"
                style={{ fontSize: "14px", color: "#333" }}
              >
                Remember my User ID
              </label>
            </div>

            <input type="submit" value="Log on" className="login-button" />
          </form>

          {loginError && (
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
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a href="#" style={linkStyle}>
              Forgotten your login details?
            </a>
            <br />
            <a href="#" style={linkStyle}>
              Register for Internet Banking
            </a>
          </div>

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

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  color: "#333",
  fontSize: "14px",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const linkStyle: React.CSSProperties = {
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
};

const footerLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  margin: "0 10px",
  fontSize: "14px",
};
