import Link from "next/link";
import styles from "../../../styles/Accounts/accounts.module.css";

export const HelpAndGuidance = () => {
  const items = [
    {
      title: "Payments & Transfers",
      desc: "How to send money, limits, timings.",
    },
    {
      title: "Using Your Card",
      desc: "Lost cards, PIN, blocked transactions.",
    },
    { title: "Online Banking", desc: "Login, reset password, security tips." },
    { title: "Protecting Yourself", desc: "Fraud, scams, safety advice." },
    { title: "Loans & Credit", desc: "Applying, repayments, managing debt." },
    {
      title: "Savings & Investments",
      desc: "Options, interest rates, tax info.",
    },
    {
      title: "Account Management",
      desc: "Update details, close account, statements.",
    },
    { title: "Customer Support", desc: "Contact us, opening hours, feedback." },
  ];

  return (
    <section className="container-fluid p-4">
      {/* MAIN CONTAINER */}
      <div className={`rounded shadow-sm p-5 m-3 ${styles.mainBlock}`}>
        {/* TITLE */}
        <h2 className="text-center fs-2 text-primary">Help & Guidance</h2>

        <p className="text-center">
          Need support? Find helpful guides and resources for all your banking
          needs.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-4 mt-4">
          {items.map((item, i) => (
            <div
              key={i}
              className={`shadow-sm p-3 rounded-3 bg-white border transition-transform ${styles.mapItem}`}
            >
              <h3 style={{ color: "#0056b3", fontSize: "18px" }}>
                {item.title}
              </h3>

              <p style={{ fontSize: "14px" }}>{item.desc}</p>

              <Link
                href="#"
                className={`d-inline-block ms-1 text-decoration-none fw-bold mt-2 py-2 px-3 rounded-2 ${styles.learnMore}`}
              >
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
