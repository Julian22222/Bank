"use client";

import Link from "next/link";
import { useUser } from "../UserContext";
import { useEffect, useState } from "react";
import { ITransaction } from "../../../../../shared/types/transaction.interface";

interface Props {
  allUserTransactions: ITransaction[];
}

export default function RecentTransactions({ allUserTransactions }: Props) {
  const { userAccountType, currUserAllAccounts } = useUser();

  const { activeUser } = useUser();

  const [lastFiveTxns, setLastFiveTxns] = useState<ITransaction[]>([]);

  const fetchAllUsrTransactions = (allTx: ITransaction[]) => {
    const accountID = currUserAllAccounts.find(
      (account) => account.account_type === userAccountType,
    )?.account_id;

    const userTx = allTx.filter(
      (tx: ITransaction) => tx.account_id === accountID,
    );

    const formatedUserTx = userTx.map((tx: ITransaction) => ({
      ...tx,
      transaction_date: new Date(tx.transaction_date || "").toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    }));

    setLastFiveTxns(formatedUserTx.slice(0, 5));
  };

  useEffect(() => {
    fetchAllUsrTransactions(allUserTransactions);
  }, [activeUser, allUserTransactions]);

  return (
    <section className="bg-white rounded shadow-sm p-4 mb-5">
      <h3 className="text-success mb-3">Recent Transactions</h3>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {lastFiveTxns.map((t, i) => (
              <tr key={i}>
                <td>{t.transaction_date}</td>
                <td>{t.details}</td>

                <td
                  className="fw-bold"
                  style={{
                    color: Number(t.money_amount) < 0 ? "red" : "#006a4d",
                  }}
                >
                  {Number(t.money_amount) < 0 ? "-" : ""}£
                  {Math.abs(Number(t.money_amount)).toFixed(2)}
                </td>

                <td>£{t.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-2">
        <Link
          href={`/transactions/${userAccountType}/${activeUser?.last_name}`}
          className="fw-bold text-decoration-none text-success"
        >
          View All Transactions
        </Link>
      </div>
    </section>
  );
}
