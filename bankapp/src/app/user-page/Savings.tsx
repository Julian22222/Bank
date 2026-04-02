"use client";

import { useGlobal } from "../Context";

export default function Savings() {
  const { currUserAllAccounts } = useGlobal();

  const isSaverAccountexists = currUserAllAccounts.filter(
    (account) => account.account_type === "Saver",
  );

  return (
    <>
      {isSaverAccountexists.length ? (
        <div style={smallCard}>
          <h3 style={{ color: "#004c3f" }}>Saver Account</h3>
          <p>
            Account Number:{" "}
            <strong>{isSaverAccountexists[0]?.account_nr}</strong>
          </p>
          <h2 style={{ color: "#006a4d" }}>
            £{isSaverAccountexists[0]?.balance}
          </h2>
          <p style={{ fontSize: "14px", color: "#555" }}>
            1.25% AER (variable)
          </p>
          <a href="#" style={linkButtonStyle}>
            Manage Saver Account
          </a>
        </div>
      ) : (
        <div style={smallCard}>
          <h3 style={{ color: "#004c3f" }}>Open A Saver Account</h3>
          <p>
            We pay up to <strong> 6 % </strong> interest
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Start saving today and watch your money grow with our competitive
            interest rates.
          </p>

          <a href="#" style={linkButtonStyle}>
            Manage Saver Account
          </a>
        </div>
      )}
    </>
  );
}

const linkButtonStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "10px",
};

const smallCard: React.CSSProperties = {
  flex: "1 1 300px",
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
