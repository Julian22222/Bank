import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import UserTransactionsDashboard from "./UserTransactionsDashboard";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

export default async function AdminUserTransactions({
  params,
}: {
  params: Promise<{ customer_id: string; account_id: string }>;
}) {
  const { customer_id, account_id } = await params;

  const [userAccountTransactions, accountsRes] = await Promise.all([
    adminApiServerFetch(
      `${process.env.BACK_END_URL}/transactions/${customer_id}/accounts/${account_id}`,
      { cache: "no-store", next: { tags: ["userTransactionsAdminPage"] } },
    ),
    adminApiServerFetch(
      `${process.env.BACK_END_URL}/accounts/user/${customer_id}/accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["userAccountsWithBalanceAdminPage"] },
      },
    ),
  ]);

  // const userAccountTransactions = await transactionsRes.json();
  // const result: AccountWithBalance[] = await accountsRes.json();

  const userAccountWithBalance = accountsRes.find(
    (el: AccountWithBalance) => el.account_id === Number(account_id),
  );

  if (!userAccountWithBalance) {
    throw new Error("Account not found");
  }

  const accountType = userAccountWithBalance.account_type;
  const overDraftAmount = accountsRes[0].overdraft_limit ?? 0;

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
