import SortTrx from "@/src/app/(user)/transactions/[account_type]/[last_name]/SortTrx";
import UserPageHeader from "../../../user-page/UserPageHeader";
import Footer from "@/src/components/Footer";

const fetchAllUsrTransactions = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions`,
      {
        next: { tags: ["transactions"] },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch transactions");
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default async function StatementPage({
  params,
}: {
  params: Promise<{ account_type: string; last_name: string }>;
}) {
  const { account_type } = await params;

  const allTransactions = await fetchAllUsrTransactions();

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundImage: "url('/LogInPic/Login7.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <UserPageHeader />

      {/* Content */}
      <main className="flex-grow-1 container py-5">
        <div className="bg-white rounded shadow-sm p-4">
          <SortTrx
            account_type={account_type}
            allTransactions={allTransactions}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
