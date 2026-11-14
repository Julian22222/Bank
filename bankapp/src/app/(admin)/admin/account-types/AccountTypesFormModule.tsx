"use client";

import { addNewSaverAccount } from "@/src/app/actions/addNewSaverAccount";
import { useState } from "react";
import styles from "../../../../styles/Admin/account-types.module.css";

interface Props {
  setShowModule: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountTypesFormModule({ setShowModule }: Props) {
  const [data, setData] = useState({
    account_name: "",
    interest: "",
    money_limit: "",
    account_duration: "",
  });

  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    setLoading(true);

    const changedData = {
      account_name: data.account_name,
      interest: Number(data.interest),
      money_limit: Number(data.money_limit),
      account_duration: Number(data.account_duration),
    };

    try {
      const result = await addNewSaverAccount(changedData);

      if (!result.success) {
        setError(Array.isArray(result.error) ? result.error : [result.error]);
        return;
      }

      setShowModule(false);
    } catch {
      setError(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center p-3 position-fixed top-0 start-0 w-100 h-100"
      style={{
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background: "rgba(0,0,0,0.7)",
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
          onClick={() => setShowModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        <h2 className="m-0 text-center fs-2 fw-bold text-slate">
          Add New Saver Account
        </h2>

        {/* Account Name */}
        <div className="d-flex flex-column gap-2">
          <label
            htmlFor="account_name"
            className="fs-6 fw-semibold text-slate-700"
          >
            New Saver Account Name
          </label>

          <input
            id="account_name"
            required
            name="account_name"
            placeholder="Enter new saver's account name"
            value={data.account_name}
            onChange={handleChange}
            className="p-3 rounded-4 border border-slate fs-6 shadow-none"
          />
        </div>

        {/* Interest */}
        <div className="d-flex flex-column gap-2">
          <label htmlFor="interest" className="fs-6 fw-semibold text-slate-700">
            Interest (%)
          </label>

          <input
            id="interest"
            required
            type="number"
            step="any"
            min="0.01"
            name="interest"
            placeholder="Enter amount"
            value={data.interest}
            onChange={handleChange}
            className="p-3 rounded-4 border border-slate fs-6 shadow-none"
          />
        </div>

        {/* Money Limit */}
        <div className="d-flex flex-column gap-2">
          <label
            htmlFor="money_limit"
            className="fs-6 fw-semibold text-slate-700"
          >
            Money limit (£)
          </label>

          <input
            id="money_limit"
            required
            type="number"
            step="any"
            min="0.01"
            name="money_limit"
            placeholder="Enter amount"
            value={data.money_limit}
            onChange={handleChange}
            className="p-3 rounded-4 border border-slate fs-6 shadow-none"
          />
        </div>

        {/* Account Duration */}
        <div className="d-flex flex-column gap-2">
          <label
            htmlFor="account_duration"
            className="fs-6 fw-semibold text-slate-700"
          >
            Duration (months)
          </label>

          <input
            id="account_duration"
            required
            type="number"
            step="1"
            min="1"
            max="36"
            name="account_duration"
            placeholder="Enter the number of months"
            value={data.account_duration}
            onChange={handleChange}
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
          className="mt-2 p-3 rounded-4 border-0 bg-success bg-gradient text-white fs-5 fw-bold shadow-lg"
        >
          {loading ? "Updating..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
