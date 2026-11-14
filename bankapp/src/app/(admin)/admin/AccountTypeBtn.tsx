"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function AccountTypeBtn() {
  const router = useRouter();

  const handleClick = () => {
    console.log("Add / Edit Bank Saving Account Types button clicked");

    router.push("/admin/account-types");
  };

  return (
    <button
      className="btn btn-success w-100"
      // style={{ fontSize: "1.5rem" }}
      onClick={handleClick}
    >
      Add / Edit Bank Saving Account Types
    </button>
  );
}
