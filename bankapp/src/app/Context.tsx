"use client";

import React from "react";
import { createContext, useContext, useState } from "react";
import { User } from "../shared/types/user.interface";
import { Transaction } from "../shared/types/transaction.interface";
import { Account } from "../shared/types/account.interface";

interface GlobalContextType {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
  allTransactions: Transaction[];
  setAllTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currUserTrx: Transaction[];
  setCurrUserTrx: React.Dispatch<React.SetStateAction<Transaction[]>>;
  CurrUserAllAccounts: Account[];
  setCurrUserAllAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

const Context = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [activeUser, setActiveUser] = React.useState<User | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currUserTrx, setCurrUserTrx] = useState<Transaction[]>([]);
  const [CurrUserAllAccounts, setCurrUserAllAccounts] = useState<Account[]>([]);

  return (
    <Context.Provider
      value={{
        allUsers,
        setAllUsers,
        activeUser,
        setActiveUser,
        allTransactions,
        setAllTransactions,
        currUserTrx,
        setCurrUserTrx,
        CurrUserAllAccounts,
        setCurrUserAllAccounts,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useGlobal() {
  const context = useContext(Context);
  if (!context) throw new Error("useGlobal must be used inside GlobalProvider");
  return context;
}
