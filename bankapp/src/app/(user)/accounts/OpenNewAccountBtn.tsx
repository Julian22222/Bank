"use client";

import { use, useEffect, useRef, useState } from "react";
import { useUser } from "../UserContext";
import { openNewAccountAction } from "../../actions/openNewAccountActions";
import { apiClientFetch } from "@/src/lib/api-client";
import { useRouter } from "next/navigation";
import { ISaverAccountType } from "../../../../../shared/types/saverAccountType.interface";
import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";

export function OpenNewAccountBtn({
  userAllAccounts_withBalance,
  allSaverAccounTypes,
}: {
  userAllAccounts_withBalance: AccountWithBalance[];
  allSaverAccounTypes: ISaverAccountType[];
}) {
  const [open, setOpen] = useState(false);
  const [accountTypes, setAccountTypes] =
    useState<ISaverAccountType[]>(allSaverAccounTypes);

  const router = useRouter();

  // const [loading, setLoading] = useState(false);

  const { activeUser, currUserAllAccounts, setCurrUserAllAccounts } = useUser();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // const accountExists = {
  //   Saver: currUserAllAccounts.some((acc) => acc.account_type === "Saver"),
  //   ISA: currUserAllAccounts.some((acc) => acc.account_type === "ISA"),
  // };

  const handleAccountClick = (accountType: string) => async () => {
    if (!activeUser?.customer_id) return;

    // setLoading(true);

    try {
      const createNewSavingAccount = await openNewAccountAction({
        accountType,
        customer_id: activeUser?.customer_id,
      });

      if (!createNewSavingAccount?.success) {
        alert("Failed to create account");
        return;
      }

      // const accountsRes = await apiClientFetch(
      //   `accounts/user/${activeUser?.customer_id}/accounts-balance`,
      //   // `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/${activeUser?.customer_id}/accounts-balance`,
      // );

      setCurrUserAllAccounts(userAllAccounts_withBalance);
    } catch (error) {
      if (error instanceof Error && error.message === "SESSION_EXPIRED") {
        router.replace("/login");
        return;
      }
      console.error(error);
    } finally {
      // setLoading(false);
      setOpen(false);
    }
  };

  let accountExists: { [key: string]: boolean } = {};

  {
    accountTypes.forEach((accountType) => {
      accountExists[accountType.account_name] = currUserAllAccounts.some(
        (acc) => acc.account_type === accountType.account_name,
      );
    });
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={dropdownRef} className="position-relative d-inline-block">
      {/* Main button */}
      <button
        className="btn fw-bold px-4 py-2 rounded-3"
        style={{ backgroundColor: "#004c3f", color: "white" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        Open New Account
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="position-absolute mt-2 p-2 bg-white border rounded shadow"
          style={{ minWidth: "200px", zIndex: 1000 }}
        >
          <ul className="list-unstyled m-0 p-0">
            {accountTypes.map((accountType) => (
              <li key={accountType.account_name}>
                <button
                  className={`btn btn-outline-success w-100 text-start mb-2 ${
                    accountExists[accountType.account_name]
                      ? "btn-light text-muted disabled"
                      : "btn-outline-success"
                  }`}
                  disabled={accountExists[accountType.account_name]}
                  onClick={handleAccountClick(accountType.account_name)}
                >
                  {accountType.account_name} Account
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
