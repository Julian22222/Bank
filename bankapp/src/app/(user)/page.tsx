import Header from "@/src/app/(user)/Header";
import LogOnSection from "@/src/app/(user)/LogOnSection";
import Footer from "../../components/Footer";
import React from "react";
import OtherBlocks from "./OtherBlocks";
import styles from "../../styles/FirstPage/firstPage.module.css";

export default function Home() {
  return (
    <div className={`text-dark ${styles.mainSection}`}>
      <Header />

      <LogOnSection />

      <OtherBlocks />

      <Footer />
    </div>
  );
}
