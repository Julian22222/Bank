"use client";

import UserPageHeader from "../../user-page/UserPageHeader";
import { useGlobal } from "../../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import { Account } from "@/src/shared/types/account.interface";
import UserFooter from "../../user-page/UserFooter";
import QuickActions from "@/src/components/QuickActions";

export default function CustomerAccountsPage({}) {
  const { CurrUserAllAccounts, setCurrUserAllAccounts } = useGlobal();

  return (
    <div>
      <UserPageHeader />
      <div style={mainAccountContainer}>
        <div style={leftAccountContainer}>
          <h1
            style={{
              marginTop: "10px",
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Customer All Accounts
          </h1>
          {/* Add your customer accounts page content here */}

          <div>
            {CurrUserAllAccounts && CurrUserAllAccounts.length > 0 ? (
              <ul>
                {CurrUserAllAccounts.map((account: Account) => (
                  <li key={account.account_id} style={cardAccount}>
                    <div style={smallCard}>
                      <h3 style={{ color: "#004c3f" }}>
                        {account.account_type} Account
                      </h3>
                      <p>
                        Account Number: <strong>{account.account_nr}</strong>
                      </p>
                      <h2 style={{ color: "#006a4d" }}>£{account.balance}</h2>
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        1.25% AER (variable)
                      </p>
                      <a href="#" style={linkButtonStyle}>
                        Manage Saver Account
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{}}>
                No accounts found for this customer OR No LogedIn User
              </p>
            )}
          </div>
          <button style={buttonStyle}>Open new Account</button>
        </div>
        <div style={rightAccountContainer}>
          {/* Help & Guidance Section */}
          <section
            style={{
              backgroundColor: "#e6f2ef",
              padding: "60px 20px",
              borderRadius: "10px",
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "30px",
              marginLeft: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                textAlign: "center",
                color: "#004c3f",
              }}
            >
              Help & Guidance
            </h2>
            <p style={{ textAlign: "center" }}>
              Need support? Find helpful guides and resources for all your
              banking needs.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "25px",
                marginTop: "40px",
              }}
            >
              {[
                {
                  title: "Payments & Transfers",
                  desc: "How to send money, limits, timings.",
                },
                {
                  title: "Using Your Card",
                  desc: "Lost cards, PIN, blocked transactions.",
                },
                {
                  title: "Online Banking",
                  desc: "Login, reset password, security tips.",
                },
                {
                  title: "Protecting Yourself",
                  desc: "Fraud, scams, safety advice.",
                },
                {
                  title: "Loans & Credit",
                  desc: "Applying, repayments, managing debt.",
                },
                {
                  title: "Savings & Investments",
                  desc: "Options, interest rates, tax info.",
                },
                {
                  title: "Account Management",
                  desc: "Update details, close account, statements.",
                },
                {
                  title: "Customer Support",
                  desc: "Contact us, opening hours, feedback.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: "260px",
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ color: "#004c3f", fontSize: "18px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "14px" }}>{item.desc}</p>
                  <a href="#" style={{ ...linkButtonStyle }}>
                    Learn more
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <hr />

      <div style={smallCard}>
        <h3 style={{ color: "#004c3f" }}>Big Credit Card</h3>
        <p>Card Number: **** **** **** 2384</p>
        <h2 style={{ color: "#006a4d" }}>£2,150.00</h2>
        <p style={{ fontSize: "14px", color: "#555" }}>
          Available credit: £3,850.00
        </p>
        <a href="#" style={linkButtonStyle}>
          View Credit Card
        </a>
      </div>

      <div style={smallCard}>
        <h3 style={{ color: "#004c3f" }}>Personal Loan</h3>
        <p>Balance remaining: £5,200.00</p>
        <p style={{ fontSize: "14px", color: "#555" }}>
          Monthly payment: £220.00
        </p>
        <a href="#" style={linkButtonStyle}>
          Manage Loan
        </a>
      </div>

      <QuickActions />
      <UserFooter />
    </div>
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

const cardAccount: React.CSSProperties = {
  flex: "1 1 300px",
  backgroundColor: "white",
  borderRadius: "10px",
  margin: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const mainAccountContainer: React.CSSProperties = {
  display: "flex",
};

const leftAccountContainer: React.CSSProperties = {
  width: "30%",
  // background: "#eee",
  marginLeft: "30px",
};

const rightAccountContainer: React.CSSProperties = {
  width: "70%",
  // background: "#eee",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#006a4d",
  color: "white",
  textDecoration: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  marginTop: "10px",
  marginLeft: "5px",
  fontWeight: "bold",
};
