"use client";

import { handleAddNewTransactioninAdmin } from "@/src/app/actions/AdminAddNewTransaction";
import { useState } from "react";
import styles from "../../../../../../styles/Admin/adminEditUserModule.module.css";
import { useAdmin } from "@/src/app/(admin)/AdminContext";

interface Props {
  setShowModule: React.Dispatch<React.SetStateAction<boolean>>;
  accountId: string;
}

export default function MoneyForm({ setShowModule, accountId }: Props) {
  const { adminPage_UserData } = useAdmin();

  const [actionType, setActionType] = useState<"ADD" | "DEDUCT">("ADD");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    setLoading(true);

    const customerId = adminPage_UserData?.customer_id;

    if (!customerId) {
      setError(["Missing customer ID"]);
      return;
    }

    const data = {
      customerId,
      actionType,
      amount,
      details,
      accountId,
    };

    try {
      const addNewTransaction = await handleAddNewTransactioninAdmin(data);

      if (!addNewTransaction) {
        setError(["Error adding transaction"]);
        return;
      }

      if (!addNewTransaction.success) {
        setError(
          Array.isArray(addNewTransaction.error)
            ? addNewTransaction.error
            : [addNewTransaction.error],
        );
        return;
      }

      setShowModule(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center p-3"
      style={{
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        className="position-relative d-flex gap-4 w-100 bg-white rounded-5 p-5 shadow-lg flex-column"
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        <h2 className="m-0 text-center fs-2 fw-bold text-dark">
          Transaction Form
        </h2>

        {/* Radio Buttons */}
        <div className="d-flex gap-3">
          <label className="flex-fill cursor-pointer">
            <input
              type="radio"
              name="transactionType"
              value="ADD"
              checked={actionType === "ADD"}
              onChange={() => setActionType("ADD")}
              className="d-none"
            />

            <div
              className="p-3 rounded-4 text-center fw-bold fs-5 transition"
              style={{
                background: actionType === "ADD" ? "#16a34a" : "#e2e8f0",
                color: actionType === "ADD" ? "#ffffff" : "#0f172a",
                boxShadow:
                  actionType === "ADD"
                    ? "0 10px 25px rgba(22,163,74,0.35)"
                    : "none",
              }}
            >
              ADD
            </div>
          </label>

          <label className="flex-fill cursor-pointer">
            <input
              type="radio"
              name="transactionType"
              value="DEDUCT"
              checked={actionType === "DEDUCT"}
              onChange={() => setActionType("DEDUCT")}
              className="d-none"
            />

            <div
              className="p-3 rounded-4 text-center fw-bold fs-5 transition"
              style={{
                background: actionType === "DEDUCT" ? "#dc2626" : "#e2e8f0",
                color: actionType === "DEDUCT" ? "#ffffff" : "#0f172a",
                boxShadow:
                  actionType === "DEDUCT"
                    ? "0 10px 25px rgba(220,38,38,0.35)"
                    : "none",
              }}
            >
              DEDUCT
            </div>
          </label>
        </div>

        {/* Amount */}
        <div className="d-flex flex-column gap-2">
          <label
            htmlFor="money_amount"
            className="fs-6 fw-semibold text-secondary"
          >
            Money Amount
          </label>

          <input
            id="money_amount"
            required
            type="number"
            step="any"
            min="0.01"
            inputMode="decimal"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 rounded-4 border border-secondary fs-6 shadow-none"
          />
        </div>

        {/* Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label className="fs-6 fw-semibold text-secondary">Details</label>

          <textarea
            required
            placeholder="Enter transaction details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            className="p-3 rounded-4 border border-secondary fs-6 shadow-none"
            style={{
              resize: "none",
            }}
          />
        </div>

        {/* Errors */}
        {error.length > 0 && (
          <div className="bg-danger-subtle border border-danger-subtle rounded-4 py-2 px-3 text-danger fs-6">
            <ul className="m-0 ps-3">
              {error.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="mt-2 p-3 rounded-4 border-0 text-white fs-5 fw-bold cursor-pointer"
          style={{
            background:
              actionType === "ADD"
                ? "linear-gradient(135deg, #16a34a, #22c55e)"
                : "linear-gradient(135deg, #dc2626, #ef4444)",
            boxShadow:
              actionType === "ADD"
                ? "0 12px 30px rgba(22,163,74,0.35)"
                : "0 12px 30px rgba(220,38,38,0.35)",
          }}
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
}
