"use client";

import React, { useRef } from "react";
import { ITransaction } from "../../../../../../../shared/types/transaction.interface";
import { useUser } from "../../../UserContext";

interface Props {
  sortedTrx: ITransaction[];
  account_type: string;
}

export default function TransactionClient({ sortedTrx, account_type }: Props) {
  const { activeUser } = useUser();

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const pdfOnly = document.querySelectorAll(".pdf-only");

    // Show hidden PDF content
    pdfOnly.forEach((el) => {
      (el as HTMLElement).style.display = "block";
    });

    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "bank-statement.pdf",
        html2canvas: {
          scale: 2,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();

    // Hide again after PDF is created
    pdfOnly.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
  };

  return (
    <>
      {/* PDF area */}
      <section ref={pdfRef} className="bg-white rounded shadow-sm p-4 mb-4">
        {/* Only appears in PDF */}
        <div className="pdf-only mb-4">
          <h3 className="h5 text-success">Customer Details</h3>

          <p className="mb-1">
            <strong>Name:</strong> {activeUser?.first_name}{" "}
            {activeUser?.last_name}
          </p>

          <p className="mb-1">
            <strong>Address:</strong> {activeUser?.customer_address}
          </p>

          <p className="mb-1">
            <strong>Date of Birth:</strong>{" "}
            {activeUser?.dob &&
              new Date(activeUser.dob).toLocaleDateString("en-GB")}
          </p>

          <p className="mb-1">
            <strong>Statement Date:</strong>{" "}
            {new Date().toLocaleDateString("en-GB")}
          </p>

          <hr />
        </div>

        {/* This is visible on the page and in PDF */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 text-success mb-0">
            Bank Statement of{" "}
            {account_type.charAt(0).toUpperCase() + account_type.slice(1)}{" "}
            Account
          </h2>

          <h5 className="fw-bold text-success mb-0">
            Account balance: £{sortedTrx[0]?.balance || "0.00"}
          </h5>
        </div>

        {/* Transactions */}
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
                    {tx.transaction_date
                      ? new Date(tx.transaction_date).toLocaleDateString(
                          "en-GB",
                        )
                      : "N/A"}
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

                  <td>£{Number(tx.balance).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Not included in PDF */}
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn"
          style={{ backgroundColor: "#004c3f", color: "white" }}
          onClick={handleDownload}
        >
          Download Statement
        </button>
      </div>
    </>
  );
}
