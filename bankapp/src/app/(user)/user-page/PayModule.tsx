"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { addPayment } from "../../actions/payActions";
import { useRouter } from "next/navigation";
import { transferActions } from "../../actions/transferMoneyActions";
import styles from "../../../styles/User-Page/userPage.module.css";

interface Props {
  setShowPayModule: React.Dispatch<React.SetStateAction<boolean>>;
  additionalParam: string;
  setMessageStatus: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function PaymentForm({
  setShowPayModule,
  additionalParam,
  setMessageStatus,
}: Props) {
  const { currUserAllAccounts, currUserTrx } = useUser();

  const { activeUser } = useUser();

  const router = useRouter();

  const [type, setType] = useState<"PAY" | "TRANSFER">("PAY");
  const [fromAccountValue, setFromAccountValue] = useState("");
  const [toAccountValue, setToAccountValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeUser) router.push("/login");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    e.preventDefault();

    try {
      setLoading(true);

      if (
        (type === "PAY" && additionalParam === "Make A Payment") ||
        additionalParam === "Add Money to Your Account"
      ) {
        const result = await addPayment(formData);

        setShowPayModule(false);
        setMessageStatus("Payment added successfully");
      } else {
        const result = await transferActions(
          formData,
          fromAccountValue,
          toAccountValue,
        );

        setShowPayModule(false);
        setMessageStatus("Money Transfer performed successfully");
      }
    } catch (err) {
      console.error(err);
      setMessageStatus("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
      <form
        onSubmit={handleSubmit}
        className={`d-flex flex-column gap-4 position-relative w-100 bg-white rounded-5 p-4 shadow-lg ${styles.formBlock}`}
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => setShowPayModule(false)}
          className={`btn btn-light rounded-circle position-absolute top-0 end-0 m-3 ${styles.formCloseBtn}`}
        >
          ×
        </button>

        {/* Hidden fields */}
        <input type="hidden" name="additionalParam" value={additionalParam} />
        <input type="hidden" name="userId" value={activeUser?.customer_id} />
        <input
          type="hidden"
          name="accountId"
          value={currUserAllAccounts[0]?.account_id}
        />
        {/* <input type="hidden" name="last_name" value={activeUser?.last_name} /> */}
        <input
          type="hidden"
          name="LastBalance"
          value={currUserTrx[0].balance}
        />

        {/* Title */}
        <h2 className="text-center fw-bold">
          {additionalParam === "Add Money to Your Account"
            ? additionalParam
            : "Payment Form"}
        </h2>

        {/* Type switch */}
        {additionalParam !== "Add Money to Your Account" && (
          <div className="d-flex gap-3">
            <label className="flex-fill">
              <input
                type="radio"
                className="d-none"
                checked={type === "PAY"}
                onChange={() => setType("PAY")}
              />
              <div
                className="p-3 text-center rounded-4 fw-bold"
                style={{
                  background: type === "PAY" ? "#006a4d" : "#e2e8f0",
                  color: type === "PAY" ? "#fff" : "#0f172a",
                }}
              >
                PAY
              </div>
            </label>

            <label className="flex-fill">
              <input
                type="radio"
                className="d-none"
                checked={type === "TRANSFER"}
                onChange={() => setType("TRANSFER")}
              />
              <div
                className="p-3 text-center rounded-4 fw-bold"
                style={{
                  background: type === "TRANSFER" ? "#2563eb" : "#e2e8f0",
                  color: type === "TRANSFER" ? "#fff" : "#0f172a",
                }}
              >
                TRANSFER
              </div>
            </label>
          </div>
        )}

        {/* PAY */}
        {type === "PAY" ? (
          <div className="d-flex flex-column gap-3">
            <div>
              <label
                htmlFor="payee"
                className="fw-bold fs-6 text-secondary mb-2 d-flex"
              >
                Payee
              </label>
              <input
                required
                id="payee"
                name="payee"
                className="w-100 p-3 rounded-4 border fs-6 bg-light"
              />
            </div>

            <div>
              <label
                htmlFor="money_amount"
                className="fw-bold fs-6 text-secondary mb-2 d-flex"
              >
                Amount
              </label>
              <input
                id="money_amount"
                required
                name="money_amount"
                type="number"
                placeholder="Enter amount"
                step="any"
                min="0.01"
                inputMode="decimal"
                className="w-100 p-3 rounded-4 border fs-6 bg-light"
              />
            </div>

            <div>
              <label className="fw-bold fs-6 text-secondary mb-2 d-flex">
                Details
              </label>
              <textarea
                name="details"
                rows={4}
                className="w-100 p-3 rounded-4 border fs-6 bg-light"
              />
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <div>
              <label
                htmlFor="From_account_type"
                className="fw-bold fs-6 text-secondary mb-2 d-flex"
              >
                From Account
              </label>
              <select
                required
                id="From_account_type"
                className="form-select w-100 p-3 rounded-4 border fs-6 bg-light"
                onChange={(e) => setFromAccountValue(e.target.value)}
              >
                <option></option>
                {currUserAllAccounts.map((a) => (
                  <option key={a.account_id}>{a.account_type}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="To_account_type"
                className="fw-bold fs-6 text-secondary mb-2 d-flex"
              >
                To Account
              </label>
              <select
                required
                id="To_account_type"
                className="form-select w-100 p-3 rounded-4 border fs-6 bg-light"
                onChange={(e) => setToAccountValue(e.target.value)}
              >
                <option></option>
                {currUserAllAccounts
                  .filter((a) => a.account_type !== fromAccountValue)
                  .map((a) => (
                    <option key={a.account_id}>{a.account_type}</option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="money_amount"
                className="fw-bold fs-6 text-secondary mb-2 d-flex"
              >
                Amount
              </label>
              <input
                type="number"
                id="money_amount"
                required
                name="money_amount"
                placeholder="Enter amount"
                step="any"
                min="0.01"
                inputMode="decimal"
                className="w-100 p-3 rounded-4 border fs-6 bg-light"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="alert alert-danger">{String(error)}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="p-3 rounded-4 fw-bold text-white"
          style={{
            background:
              type === "PAY"
                ? "linear-gradient(135deg, #004c3f, #22c55e)"
                : "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow:
              type === "PAY"
                ? "0 12px 30px rgba(22,163,74,0.35)"
                : "0 12px 30px rgba(37,99,235,0.35)",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
