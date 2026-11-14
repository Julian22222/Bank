"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Admin/manage-admins.module.css";
import { AdminReturn } from "@/src/shared/types/adminReturn.interface";
import { updateAdminActions } from "../../actions/updateAdminActions";

const inputClass =
  "px-3 py-2 rounded-3 border border-secondary-subtle fs-6 shadow-none";
const labelClass = "fs-6 fw-semibold mb-1";

export default function AdminUpdateModule({
  setShowUpdateModule,
  admin,
  mode = "Change Admin Details",
}: {
  setShowUpdateModule: React.Dispatch<React.SetStateAction<boolean>>;
  admin: AdminReturn | null;
  mode?: string;
}) {
  const router = useRouter();

  const [data, setData] = useState({
    admin_name: admin?.admin_name,
    role: admin?.role,
    email: admin?.email,
    phone: admin?.phone,
    customer_address: admin?.customer_address,
    dob: admin?.dob ? admin.dob.slice(0, 10) : "",
  });

  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    setLoading(true);

    try {
      const result = await updateAdminActions(admin?.admin_id, {
        ...data,
      });

      if (!result.success) {
        setError(Array.isArray(result.error) ? result.error : [result.error]);
        return;
      }

      setShowUpdateModule(false);
      router.refresh();
    } catch {
      setError(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3 position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,0.7)", zIndex: 1050, overflowY: "auto" }}
    >
      <form
        onSubmit={handleSubmit}
        className="position-relative w-100 bg-white rounded-4 p-4 shadow-lg d-flex flex-column gap-3"
        style={{ maxWidth: "820px", maxHeight: "95vh", overflowY: "auto" }}
      >
        <button
          type="button"
          onClick={() => setShowUpdateModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        <h2 className="m-0 text-center fs-3 fw-bold">{mode}</h2>

        <div className="row g-3">
          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="admin_name" className={labelClass}>
              Admin Name
            </label>
            <input
              id="admin_name"
              name="admin_name"
              required
              placeholder="Enter admin's name"
              value={data.admin_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="role" className={labelClass}>
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              value={data.role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="admin">admin</option>
              <option value="superAdmin">superAdmin</option>
            </select>
          </div>

          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter admin's email"
              value={data.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Enter admin's phone number"
              value={data.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="customer_address" className={labelClass}>
              Address
            </label>
            <input
              id="customer_address"
              name="customer_address"
              required
              placeholder="Enter admin's address"
              value={data.customer_address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="dob" className={labelClass}>
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              required
              value={data.dob}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
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

        {!showChangePassword && (
          <button
            disabled={loading}
            type="submit"
            className="py-2 rounded-3 border-0 bg-success text-white fs-5 fw-bold"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        )}

        {/* {editMode && (
          <>
            {showChangePassword && (
              <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column">
                  <label htmlFor="newPassword" className={labelClass}>
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="d-flex flex-column">
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {passwordError && (
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
                    {passwordError}
                  </div>
                )}

                <button
                  type="submit"
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="py-2 rounded-3 border-0 bg-primary text-white fs-5 fw-bold"
                >
                  {passwordLoading ? "Saving..." : "Submit"}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowChangePassword((prev) => !prev)}
              className="py-2 rounded-3 border-0 bg-secondary text-white fs-5 fw-bold"
            >
              {showChangePassword
                ? "Cancel Password Change"
                : "Change Admin Password"}
            </button>
          </>
        )} */}
      </form>
    </div>
  );
}
