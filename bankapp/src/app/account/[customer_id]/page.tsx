"use client";

import { useParams } from "next/navigation";
import UserPageHeader from "../../user-page/UserPageHeader";
import { useGlobal } from "../../Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import { Account } from "@/src/shared/types/account.interface";
import QuickActions from "@/src/components/QuickActions";
import Footer from "@/src/components/Footer";
import { use } from "react";

type Props = {
  params: {
    customer_id: string;
  };
};

export default function CustomerAccountsPage({ params }: Props) {
  const { currUserAllAccounts, allUsers } = useGlobal();

  const MyParams = useParams();

  const UserDetails = allUsers.filter((user) => {
    return user.customer_id === Number(MyParams.customer_id);
  });

  // console.log("customer_id from URL:", MyParams.customer_id);
  // console.log("Filtered User Details:", UserDetails);

  return (
    <div>
      <UserPageHeader />
      <div style={mainAccountContainer}>
        <div style={leftAccountContainer}>
          <h1
            style={{
              marginTop: "20px",
              fontWeight: "800",
              textAlign: "center",
              color: "#0056b3",
              fontSize: "28px",
            }}
          >
            Customer All Accounts
          </h1>
          {/* Add your customer accounts page content here */}

          <div style={accountsContainer}>
            {currUserAllAccounts && currUserAllAccounts.length > 0 ? (
              <ul>
                {currUserAllAccounts.map((account: Account) => (
                  <li key={account.account_id} style={cardAccount}>
                    <div style={smallCard}>
                      <h3 style={{ color: "#0056b3" }}>
                        {account.account_type} Account
                      </h3>
                      <p>
                        Account Number: <strong>{account.account_nr}</strong>
                      </p>
                      <h2 style={{ color: "#007bff" }}>£{account.balance}</h2>
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        1.25% AER (variable)
                      </p>
                      <a href="#" style={linkButtonStyle}>
                        Manage {account.account_type} Account
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
          <br />
        </div>

        {/* ////////Rigth block with User details */}
        <div
          style={{
            backgroundColor: "#e3f2fd",
            padding: "40px 20px",
            borderRadius: "10px",
            marginTop: "10px",
            marginBottom: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              color: "#007bff",
              display: "flex",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Here you can view and manage your account details, including
            personal information, contact details, and security settings.
          </p>
          <hr />
          <br />
          <h3> Account details:</h3>
          <p>
            User Name: <strong>{UserDetails[0]?.first_name}</strong>
          </p>
          <p>
            User Lastname: <strong>{UserDetails[0]?.last_name}</strong>
          </p>
          <p>
            User DOB: <strong>{UserDetails[0]?.dob}</strong>
          </p>
          <p>
            User email: <strong>{UserDetails[0]?.email}</strong>
          </p>
          <p>
            User phone: <strong>{UserDetails[0]?.phone}</strong>
          </p>
          <p>
            User user Address:{" "}
            <strong>{UserDetails[0]?.customer_address}</strong>
          </p>
          <a href="#" style={linkButtonStyle}>
            Edit Account Details
          </a>
        </div>
      </div>
      <hr />

      {/* //////////////////////////////////////////////// */}

      <div>
        {/* Help & Guidance Section */}
        <section
          style={{
            backgroundColor: "#e3f2fd",
            padding: "40px 20px",
            borderRadius: "12px",
            margin: "20px 0",
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              textAlign: "center",
              color: "#0056b3",
            }}
          >
            Help & Guidance
          </h2>
          <p style={{ textAlign: "center" }}>
            Need support? Find helpful guides and resources for all your banking
            needs.
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
                  borderRadius: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                  transition: "transform 0.2s",
                }}
              >
                <h3 style={{ color: "#0056b3", fontSize: "18px" }}>
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

      {/* ///////////////////////////////////////////////// */}

      <Footer />
    </div>
  );
}

const linkButtonStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "10px",
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: "transparent",
  border: "1px solid #007bff",
  transition: "background-color 0.2s, color 0.2s",
};

const smallCard: React.CSSProperties = {
  flex: "1 1 300px",
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "1px solid #e0e0e0",
  margin: "10px 0",
  transition: "transform 0.2s",
};

const cardAccount: React.CSSProperties = {
  flex: "1 1 300px",
  backgroundColor: "white",
  borderRadius: "12px",
  margin: "0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "1px solid #e0e0e0",
  transition: "transform 0.2s",
};

const mainAccountContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  padding: "20px",
};

const leftAccountContainer: React.CSSProperties = {
  // flex: "1 1 300px",
  // minWidth: "300px",
};

const rightAccountContainer: React.CSSProperties = {
  width: "70%",
  // background: "#eee",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#007bff",
  color: "white",
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "12px",
  marginTop: "10px",
  marginLeft: "5px",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const accountsContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "10px",
};
