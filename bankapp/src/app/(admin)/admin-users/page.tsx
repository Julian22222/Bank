import AdminPageHeader from "../../../components/AdminPageHeader";
import AdminUsersTitle from "./AdminUserTitle";
import Footer from "../../../components/AdminFooter";
import styles from "../../../styles/Admin/admin.module.css";
import AdminUsersDashboard from "./AdminUsersDashboard";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

export default async function AdminUsersPage() {
  const usersData = await adminApiServerFetch(
    `${process.env.BACK_END_URL}/accounts/with-customers`,
    { cache: "no-store", next: { tags: ["usersDataWithAccounts"] } },
  );

  return (
    <div className={styles.pageUserBlock}>
      <AdminPageHeader />
      <AdminUsersTitle />
      <AdminUsersDashboard usersData={usersData} />
      <Footer />
    </div>
  );
}
