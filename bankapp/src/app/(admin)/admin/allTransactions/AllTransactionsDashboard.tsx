"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/Accounts/accounts.module.css";
import { ITransactionWithDetails } from "../../../../../../shared/types/transactionsWithDetails.interface";
import { useAdmin } from "../../AdminContext";

interface Props {
  allTransactions: ITransactionWithDetails[];
}

export default function AdminUsersDashboard({ allTransactions }: Props) {
  const { activeAdmin } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(allTransactions.length / 20);

  const filteredTransactions = useMemo(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return allTransactions.filter(
        (trx) =>
          trx.first_name.toLowerCase().includes(term) ||
          trx.last_name.toLowerCase().includes(term) ||
          trx.email.toLowerCase().includes(term),
      );
    }

    const start = (page - 1) * 20;
    return allTransactions.slice(start, start + 20);
  }, [searchTerm, page, allTransactions]);

  const clearSearch = () => setSearchTerm("");

  return (
    <>
      {allTransactions.length === 0 && (
        <p className="d-flex justify-content-center align-items-center vh-100">
          No transactions found
        </p>
      )}

      <section className="container bg-white rounded shadow-sm p-4 mb-5">
        {/* SEARCH */}
        <div className="d-flex align-items-center mb-3">
          <div className="position-relative w-25">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              placeholder="Search by name, surname or email..."
            />

            {searchTerm && (
              <button
                onClick={clearSearch}
                className="btn btn-sm btn-outline-danger position-absolute top-50 translate-middle-y"
                style={{ right: "-40px" }}
              >
                X
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Last name</th>
                <th>Account type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((tx: any, i: number) => (
                <tr key={tx.transaction_id} className={styles.row}>
                  <td>
                    {new Date(tx.transaction_id).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>{tx.customer_id}</td>
                  <td>{tx.first_name}</td>
                  <td>{tx.last_name}</td>
                  <td>{tx.account_type}</td>
                  <td>{tx.details}</td>

                  <td
                    className={
                      tx.money_amount.startsWith("-")
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {tx.money_amount.startsWith("-")
                      ? `-£${tx.money_amount.slice(1)}`
                      : `£${tx.money_amount}`}
                  </td>

                  <td>£{tx.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </section>
    </>
  );
}
