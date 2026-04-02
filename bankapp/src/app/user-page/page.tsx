import "./user-page.css";

import UserPageHeader from "@/src/app/user-page/UserPageHeader";
import UserBanner from "@/src/app/user-page//UserBanner";
import AccountOverview from "@/src/app/user-page/AccountOverview";
import Savings from "@/src/app/user-page/Savings";
import CreditCard from "@/src/app/user-page/CreditCard";
import Loan from "@/src/app/user-page/Loan";
import RecentTransactions from "@/src/app/user-page/RecentTransactions";
import QuickActions from "@/src/components/QuickActions";
import Footer from "@/src/components/Footer";
require("dotenv").config();

// If user-page/page.tsx fetchAllusersTransactions and i need this data in AccountOverview and RecentTransactions (in 2 client components),
// i need to fetch data first in Page.tsx and pass this data -(allTx) down as props to both components,
// This way, both components can access the same transaction data without needing to fetch it separately, improving performance and ensuring consistency across your application.
//No, you don't need to setAllTransactions in AccountOverview and RecentTransactions components. You can set Set global state in one place (AccountOverview.tsx):
//But filter in AccountOverview and RecentTransactions components directly from allTx - from passed props (no need to wait for global state update).
//Why This Works? - comes from server component, Immediate filtering: Uses allTx directly, avoiding async state update delays from Global state,
const fetchAllUsrTransactions = async () => {
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/statements`,
    );
    return data.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export default async function UserPage() {
  let allTx = await fetchAllUsrTransactions();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f8f8",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <UserPageHeader />

      {/* User Banner */}
      <UserBanner />

      {/* Main Dashboard */}
      <main
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Account Overview */}
        <AccountOverview allTx={allTx} />

        {/* Savings & Credit Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            marginBottom: "40px",
          }}
        >
          {/* Savings */}
          <Savings />

          {/* Credit Card */}
          <CreditCard />

          {/* Loan */}
          <Loan />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions allTx={allTx} />

        {/* Quick Actions */}
        <QuickActions />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
