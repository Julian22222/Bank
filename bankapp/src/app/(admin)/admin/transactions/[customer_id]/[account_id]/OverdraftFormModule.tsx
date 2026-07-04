"use client";

import { overDraftLimitActions } from "@/src/app/actions/overDraftLimitActions";
import { useState } from "react";
import styles from "../../../../../../styles/Admin/adminEditUserModule.module.css";

export default function OverdraftForm({
  setOverdraftModule,
  accountId,
}: {
  setOverdraftModule: React.Dispatch<React.SetStateAction<boolean>>;
  accountId: string;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError([]);
    setLoading(true);

    try {
      const addNewOverDraftLimit = await overDraftLimitActions(
        amount,
        accountId,
      );

      if (!addNewOverDraftLimit) {
        setError(["Error changing overdraft limit"]);
        return;
      }

      if (!addNewOverDraftLimit.success) {
        setError(
          Array.isArray(addNewOverDraftLimit.error)
            ? addNewOverDraftLimit.error
            : [addNewOverDraftLimit.error],
        );
        return;
      }
      setOverdraftModule(false);
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
        onSubmit={handleSubmit}
        className="position-relative w-100 bg-white rounded-5 p-5 shadow-lg d-flex flex-column gap-4"
        style={{
          maxWidth: "500px",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setOverdraftModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        <h2 className="m-0 text-center fs-2 fw-bold text-slate">
          Overdraft Limit Form
        </h2>

        {/* Amount */}
        <div className="d-flex flex-column gap-2">
          <label
            htmlFor="money_amount"
            className="fs-6 fw-semibold text-slate-700"
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
            className="p-3 rounded-4 border border-slate fs-6 shadow-none"
          />
        </div>

        {/* Errors */}
        {error.length > 0 && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "16px",
              padding: "14px 18px",
              color: "#dc2626",
              fontSize: "14px",
            }}
          >
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
              }}
            >
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
          className="mt-2 p-3 rounded-4 border-0 bg-success bg-gradient text-white fs-5 fw-bold cursor-pointer shadow-lg"
        >
          {loading ? "Updating..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
