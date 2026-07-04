"use client";

import { useEffect, useState } from "react";
import { editUserAction } from "../../actions/editUserActions";
import { useUser } from "../UserContext";
import { editUser } from "@/src/shared/types/editUser.type";

interface Props {
  setShowEditUserModule: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditUserModule({ setShowEditUserModule }: Props) {
  const { activeUser, setActiveUser } = useUser();

  const [formData, setFormData] = useState<editUser>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    customer_address: "",
    dob: "",
  });

  const [loading, seLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeUser) {
      setFormData({
        first_name: activeUser.first_name,
        last_name: activeUser.last_name,
        email: activeUser.email,
        phone: activeUser.phone,
        customer_address: activeUser.customer_address,
        dob: activeUser.dob
          ? new Date(activeUser.dob).toISOString().split("T")[0]
          : "",
      });
    }
  }, [activeUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeUser) return;

    seLoading(true);

    setError(null);

    const changedFields = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) =>
          value !== activeUser?.[key as keyof typeof activeUser],
      ),
    );

    if (Object.keys(changedFields).length === 0) return;

    try {
      await editUserAction(activeUser?.customer_id, changedFields);

      if (activeUser) {
        setActiveUser((prev) => (prev ? { ...prev, ...changedFields } : prev));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      seLoading(false);
    }

    setShowEditUserModule(false);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
      style={{
        backgroundImage: "url('/LogInPic/Login7.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 p-md-5 rounded-4 shadow-lg position-relative"
        style={{ width: "100%", maxWidth: "620px" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => setShowEditUserModule(false)}
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 fw-bold"
          style={{ width: "40px", height: "40px" }}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-center fw-bold mb-4" style={{ color: "#0f172a" }}>
          Edit User Details
        </h2>

        {/* Name Row */}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label
              htmlFor="first_name"
              className="form-label fw-bold text-secondary"
            >
              First Name
            </label>
            <input
              required
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control p-3 rounded-4 bg-light"
            />
          </div>

          <div className="col-6">
            <label
              htmlFor="last_name"
              className="form-label fw-bold text-secondary"
            >
              Last Name
            </label>
            <input
              required
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-control p-3 rounded-4 bg-light"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bold text-secondary">
            Email Address
          </label>
          <input
            required
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control p-3 rounded-4 bg-light"
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label fw-bold text-secondary">
            Phone Number
          </label>
          <input
            required
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control p-3 rounded-4 bg-light"
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label
            htmlFor="customer_address"
            className="form-label fw-bold text-secondary"
          >
            Customer Address
          </label>
          <input
            required
            id="customer_address"
            name="customer_address"
            value={formData.customer_address}
            onChange={handleChange}
            className="form-control p-3 rounded-4 bg-light"
          />
        </div>

        {/* DOB */}
        <div className="mb-4">
          <label htmlFor="dob" className="form-label fw-bold text-secondary">
            Date of Birth
          </label>
          <input
            required
            id="dob"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="form-control p-3 rounded-4 bg-light"
          />
        </div>

        <div>{error && <div className="text-danger">{error}</div>}</div>

        {/* Submit */}
        <button
          type="submit"
          className="btn w-100 fw-bold text-white py-3 rounded-4"
          style={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow: "0 14px 35px rgba(37,99,235,0.35)",
          }}
        >
          {loading ? "Loading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
