import { AdminReturn } from "@/src/shared/types/adminReturn.interface";
import styles from "../../../styles/Admin/manage-admins.module.css";
import AdminPageHeader from "@/src/components/AdminPageHeader";
import ManageAdminDashboard from "./ManageAdminDashboard";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

export default async function ManageAdmins() {
  const data = await adminApiServerFetch(`${process.env.BACK_END_URL}/admin`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    next: { tags: ["allAdminsData"] },
  });

  // if (!res.ok) {
  //   throw new Error("Failed to fetch admin data");
  // }

  // const data: AdminReturn[] = await res.json();

  return (
    <div className={styles.mainBlock}>
      <AdminPageHeader />
      <h2 className="m-4">Manage Admins</h2>

      <ManageAdminDashboard data={data} />
    </div>
  );
}
