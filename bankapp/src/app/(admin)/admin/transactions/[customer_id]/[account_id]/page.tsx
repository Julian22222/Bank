import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import UserTransactionsDashboard from "./UserTransactionsDashboard";

export default async function AdminUserTransactions({
  params,
}: {
  params: Promise<{ customer_id: string; account_id: string }>;
}) {
  const { customer_id, account_id } = await params;

  const [transactionsRes, accountsRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/transactions/${customer_id}/accounts/${account_id}`,
      { cache: "no-store", next: { tags: ["userTransactionsAdminPage"] } },
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/${customer_id}/accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["userAccountsWithBalanceAdminPage"] },
      },
    ),
  ]);

  if (!transactionsRes.ok) {
    throw new Error("Failed to fetch transactions");
  }

  if (!accountsRes.ok) {
    throw new Error("Failed to fetch accounts");
  }

  const userAccountTransactions = await transactionsRes.json();
  const result: AccountWithBalance[] = await accountsRes.json();

  const userAccountWithBalance = result.find(
    (el: AccountWithBalance) => el.account_id === Number(account_id),
  );

  if (!userAccountWithBalance) {
    throw new Error("Account not found");
  }

  const accountType = userAccountWithBalance.account_type;
  const overDraftAmount = result[0].overdraft_limit ?? 0;

  return (
    <>
      <UserTransactionsDashboard
        userAccountTransactions={userAccountTransactions}
        overDraftAmount={overDraftAmount}
        accountType={accountType}
        accountId={account_id}
      />
    </>
  );
}
