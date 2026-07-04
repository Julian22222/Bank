"use client";

import { useState } from "react";
import styles from "../../../../styles/Admin/adminEditUserModule.module.css";
import { ReturnUser } from "@/src/shared/types/returnUser.interface";

interface Prop {
  userData: ReturnUser;
  setShowPasswordModule: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminEditUserPassword({
  userData,
  setShowPasswordModule,
}: Prop) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // await editUserPasswordActions()

      setShowPasswordModule(false);
    } catch (error) {
      console.error("Failed to edit user password", error);
      alert("Failed to edit user password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`d-flex justify-content-center align-items-center min-vh-100 p-4 ${styles.mainBlock}`}
    >
      {/* CARD */}
      <div
        className={`position-relative w-100 bg-white rounded-5 p-5 shadow-lg ${styles.cardBlock}`}
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => setShowPasswordModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-center fw-bold mb-4" style={{ fontSize: "36px" }}>
          Edit User Password
        </h2>

        <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
          {/* First + Last Name */}
          {/* <div className="row g-3"> */}

          <div className="bg-gray-50 p-3 rounded-xl md:col-span-2">
            <p className="text-gray-500 mb-1">User Name:</p>
            <p className="font-medium text-gray-800">
              {userData.first_name} {userData.last_name}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl md:col-span-2">
            <p className="text-gray-500 mb-1">Date of Birth:</p>
            <p className="font-medium text-gray-800">
              {userData.dob
                ? new Date(userData.dob).toLocaleDateString("en-GB")
                : "Not provided"}
            </p>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label
                htmlFor="first_name"
                className="form-label fw-bold text-success"
              >
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control p-3 rounded-4 bg-light"
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="first_name"
                className="form-label fw-bold text-success"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                required
                value={password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control p-3 rounded-4 bg-light"
              />
            </div>
          </div>
          {/* Submit */}
          <button
            // disabled={loading}
            type="submit"
            className="btn text-white fw-bold p-3 rounded-4 fs-6 bg-primary bg-gradient shadow-lg"
          >
            {loading ? "Saving..." : "Edit Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
