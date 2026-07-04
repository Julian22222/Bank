"use client";

import { useState } from "react";
import { editUserPasswordActions } from "../../actions/editUserPasswordActions";
import { useUser } from "../UserContext";

interface Props {
  setShowChangePasswordModule: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordChangeSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function EditUserPasswordModule({
  setShowChangePasswordModule,
  setPasswordChangeSuccess,
}: Props) {
  const { activeUser } = useUser();

  const [formData, setFormData] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeUser?.customer_id) return;

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New password and confirmation do not match!");
      return;
    }
    setPasswordChangeSuccess(false);

    try {
      setIsLoading(true);

      await editUserPasswordActions(
        activeUser?.customer_id,
        formData.oldPassword,
        formData.newPassword,
      );

      setPasswordChangeSuccess(true);
      setShowChangePasswordModule(false);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "An error occurred");

      setPasswordChangeSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/LogInPic/Login7.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-4 p-4 d-flex flex-column gap-3 position-relative"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setShowChangePasswordModule(false)}
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
          style={{ width: "40px", height: "40px" }}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-center fw-bold text-dark mb-2">Change Password</h2>

        {/* Old Password */}
        <div>
          <label
            htmlFor="oldPassword"
            className="form-label fw-bold small text-secondary"
          >
            Old Password
          </label>
          <input
            required
            id="oldPassword"
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="form-control bg-light"
            placeholder="Enter old password"
          />
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="form-label fw-bold small text-secondary"
          >
            New Password
          </label>
          <input
            required
            id="newPassword"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="form-control bg-light"
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="form-label fw-bold small text-secondary"
          >
            Confirm New Password
          </label>
          <input
            required
            id="confirmNewPassword"
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="form-control bg-light"
            placeholder="Confirm new password"
          />
        </div>

        <div>{error && <div className="text-danger">{error}</div>}</div>

        {/* Submit */}
        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary fw-bold py-2 rounded-3"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
