"use client";

import { editUserAction } from "@/src/app/actions/editUserActions";
import { ReturnUser } from "@/src/shared/types/returnUser.interface";
import { editUser } from "@/src/shared/types/editUser.type";
import { useState } from "react";
import styles from "../../../../styles/Admin/adminEditUserModule.module.css";

interface Prop {
  setShowModule: React.Dispatch<React.SetStateAction<boolean>>;
  userData: ReturnUser;
}

export default function AdminEditUser({ setShowModule, userData }: Prop) {
  const [userInfo, setUserInfo] = useState<editUser>({
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    phone: userData.phone,
    customer_address: userData.customer_address,
    dob: userData.dob?.substring(0, 10),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      await editUserAction(userData.customer_id, userInfo);
      setShowModule(false);
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user");
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
          onClick={() => setShowModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.closeBtn}`}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-center fw-bold mb-4" style={{ fontSize: "36px" }}>
          Edit User
        </h2>

        <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
          {/* First + Last Name */}
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="first_name" className="form-label fw-bold">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                required
                value={userInfo.first_name}
                onChange={handleChange}
                className="form-control p-3 rounded-4 bg-light"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="last_name" className="form-label fw-bold">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                required
                value={userInfo.last_name}
                onChange={handleChange}
                className="form-control p-3 rounded-4 bg-light"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label fw-bold">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              required
              value={userInfo.email}
              onChange={handleChange}
              className="form-control p-3 rounded-4 bg-light"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="form-label fw-bold">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              required
              value={userInfo.phone}
              onChange={handleChange}
              className="form-control p-3 rounded-4 bg-light"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="customer_address" className="form-label fw-bold">
              Customer Address
            </label>
            <input
              id="customer_address"
              name="customer_address"
              required
              value={userInfo.customer_address}
              onChange={handleChange}
              className="form-control p-3 rounded-4 bg-light"
            />
          </div>

          {/* DOB */}
          <div>
            <label htmlFor="dob" className="form-label fw-bold">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              required
              value={userInfo.dob}
              onChange={handleChange}
              className="form-control p-3 rounded-4 bg-light"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className="btn text-white fw-bold p-3 rounded-4 fs-6 bg-primary bg-gradient shadow-lg"
          >
            {loading ? "Saving..." : "Save User Information"}
          </button>
        </form>
      </div>
    </main>
  );
}
