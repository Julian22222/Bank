"use client";

import { useAdmin } from "../AdminContext";

export default function WelcomeAdmin() {
  const { activeAdmin } = useAdmin();

  if (!activeAdmin) {
    return <p>Redirecting...</p>;
  }

  return (
    <section className="text-center py-5 px-3 text-success">
      {activeAdmin && (
        <h2 className="fs-3">
          Welcome back,{" "}
          <span style={{ color: "#a45d16" }}>{activeAdmin.admin_name}</span>
        </h2>
      )}

      <p style={{ color: "#a45d16" }} className="mb-0">
        This is an Admin Portal
      </p>
    </section>
  );
}
