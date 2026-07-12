"use client";

import React from "react";
import { createContext, useContext, useState } from "react";
import { IUserWithAccount } from "../../shared/types/userWithAccount.interface";
import { ITransaction } from "../../../../shared/types/transaction.interface";
import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";

interface UserContextType {
  activeUser: IUserWithAccount | null;
  setActiveUser: React.Dispatch<React.SetStateAction<IUserWithAccount | null>>;
  currUserTrx: ITransaction[];
  setCurrUserTrx: React.Dispatch<React.SetStateAction<ITransaction[]>>;
  currUserAllAccounts: AccountWithBalance[];
  setCurrUserAllAccounts: React.Dispatch<
    React.SetStateAction<AccountWithBalance[]>
  >;
  userAccountType: string | null;
  setUserAccountType: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  initialUser,
  initialUserAllAccounts,
  initialUserAllTransactions,
  children,
}: {
  initialUser: IUserWithAccount | null;
  initialUserAllAccounts: AccountWithBalance[] | null;
  initialUserAllTransactions: ITransaction[] | null;
  children: React.ReactNode;
}) {
  const [activeUser, setActiveUser] = useState(initialUser);

  const [currUserTrx, setCurrUserTrx] = useState<ITransaction[]>(
    initialUserAllTransactions ?? [],
  );
  const [currUserAllAccounts, setCurrUserAllAccounts] = useState<
    AccountWithBalance[]
  >(initialUserAllAccounts ?? []);
  const [userAccountType, setUserAccountType] = useState<string | null>(null);

  const value = React.useMemo(
    () => ({
      activeUser,
      setActiveUser,
      currUserTrx,
      setCurrUserTrx,
      currUserAllAccounts,
      setCurrUserAllAccounts,
      userAccountType,
      setUserAccountType,
    }),
    [activeUser, currUserTrx, currUserAllAccounts, userAccountType],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}

//// ⚠️ Important limitation
// If user changes (logout/login), you must update:
//setUser(newUser)
//Because Context does NOT automatically sync with cookie.
