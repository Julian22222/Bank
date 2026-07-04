"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser } from "../../../UserContext";
import TransactionClient from "./TransactionClient";
import { ITransaction } from "../../../../../../../shared/types/transaction.interface";

type Props = {
  account_type: string;
  allTransactions: ITransaction[];
};

export default function SortTrx({ account_type, allTransactions }: Props) {
  const { currUserAllAccounts } = useUser();

  const { activeUser } = useUser();

  // console.log("activeUser from SORTTRX", activeUser);
  // console.log("currUserAllAccounts from SORTTRX", currUserAllAccounts);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredTransactions = useMemo(() => {
    if (!activeUser) return [];

    const userAccount = currUserAllAccounts.find(
      (acc) => acc.account_type === account_type,
    );

    if (!userAccount) return [];

    const userAccountId = userAccount?.account_id;

    // console.log("allTransactions", allTransactions);

    return allTransactions.filter(
      (trx) =>
        trx.customer_id === activeUser?.customer_id &&
        trx.account_id === userAccountId &&
        (trx.details || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [
    searchTerm,
    allTransactions,
    activeUser,
    currUserAllAccounts,
    account_type,
  ]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      {allTransactions.length === 0 && <p>No transactions found</p>}

      <div>
        {/* Search box */}
        <div
          className="d-flex align-items-center gap-2 mb-3"
          style={{ maxWidth: "350px" }}
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="form-control"
          />

          {searchTerm && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </div>

        {/* Transactions */}
        <TransactionClient
          sortedTrx={filteredTransactions}
          account_type={account_type}
        />
      </div>
    </>
  );
}
