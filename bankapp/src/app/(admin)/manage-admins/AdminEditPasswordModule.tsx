"use client";

import { useState } from "react";
import styles from "../../../styles/Admin/manage-admins.module.css";
import { AdminReturn } from "@/src/shared/types/adminReturn.interface";
import { useRouter } from "next/navigation";
import { updateAdminPasswordActions } from "../../actions/updateAdminPasswordActions";

const inputClass =
  "px-3 py-2 rounded-3 border border-secondary-subtle fs-6 shadow-none";
const labelClass = "fs-6 fw-semibold mb-1";

export default function AdminEditPasswordModule({
  setShowPasswordModule,
  admin,
}: {
  setShowPasswordModule: React.Dispatch<React.SetStateAction<boolean>>;
  admin: AdminReturn;
}) {
  const router = useRouter();

  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword.length < 8) {
      setError(["Password must be at least 8 characters."]);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(["Passwords do not match."]);
      return;
    }

    setLoading(true);
    try {
      const result = await updateAdminPasswordActions(
        admin.admin_id,
        newPassword,
      );

      if (!result.success) {
        setError(Array.isArray(result.error) ? result.error : [result.error]);
        return;
      }

      setShowPasswordModule(false);
      router.refresh();
    } catch (err) {
      console.error("Error updating password", err);
      setError(["An error occurred while updating the password."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3 position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,0.7)", zIndex: 1060, overflowY: "auto" }}
    >
      <form
        onSubmit={handleSubmit}
        className="position-relative w-100 bg-white rounded-4 p-4 shadow-lg d-flex flex-column gap-3"
        style={{ maxWidth: "460px", maxHeight: "95vh", overflowY: "auto" }}
      >
        <button
          type="button"
          onClick={() => setShowPasswordModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        <h2 className="m-0 text-center fs-3 fw-bold">Edit Password</h2>
        <p className="m-0 text-center text-secondary">{admin.admin_name}</p>

        <div className="d-flex flex-column">
          <label htmlFor="newPassword" className={labelClass}>
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className={inputClass}
          />
        </div>

        <div className="d-flex flex-column">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat new password"
            className={inputClass}
          />
        </div>

        {error.length > 0 && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "10px 16px",
              color: "#dc2626",
              fontSize: "14px",
            }}
          >
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {error.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="py-2 rounded-3 border-0 bg-success text-white fs-5 fw-bold"
        >
          {loading ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
