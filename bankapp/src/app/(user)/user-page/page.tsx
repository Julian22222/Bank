import UserDashboard from "./UserDashboard";
import { cookies } from "next/headers";

const fetchAllUsrTransactions = async () => {
  const cookieStore = await cookies();

  try {
    const res = await fetch(
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
    throw new Error("Unexpected error occured");
  }
};

export default async function UserPage() {
  const allUserTransactions = await fetchAllUsrTransactions();

  return <UserDashboard allUserTransactions={allUserTransactions} />;
}
