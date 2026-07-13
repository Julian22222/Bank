"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminPageHeader from "../../../../../../components/AdminPageHeader";
import Admin_ShowUser from "./Admin_ShowUser";
import MoneyForm from "./AdminTransactionModule";
import { ITransaction } from "../../../../../../../../shared/types/transaction.interface";
import OverdraftForm from "./OverdraftFormModule";

interface Props {
  userAccountTransactions: ITransaction[];
  accountType: string;
  accountId: string;
  overDraftAmount: number;
}

export default function UserTransactionsDashboard({
  userAccountTransactions,
  accountType,
  accountId,
  overDraftAmount,
}: Props) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const [showModule, setShowModule] = useState<boolean>(false);
  const [overdraftModule, setOverdraftModule] = useState<boolean>(false);
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(userAccountTransactions.length / 20);

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const buttons = document.querySelectorAll(".no-print");

    // Hide buttons before creating PDF
    buttons.forEach((btn) => {
      (btn as HTMLElement).style.display = "none";
    });

    const html2pdf = (await import("html2pdf.js")).default;

    try {
      await html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: "bank-statement.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } finally {
      // Show buttons again on the page
      buttons.forEach((btn) => {
        (btn as HTMLElement).style.display = "";
      });
    }
  };

  const filteredTransactions = useMemo(() => {
    const start = (page - 1) * 20;
    return userAccountTransactions.slice(start, start + 20);
  }, [page, userAccountTransactions]);

  const handleOverdraftLimit = () => {
    setOverdraftModule(true);
  };

  const formatDate = (date?: string) =>
    new Date(date ?? "").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      {showModule ? (
        <MoneyForm setShowModule={setShowModule} accountId={accountId} />
      ) : overdraftModule ? (
        <OverdraftForm
          setOverdraftModule={setOverdraftModule}
          accountId={accountId}
        />
      ) : (
        <>
          <AdminPageHeader />

          <section
            ref={pdfRef}
            className="bg-white rounded-3 p-4 shadow-sm mb-5"
          >
            <Admin_ShowUser />
            <h2 className="mb-3" style={{ color: "#004c3f" }}>
              Bank Statement of {accountType} Account
            </h2>

            <div className="d-flex justify-content-between">
              <div className="text-end mb-3">
                <button
                  onClick={() => setShowModule(true)}
                  className="no-print text-decoration-none text-white py-2 px-3 rounded ms-2"
                  style={{ backgroundColor: "#004c3f" }}
                >
                  Add Transaction
                </button>
                <button
                  onClick={handleDownload}
                  className="no-print text-decoration-none text-white py-2 px-3 rounded ms-2"
                  style={{ backgroundColor: "#004c3f" }}
                >
                  Download Statement
                </button>

                {accountType === "Main" && (
                  <button
                    className="no-print text-decoration-none text-white py-2 px-3 rounded ms-2"
                    style={{ backgroundColor: "#004c3f" }}
                    onClick={handleOverdraftLimit}
                  >
                    Change Overdraft Limit
                  </button>
                )}
              </div>

              <h2
                className="fw-bold d-flex mb-3 justify-content-end"
                style={{
                  color: "#004c3f",
                }}
              >
                Account balance: {userAccountTransactions[0]?.balance || 0}{" "}
              </h2>
            </div>
            {accountType === "Main" && (
              <p
                className="fw-bold d-flex mb-3 justify-content-end"
                style={{
                  color: "#a45d16",
                }}
              >
                Overdraft Limit: {overDraftAmount}
              </p>
            )}

            <table
              className="w-100"
              style={{
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  className="text-start"
                  style={{ backgroundColor: "#e6f2ef" }}
                >
                  <th className="p-2 fw-semibold fs-6">Date</th>
                  <th className="p-2 fw-semibold fs-6">Description</th>
                  <th className="p-2 fw-semibold fs-6">Amount</th>
                  <th className="p-2 fw-semibold fs-6">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, i) => (
                  <tr key={tx.transaction_id} className="border-bottom">
                    <td className="p-2 fs-6">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="p-2 fs-6">{tx.details}</td>
                    <td
                      className="p-2 fs-6"
                      style={{
                        color: tx.money_amount < 0 ? "red" : "#006a4d",
                      }}
                    >
                      {tx.money_amount < 0
                        ? `-£${Math.abs(tx.money_amount)}`
                        : `£${tx.money_amount}`}
                    </td>
                    <td className="p-2 fs-6">£{tx.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {/* PAGINATION */}
          <div className="no-print d-flex justify-content-center align-items-center gap-2 mt-4 mb-4">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {page > 1 && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPage(page - 1)}
              >
                {page - 1}
              </button>
            )}

            <button className="btn btn-primary btn-sm fw-bold">{page}</button>

            {page < pageCount && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPage(page + 1)}
              >
                {page + 1}
              </button>
            )}

            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === pageCount}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}
