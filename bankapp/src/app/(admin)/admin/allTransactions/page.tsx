import AdminPageHeader from "../../../../components/AdminPageHeader";
import TransactionsTitle from "./TransactionsTitle";
import Footer from "../../../../components/AdminFooter";
import AdminUsersDashboard from "./AllTransactionsDashboard";
import { ITransactionWithDetails } from "../../../../../../shared/types/transactionsWithDetails.interface";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

export default async function AllTransactions() {
  const allTransactions: ITransactionWithDetails[] = await adminApiServerFetch(
    `${process.env.BACK_END_URL}/transactions/with-details`,
    {
      cache: "no-store",
    },
  );

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
