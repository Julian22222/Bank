import Footer from "@/src/components/Footer";
import Header from "../../(user)/Header";
import LoginFormAdmin from "./LoginFormAdmin";
import styles from "../../../styles/Admin/admin.module.css";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  //  if (alreadyLoggedIn) {
  //     redirect("/admin");
  //   }

  return (
    <div
      className={`d-flex flex-column min-vh-100 m-0 bg-cover bg-center ${styles.loginBlock}`}
    >
      <Header />

      {/* Main content area */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <LoginFormAdmin />
      </div>

      <Footer />
    </div>
  );
}
