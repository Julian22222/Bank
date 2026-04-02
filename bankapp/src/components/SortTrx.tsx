"use client";

import { useEffect, useState } from "react";
import { useGlobal } from "../app/Context"; //IMPORT GLOBAL CONTEXT, Global UseState
//
interface Props {}

// type SbtSearch = {
//   description: string;
// };

export default function SortTrx({}: Props) {
  const { currUserTrx, setCurrUserTrx, allTransactions, activeUser } =
    useGlobal();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state

  useEffect(() => {
    if (!activeUser) return;

    // Always filter from the full list
    const filtered = allTransactions.filter(
      (trx) =>
        trx.customer_id === activeUser.customer_id &&
        trx.details.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setCurrUserTrx(filtered.reverse()); // Reverse to show most recent first
  }, [searchTerm]);

  let handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearchTerm(searchTerm);
    console.log("Search Term Submitted:", searchTerm);
  };

  const getAllPosts = () => {
    setSearchTerm("");

    // window.location.reload(); // Simple way to reset the state and reload all transactions
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Search by Description:</label>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts by description"
          />
          {searchTerm && (
            <button type="button" style={xbtn} onClick={getAllPosts}>
              X
            </button>
          )}

          <button type="submit" style={subbtn}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

const subbtn: React.CSSProperties = {
  borderRadius: "5px",
  padding: "5px 10px",
  backgroundColor: "#006a4d",
  color: "white",
  border: "1px solid #004c3f",
  marginLeft: "10px",
};

const xbtn: React.CSSProperties = {
  borderRadius: "5px",
  padding: "5px 10px",
  //   backgroundColor: "#cc0000",
  color: "#cc0000",
  border: "1px solid #cc0000",
  //   marginLeft: "10px",
};
