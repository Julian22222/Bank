import SortTrx from "@/src/app/(user)/transactions/[account_type]/[last_name]/SortTrx";
import UserPageHeader from "../../../user-page/UserPageHeader";
import Footer from "@/src/components/Footer";
import { cookies } from "next/headers";
import { apiFetch } from "@/src/lib/api";

const fetchAllUsrTransactions = async () => {
  const cookieStore = await cookies();

  try {
    const res = await apiFetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions/my`,
      {
        headers: {
          //JwtAuthGuard requires a JWT, If your JWT is stored in a cookie, then req.user. Needs this code
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",

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
  params: Promise<{ account_type?: string; last_name: string }>;
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
            account_type={account_type || "Main"}
            allTransactions={allTransactions}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
