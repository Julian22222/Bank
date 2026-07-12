"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { registerNewUser } from "../../actions/registerNewUserActions";
import { useRouter } from "next/navigation";
import { ICreateUser } from "../../../../../shared/types/createNewUser.interface";
import styles from "../../../styles/Admin/admin.module.css";
import { useAdmin } from "../AdminContext";
import Footer from "@/src/components/AdminFooter";

export default function RegistrationPage() {
  const { newUserRegister, setNewUserRegister } = useAdmin();

  const router = useRouter();

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [newUserData, setNewUserData] = useState<ICreateUser>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    customer_address: "",
    dob: null as unknown as Date, // or just null if your interface allows
  });

  useEffect(() => {
    setNewUserData({
      first_name: newUserRegister.first_name ?? "",
      last_name: newUserRegister.last_name ?? "",
      email: newUserRegister.email ?? "",
      phone: newUserRegister.phone ?? "",
      customer_address: newUserRegister.customer_address ?? "",
      dob: newUserRegister.dob ? new Date(newUserRegister.dob!) : new Date(),
      password: "",
    });
  }, [newUserRegister]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetNewRegisterUser = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    customer_address: "",
    dob: "",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError([]);

    if (newUserData.password !== confirmPassword) {
      setError(["Passwords do not match"]);
      return;
    }

    // Handle registration logic here
    try {
      const result = await registerNewUser(newUserData);

      if (!result.success) {
        setError(result.error || ["Registration failed"]);
        return;
      }

      setNewUserRegister(resetNewRegisterUser);

      router.push("/admin-users");
    } catch (error) {
      setError(["Registration failed"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <AdminPageHeader /> */}

      <main
        className="d-flex justify-content-center align-items-center min-vh-100 py-5 px-3"
        style={{
          backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="w-100 bg-white rounded-5 p-5 position-relative"
          style={{
            maxWidth: "650px",
            boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              router.push("/admin-users");
              setNewUserRegister(resetNewRegisterUser);
            }}
            className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.formCloseBtn}`}
          >
            ×
          </button>

          {/* Title */}
          <h2 className="m-0 mb-4 text-center fs-2 fw-bolder text-dark">
            Register New User
          </h2>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* First + Last Name */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold fs-6 text-dark mb-2">
                  First Name
                </label>

                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  placeholder="Enter first name"
                  value={newUserData.first_name}
                  onChange={handleChange}
                  className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold fs-6 text-dark mb-2">
                  Last Name
                </label>

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  placeholder="Enter last name"
                  value={newUserData.last_name}
                  onChange={handleChange}
                  className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label fw-bold fs-6 text-dark mb-2">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter email address"
                value={newUserData.email}
                onChange={handleChange}
                className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
              />
            </div>

            {/* Passwords */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold fs-6 text-dark mb-2">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  value={newUserData.password}
                  onChange={handleChange}
                  className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold fs-6 text-dark mb-2">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="form-label fw-bold fs-6 text-dark mb-2">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                required
                placeholder="Enter phone number"
                value={newUserData.phone}
                onChange={handleChange}
                className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
              />
            </div>

            {/* Address */}
            <div>
              <label className="form-label fw-bold fs-6 text-dark mb-2">
                Address
              </label>

              <input
                id="customer_address"
                name="customer_address"
                type="text"
                required
                placeholder="Enter address"
                value={newUserData.customer_address}
                onChange={handleChange}
                className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="form-label fw-bold fs-6 text-dark mb-2">
                Date of Birth
              </label>

              <input
                id="dob"
                name="dob"
                type="date"
                required
                value={
                  newUserData.dob
                    ? new Date(newUserData.dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setNewUserData((prev) => ({
                    ...prev,
                    dob: e.target.value ? new Date(e.target.value) : new Date(),
                  }))
                }
                className="form-control w-100 p-3 rounded-4 border fs-6 shadow-none bg-light text-dark transition"
              />
            </div>

            {/* Errors */}
            {error.length > 0 && (
              <div className="bg-danger-subtle text-danger fs-6 border border-danger-subtle rounded-4 py-3 px-3">
                <ul className="m-0 ps-3">
                  {error.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit */}
            <button
              className="mt-2 p-3 rounded-4 border-0 text-white fs-5 fw-bold cursor-pointer shadow shadow-sm shadow-lg transition bg-primary bg-gradient"
              type="submit"
            >
              {!loading ? "Register New User" : "Registering..."}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-4 text-center fs-6 text-secondary">
            Already finished?{" "}
            <Link
              href="/admin-users"
              className="text-primary fw-bold text-decoration-none"
            >
              Go back
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-5 pt-4 border-top border-secondary fs-6 text-secondary lh-17">
            <strong>Security notice:</strong> We’ll never ask you to move money
            or share your login credentials. If you receive a suspicious
            message, contact support immediately.
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
