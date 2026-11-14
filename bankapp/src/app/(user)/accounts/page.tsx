import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import AccountsDashboard from "./AccountsDashboard";
import { apiServerFetch } from "@/src/lib/api-server";

const fetchUserAllAccountsWithBalance = async (): Promise<
  AccountWithBalance[]
> => {
  try {
    const data = await apiServerFetch(
      `${process.env.BACK_END_URL}/accounts/my-accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["allAccountsWithBalance"] },
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchAllSeverAccountTypes = async () => {
  try {
    const data = await apiServerFetch(
      `${process.env.BACK_END_URL}/accounts/saver-account/types`,
      {
        cache: "no-store",
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default async function CustomerAccountsPage() {
  const [userAllAccounts_withBalance, allSaverAccounTypes] = await Promise.all([
    fetchUserAllAccountsWithBalance(),
    fetchAllSeverAccountTypes(),
  ]);

  return (
    <AccountsDashboard
      userAllAccounts_withBalance={userAllAccounts_withBalance}
      allSaverAccounTypes={allSaverAccounTypes}
    />
  );
}
