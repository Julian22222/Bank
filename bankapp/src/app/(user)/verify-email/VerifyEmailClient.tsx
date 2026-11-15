"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { verifyEmailAction } from "../../actions/verifyEmailActions";

type Status = "idle" | "success" | "error";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    background: "#f5f6f8",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    color: "#14213d",
  },
  card: {
    width: "100%",
    maxWidth: "26rem",
    padding: "2rem",
    background: "#ffffff",
    border: "1px solid #dde1e8",
    borderRadius: "10px",
  },
  title: { margin: "0 0 0.5rem", fontSize: "1.5rem", lineHeight: 1.25 },
  text: { margin: "0 0 1.5rem", lineHeight: 1.5, color: "#4a5568" },
  button: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#ffffff",
    background: "#14213d",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  link: {
    display: "inline-block",
    padding: "0.75rem 1rem",
    fontWeight: 600,
    color: "#ffffff",
    background: "#14213d",
    borderRadius: "6px",
    textDecoration: "none",
  },
  error: { margin: "0 0 1rem", color: "#b42318", lineHeight: 1.5 },
} as const;

export default function VerifyEmailClient({ token }: { token?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleVerify() {
    if (!token) return;
    startTransition(async () => {
      const result = await verifyEmailAction(token);
      setMessage(result.message);
      setStatus(result.ok ? "success" : "error");
    });
  }

  // No token in the URL
  if (!token) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Verification link is incomplete</h1>
          <p style={styles.text}>
            Open the link from your verification email again, or request a new
            one after signing in.
          </p>
          <Link href="/login" style={styles.link}>
            Go to sign in
          </Link>
        </section>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Email verified</h1>
          <p style={styles.text} role="status">
            {message} You can now go back to your Bank app.
          </p>
          <Link href="/accounts" style={styles.link}>
            Bank app
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Verify your email address</h1>
        <p style={styles.text}>
          Confirm your email to activate your account. This link expires 15
          minutes after it was sent.
        </p>

        {status === "error" && (
          <p style={styles.error} role="alert">
            {message} Sign in and request a new verification email.
          </p>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={isPending}
          style={{ ...styles.button, opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? "Verifying…" : "Verify email"}
        </button>
      </section>
    </main>
  );
}
