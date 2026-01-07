import "./user-page.css";

import UserPageHeader from "@/src/app/user-page/UserPageHeader";
import UserBanner from "@/src/app/user-page//UserBanner";
import AccountOverview from "@/src/app/user-page/AccountOverview";
import Savings from "@/src/app/user-page/Savings";
import CreditCard from "@/src/app/user-page/CreditCard";
import Loan from "@/src/app/user-page/Loan";
import RecentTransactions from "@/src/app/user-page/RecentTransactions";
import UserFooter from "@/src/app/user-page/UserFooter";
import QuickActions from "@/src/components/QuickActions";

const fetchAllUsrTransactions = async () => {
  try {
    const data = await fetch("http://localhost:3005/statements");
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
        <AccountOverview />

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

      {/* User Footer */}
      <UserFooter />
    </div>
  );
}
