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
  const { currUserAllAccounts, activeUser, currUserTrx } = useUser();

  // console.log("activeUser from SORTTRX", activeUser);
  // console.log("currUserAllAccounts from SORTTRX", currUserAllAccounts);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const searchedTransactions = useMemo(() => {
    if (!activeUser) return [];

    const userAccount = currUserAllAccounts.find(
      (acc) => acc.account_type === account_type,
    );

    if (!userAccount) return [];

    const search = searchTerm.toLowerCase();

    return allTransactions.filter(
      (trx) =>
        trx.account_id === userAccount.account_id &&
        trx.details?.toLowerCase().includes(search),
    );
  }, [
    searchTerm,
    allTransactions,
    currUserAllAccounts,
    account_type,
    activeUser,
  ]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * 20;

    return searchedTransactions.slice(start, start + 20);
  }, [searchedTransactions, page]);

  useEffect(() => {
    setPageCount(Math.ceil(allTransactions.length / 20));
  }, [searchedTransactions]);

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
          sortedTrx={paginatedTransactions}
          account_type={account_type}
        />

        {/* PAGINATION */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {page > 1 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage(page - 1)}
            >
              {page - 1}
            </button>
          )}

          <button className="btn btn-primary btn-sm fw-bold">{page}</button>

          {page < pageCount && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage(page + 1)}
            >
              {page + 1}
            </button>
          )}

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === pageCount}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
