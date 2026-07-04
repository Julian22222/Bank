"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../../styles/Admin/admin.module.css";
import { useAdmin } from "../AdminContext";

export default function LoginFormAdmin() {
  const { setActiveAdmin } = useAdmin();
  const router = useRouter();

  const [formInput, setFormInput] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formInput),
        },
      );

      if (!res.ok) throw new Error();

      const admin = await res.json();

      setActiveAdmin(admin);
      setLoginError(false);

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="d-flex justify-content-center py-5">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "420px" }}>
        {/* Title */}
        <h2 className="text-center mb-4" style={{ color: "#a45d16" }}>
          Log on to your Admin account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Admin ID */}
          <label htmlFor="email" className="form-label fw-bold">
            Admin ID
          </label>
          <input
            required
            id="email"
            type="email"
            className="form-control mb-3"
            placeholder="Enter your Admin ID"
            value={formInput.email}
            onChange={(e) =>
              setFormInput({ ...formInput, email: e.target.value })
            }
          />

          {/* Password */}
          <label htmlFor="password" className="form-label fw-bold">
            Password
          </label>
          <input
            required
            id="password"
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
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={formInput.rememberMe}
              onChange={(e) =>
                setFormInput({ ...formInput, rememberMe: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="remember">
              Remember my Admin ID
            </label>
          </div>

          {/* Submit */}
          <button
            className={`btn w-100 fw-bold border-2 ${styles.adminLoginBtn}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        {/* Error */}
        {loginError && (
          <div className="text-danger text-center mt-3 fw-bold">
            Invalid Admin ID or Password
          </div>
        )}

        {/* Links */}
        <div className="text-center mt-3">
          <Link
            href="/"
            type="button"
            className={`btn w-100 fw-bold border-2 ${styles.backToMainBtn}`}
          >
            Back to Main Page
          </Link>

          <div className="my-3">
            <Link
              href="#"
              className="text-success fw-bold text-decoration-none"
            >
              Forgotten your login details?
            </Link>
          </div>
        </div>

        {/* Security */}
        <hr className="my-4" />

        <small className="text-muted">
          <strong>Security notice:</strong> We’ll never ask you to move money or
          share your login details. If you receive a suspicious message, contact
          us immediately.
        </small>
      </div>
    </main>
  );
}
