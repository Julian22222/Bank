"use client";

import { useState } from "react";

import UserPageHeader from "./UserPageHeader";
import UserBanner from "./UserBanner";
import AccountOverview from "./AccountOverview";
import { Savings } from "./Savings";
import CreditCard from "./CreditCard";
import Loan from "./Loan";
import RecentTransactions from "./RecentTransactions";

import QuickActions from "./QuickActions";
import Footer from "@/src/components/Footer";

import { ITransaction } from "../../../../../shared/types/transaction.interface";
import styles from "../../../styles/User-Page/userPage.module.css";

interface Props {
  allUserTransactions: ITransaction[];
}

export default function UserDashboard({ allUserTransactions }: Props) {
  const [showPayModule, setShowPayModule] = useState(false);

  return (
    <>
      <div
        className={`min-vh-100 d-flex flex-column bg-dark bg-opacity-50 ${styles.mainSection}`}
      >
        {/* Header */}
        {!showPayModule && <UserPageHeader />}

        {/* Banner */}
        {!showPayModule && <UserBanner />}

        {/* Main */}
        <main className="flex-grow-1 container py-5">
          {/* Account Overview */}
          <AccountOverview
            allUserTransactions={allUserTransactions}
            showPayModule={showPayModule}
            setShowPayModule={setShowPayModule}
          />

          {/* Other sections */}
          {!showPayModule && (
            <>
              <div className="d-flex flex-wrap gap-4 mb-5">
                <Savings />
                <CreditCard />
                <Loan />
              </div>

              <RecentTransactions allUserTransactions={allUserTransactions} />

              <QuickActions />
            </>
          )}
        </main>

        {!showPayModule && <Footer />}
      </div>
    </>
  );
}
