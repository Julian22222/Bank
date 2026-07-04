import Header from "@/src/app/(user)/Header";
import React from "react";
import LoginForm from "./LoginForm";
import Footer from "@/src/components/Footer";
import styles from "../../../styles/LoginPage/logon.module.css";

export default async function LoginPage() {
  return (
    <div className={`min-vh-100 d-flex flex-column ${styles.mainBlock}`}>
      <Header />

      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <LoginForm />
      </div>

      <Footer />
    </div>
  );
}
