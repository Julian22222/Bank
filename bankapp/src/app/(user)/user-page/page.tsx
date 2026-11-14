import { apiServerFetch } from "@/src/lib/api-server";
import UserDashboard from "./UserDashboard";
import { cookies } from "next/headers";

const fetchUserAllTransactionsFromAllAccounts = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  console.log("DEBUG cookie string:", cookieStore.toString());

  try {
    const data = await apiServerFetch(
      `${process.env.BACK_END_URL}/transactions/my`,
      {
        headers: {
          //JwtAuthGuard requires a JWT, If your JWT is stored in a cookie, then req.user
          // Cookie: cookieStore.toString(),
          Cookie: `access_token=${accessToken}`,
        },
        cache: "no-store",
        next: { tags: ["transactions"] },
      },
    );

    //no need do -> return data.json() because apiServerFetch already returns the parsed JSON data

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchAllUserAccountsAndlastBalance = async (mainAccountId: number) => {
  try {
    const userAccountLastBalance = await apiServerFetch(
      `${process.env.BACK_END_URL}/accounts/user/${mainAccountId}/with-balance`,
      {
        cache: "no-store",
        next: { tags: ["userAllAccountsLastBalance"] },
      },
    );

    return userAccountLastBalance;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default async function UserPage() {
  const allUserTransactions = await fetchUserAllTransactionsFromAllAccounts();

  const mainAccountId =
    allUserTransactions[allUserTransactions.length - 1].account_id;

  !mainAccountId && console.log("No mainAccountId");

  const userAllAccLastBalance =
    await fetchAllUserAccountsAndlastBalance(mainAccountId);

  return (
    <UserDashboard
      allUserTransactions={allUserTransactions}
      userAllAccLastBalance={userAllAccLastBalance}
    />
  );
}
