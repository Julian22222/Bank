"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdmin } from "@/src/app/(admin)/AdminContext";

export default function Admin_ShowUser() {
  const { activeAdmin, adminPage_UserData } = useAdmin();

  const router = useRouter();

  useEffect(() => {
    if (!activeAdmin) {
      router.push("/admin-login");
    }
  }, [activeAdmin, router]);

  if (!activeAdmin) return null;

  if (!adminPage_UserData) {
    return <p>No user selected</p>;
  }

  return (
    <div>
      <h2 style={{ color: "#004c3f" }}>
        {adminPage_UserData?.first_name} {adminPage_UserData?.last_name}
      </h2>
      <hr />
    </div>
  );
}
