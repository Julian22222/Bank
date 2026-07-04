"use client";

import { IAccount } from "../../../../../../shared/types/account.interface";
import { IUserWithAccount } from "@/src/shared/types/userWithAccount.interface";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdmin } from "../../AdminContext";

interface Props {
  userAccounts: IAccount[];
  userData: IUserWithAccount;
}

export default function AccountTypeBlock({ userAccounts, userData }: Props) {
  const { activeAdmin, setAdminPage_userData } = useAdmin();

  const { push } = useRouter();

  useEffect(() => {
    if (!activeAdmin) {
      push("/admin-login");
    }
  }, [activeAdmin, push]);

  const handleClick = (
    customer_id: number | undefined,
    account_id: number | undefined,
  ) => {
    if (customer_id == null || account_id == null) return;

    setAdminPage_userData(userData);

    push(`/admin/transactions/${customer_id}/${account_id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Account Types</h3>

        <span className="text-sm text-gray-500">
          {userAccounts.length} Accounts
        </span>
      </div>

      <div className="space-y-3">
        {userAccounts.map((account: IAccount) => (
          <div
            key={account.account_id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  {account.account_type}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Account Nr: {account.account_nr}
                </p>
              </div>

              <button
                onClick={() =>
                  handleClick(account.customer_id, account.account_id)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-5 text-sm hover:bg-blue-700 transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
