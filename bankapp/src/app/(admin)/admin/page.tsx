import ActiveChats from "./ActiveChats";
import AdminPageHeader from "../../../components/AdminPageHeader";
import Footer from "../../../components/AdminFooter";
import NewUserRegistration from "./NewUserRegistration";
import WelcomeAdmin from "./WelcomeAdmin";
import AdminTitle from "./AdminTitle";
import styles from "../../../styles/Admin/admin.module.css";

export default async function AdminPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/admin/user-registration`,
  );

  if (!res.ok) {
    throw new Error("Failed to load admin data");
  }

  const usersToRegister = await res.json();

  const registerNumber = usersToRegister?.length ?? 0;

  const chatNumber = 6;

  return (
    <div className={styles.mainBlock}>
      <AdminPageHeader />

      <WelcomeAdmin />
      <AdminTitle num={registerNumber} title="New requests To Register" />

      <NewUserRegistration usersToRegister={usersToRegister} />
      <div className="my-4" />
      <hr />
      <div className="my-4" />

      <AdminTitle num={chatNumber} title="New Chats to reply back" />

      <ActiveChats />

      <Footer />
    </div>
  );
}
