"use client";

import React, { useRef } from "react";
import { ITransaction } from "../../../../../../../shared/types/transaction.interface";

interface Props {
  sortedTrx: ITransaction[];
  account_type: string;
}

export default function TransactionClient({ sortedTrx, account_type }: Props) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element) return;

    element.classList.add("pdf-export");

    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "bank-statement.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();

    element.classList.remove("pdf-export");
  };

  return (
    <section ref={pdfRef} className="bg-white rounded shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="h5 text-success mb-0">
          Bank Statement of{" "}
          {account_type.charAt(0).toUpperCase() + account_type.slice(1)} Account
        </h2>

        <h5 className="fw-bold text-success mb-0">
          Account balance: {sortedTrx[0]?.balance || 0}
        </h5>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {sortedTrx.map((tx, i) => (
              <tr key={i}>
                <td>
                  {new Date(tx.transaction_date || "").toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </td>

                <td>{tx.details}</td>

                <td
                  className={
                    tx.money_amount < 0 ? "text-danger" : "text-success"
                  }
                >
                  {tx.money_amount < 0 ? "-" : ""}£
                  {Math.abs(tx.money_amount).toFixed(2)}
                </td>

                <td>£{tx.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button */}
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn"
          style={{ backgroundColor: "#004c3f", color: "white" }}
          onClick={handleDownload}
        >
          Download Statement
        </button>
      </div>
    </section>
  );
}
