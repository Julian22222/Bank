"use client";

import { useUser } from "../UserContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadUserClient } from "../../actions/auth-client";
import styles from "../../../styles/LoginPage/logon.module.css";
import { apiClientFetch } from "@/src/lib/api-client";

export default function LoginForm() {
  const { setActiveUser, setUserAccountType, setCurrUserAllAccounts } =
    useUser();

  const router = useRouter();

  const [formInput, setFormInput] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginRes = await fetch(`/api/auth/login`, {
        method: "POST",
        // credentials: "include", //important to include cookies in the request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput),
      });

      const response = await loginRes.json();

      console.log("Login response status:", loginRes);

      if (!loginRes.ok) {
        // throw new Error();

        console.error("Login failed:", await loginRes.text());
        setLoginError(response.message || "Failed to login");
        return;
      }

      const user = await loadUserClient();

      const userAccounts = await apiClientFetch(
        `/accounts/user/${user.customer_id}/accounts-balance`,
      );

      // console.log("User data after login:", user);

      setActiveUser(user);

      setUserAccountType(userAccounts[0].account_type);
      setCurrUserAllAccounts(userAccounts);
      setLoginError("");

      router.push("/user-page");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="d-flex justify-content-center py-5">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "420px" }}>
        <h2 className="text-center text-success mb-4">
          Log on to your account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* User ID */}
          <label className="form-label fw-bold">User ID</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your User ID"
            value={formInput.email}
            onChange={(e) =>
              setFormInput({ ...formInput, email: e.target.value })
            }
          />

          {/* Password */}
          <label className="form-label fw-bold">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter your Password"
            value={formInput.password}
            onChange={(e) =>
              setFormInput({ ...formInput, password: e.target.value })
            }
          />

          {/* Remember */}
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="remember" />
            <label className="form-check-label" htmlFor="remember">
              Remember my User ID
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn w-100 fw-bold ${styles.loginBtn}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error */}
        {loginError && (
          <div className="text-danger text-center mt-3 fw-bold">
            Invalid User Email or Password
          </div>
        )}

        {/* Links */}
        <div className="text-center mt-3">
          <Link
            href="/registration"
            className="text-success fw-bold text-decoration-none"
          >
            Register for Internet Banking
          </Link>

          <div>
            <Link
              href="#"
              className="text-success fw-bold text-decoration-none"
            >
              Forgotten your login details?
            </Link>
          </div>
        </div>

        {/* Admin */}
        <button
          type="button"
          className={`btn w-100 fw-bold my-3 ${styles.adminLoginBtn}`}
          onClick={() => router.push("/admin-login")}
        >
          Login as Admin
        </button>

        {/* Divider */}
        <hr className="my-4" />

        {/* Security text */}
        <small className="text-muted">
          <strong>Security notice:</strong> We’ll never ask you to move money or
          share your login details. If you receive a suspicious message, contact
          us immediately.
        </small>
      </div>
    </main>
  );
}
