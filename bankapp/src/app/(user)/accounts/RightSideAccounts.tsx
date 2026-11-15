"use client";

import { sendVerificationEmailBtnActions } from "../../actions/sendVerificationEmailActions";
import { useUser } from "../UserContext";
import { useState, useTransition, useEffect } from "react";

const COOLDOWN_SECONDS = 60;

export default function RightSideAccounts({
  setShowEditUserModule,
  setShowChangePasswordModule,
}: {
  setShowEditUserModule: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChangePasswordModule: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { activeUser } = useUser();

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  //show seconds, when you can resend the verification request
  const [cooldown, setCooldown] = useState(0);

  const handleEmailVerify = async () => {
    const result = await sendVerificationEmailBtnActions();

    console.log("From RightSideAccounts", result);

    setStatus(result);

    if (result.ok) setCooldown(COOLDOWN_SECONDS);
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);

    return () => clearTimeout(id);
  }, [cooldown]);

  return (
    <div className="col-lg-6 my-4 row ms-1">
      <div
        className="p-4 rounded shadow-sm card h-100 d-flex flex-column"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <p className="text-center fw-medium text-success">
          Here you can view and manage your account details, including personal
          information, contact details, and security settings.
        </p>

        <hr />

        <h4
          className="fw-bold text-decoration-underline"
          style={{ color: "#004c3f" }}
        >
          Account Details
        </h4>

        <p>
          <span className="text-success">User Name:</span>{" "}
          <strong>{activeUser?.first_name}</strong>
        </p>
        <p>
          <span className="text-success">User Lastname:</span>{" "}
          <strong>{activeUser?.last_name}</strong>
        </p>
        <p>
          <span className="text-success">DOB:</span>{" "}
          <strong>
            {" "}
            {activeUser?.dob
              ? new Date(activeUser.dob).toLocaleDateString("en-GB")
              : ""}
          </strong>
        </p>
        <p>
          <span className="text-success">Email:</span>{" "}
          <strong>{activeUser?.email}</strong>
        </p>
        <p>
          <span className="text-success">Phone:</span>{" "}
          <strong>{activeUser?.phone}</strong>
        </p>
        <p>
          <span className="text-success">Address:</span>{" "}
          <strong>{activeUser?.customer_address}</strong>
        </p>

        <div className="d-flex gap-2 flex-wrap mt-auto pt-3">
          <button
            className="btn btn-outline-success"
            onClick={() => setShowEditUserModule(true)}
          >
            Edit User
          </button>

          <button
            className="btn btn-outline-success"
            onClick={() => setShowChangePasswordModule(true)}
          >
            Edit Password
          </button>

          {/* {activeUser?.phoneVerified ? (
            <div className="badge bg-success">Phone Verified ✔️ </div>
          ) : (
            <button
              className="btn btn-outline-success"
              onClick={() => console.log("Verify your phone number")}
            >
              Verify Phone Number
            </button>
          )} */}

          {activeUser?.emailVerified ? (
            <div className="badge bg-success">Email Verified ✔️ </div>
          ) : (
            <button
              className="btn btn-outline-success"
              onClick={handleEmailVerify}
              disabled={isPending || cooldown > 0}
            >
              {isPending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Verify email"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
