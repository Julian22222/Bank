"use client";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import React from "react";
import { useRouter } from "next/navigation";
import { User } from "../../shared/types/user.interface";
import { Account } from "@/src/shared/types/account.interface";
import Link from "next/link";

interface Props {
  users: User[];
  AllUsersAccounts: Account[]; // Add this line to include the AllUsersAccounts prop
}

export default function LoginForm({ users, AllUsersAccounts }: Props) {
  const {
    allUsers,
    setAllUsers,
    activeUser,
    setActiveUser,
    setUserAccountType,
    userAccountType,
    setCurrUserAllAccounts,
  } = useGlobal();

  // setAllUsers(users);

  const router = useRouter();

  const [formInput, setFormInput] = React.useState({ email: "", password: "" });
  const [loginError, setLoginError] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setAllUsers(users);

    // console.log("Form submitted");
    // console.log("Form Input:", formInput);

    // console.log("All Users from hadleSubmit:", allUsers);

    allUsers.map((user: User) => {
      if (
        user.email === formInput.email &&
        user.password === formInput.password
      ) {
        console.log("User found - from LoginForm:", user);
        setLoginError(false);
        setActiveUser(user);

        const userAccounts = AllUsersAccounts.filter(
          (account: Account) => account.customer_id === user.customer_id,
        );

        setUserAccountType(userAccounts[0].account_type); // Assuming the first account's type is representative of the user's account type
        setCurrUserAllAccounts(userAccounts); // Set the current user's accounts in context
        // console.log("All Users:", allUsers);
        // console.log("Active User before redirect:", activeUser);
        // console.log("Active User set to:", user);
        // Redirect to user page
        // window.location.href = "http://localhost:3000/user-page";
        router.push("/user-page");
        // redirect("http://localhost:3000/user-page");
      } else {
        console.log("User not found - from LoginForm:", user);
        setLoginError(true);
      }
    });

    ///////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!
    // redirect() ////is server-only in Next.js. Use router.push() for client-side navigation.
    // import { useRouter } from "next/navigation";

    // const router = useRouter();
    // router.push("/user-page");
  };

  const handleUser1Login = () => {
    setFormInput({ email: "julian@test.com", password: "123" });
  };

  const handleUser2Login = () => {
    setFormInput({ email: "tomSimpson@gmail.com", password: "01234" });
  };

  // console.log("userAccountType", userAccountType);

  return (
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
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <button
              className="user1-login"
              type="button"
              onClick={handleUser1Login}
            >
              Login as User1
            </button>
            <button
              className="user1-login"
              type="button"
              onClick={handleUser2Login}
            >
              Login as User2
            </button>
          </div>
          {/* Submit Button */}

          <input type="submit" value="Log on" className="login-button" />
        </form>
        {/* <button
          className="admin-login"
          type="button"
          onClick={() => router.push("/admin-login")}
        >
          Login as Admin
        </button> */}

        {loginError ?? (
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
          <Link href="/registration" style={linkStyle}>
            Register for Internet Banking
          </Link>
          <br />
          <a href="#" style={linkStyle}>
            Forgotten your login details?
          </a>
        </div>
        <br />
        <button
          className="admin-login"
          type="button"
          onClick={() => router.push("/admin-login")}
        >
          Login as Admin
        </button>

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
          <strong>Security notice:</strong> We’ll never ask you to move money or
          share your login details. If you receive a suspicious message, contact
          us immediately.
        </div>
      </div>
    </main>
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
