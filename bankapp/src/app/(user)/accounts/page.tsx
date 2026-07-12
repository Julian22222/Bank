import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import AccountsDashboard from "./AccountsDashboard";
import { cookies } from "next/headers";
import { apiFetch } from "@/src/lib/api";

const fetchAllUserAccounts = async (): Promise<AccountWithBalance[]> => {
  const cookieStore = await cookies();

  const response = await apiFetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/my-accounts-balance`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
      next: { tags: ["allAccountsWithBalance"] },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch user data with accounts and balance",
    );
  }

  return data;
};

export default async function CustomerAccountsPage() {
  const userAllAccounts_withBalance = await fetchAllUserAccounts();

  return (
    <AccountsDashboard
      userAllAccounts_withBalance={userAllAccounts_withBalance}
    />
  );
}
