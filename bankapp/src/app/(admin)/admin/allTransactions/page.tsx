import AdminPageHeader from "../../../../components/AdminPageHeader";
import TransactionsTitle from "./TransactionsTitle";
import Footer from "../../../../components/AdminFooter";
import styles from "../../../../styles/Accounts/accounts.module.css";
import AdminUsersDashboard from "./AllTransactionsDashboard";
import { ITransactionWithDetails } from "../../../../../../shared/types/transactionsWithDetails.interface";

export default async function AllTransactions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions/with-details`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transactions with details");
  }

  const allTransactions: ITransactionWithDetails[] = await res.json();

  return (
    <div
      className="min-vh-100"
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AdminPageHeader />
      <TransactionsTitle />

      <AdminUsersDashboard allTransactions={allTransactions} />

      <Footer />
    </div>
  );
}
