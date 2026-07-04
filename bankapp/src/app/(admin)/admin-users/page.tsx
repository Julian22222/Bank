import AdminPageHeader from "../../../components/AdminPageHeader";
import AdminUsersTitle from "./AdminUserTitle";
import Footer from "../../../components/AdminFooter";
import styles from "../../../styles/Admin/admin.module.css";
import AdminUsersDashboard from "./AdminUsersDashboard";

export default async function AdminUsersPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/with-customers`,
    { cache: "no-store", next: { tags: ["usersDataWithAccounts"] } },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user data and accounts data");
  }

  const usersData = await res.json();

  return (
    <div className={styles.pageUserBlock}>
      <AdminPageHeader />
      <AdminUsersTitle />
      <AdminUsersDashboard usersData={usersData} />
      <Footer />
    </div>
  );
}
