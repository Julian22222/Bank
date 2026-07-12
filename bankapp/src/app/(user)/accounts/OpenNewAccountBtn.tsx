"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "../UserContext";
import { openNewAccountAction } from "../../actions/openNewAccountActions";
import { apiFetch } from "@/src/lib/api";

export function OpenNewAccountBtn() {
  const [open, setOpen] = useState(false);
  const [accountExists, setAccountExists] = useState({
    Saver: false,
    ISA: false,
  });
  const [loading, setLoading] = useState(false);

  const { activeUser, currUserAllAccounts, setCurrUserAllAccounts } = useUser();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAccountClick = (accountType: string) => async () => {
    if (!activeUser?.customer_id) return;

    setLoading(true);

    try {
      const createNewSavingAccount = await openNewAccountAction({
        accountType,
        customer_id: activeUser?.customer_id,
      });

      if (!createNewSavingAccount?.success) {
        alert("Failed to create account");
        return;
      }

      const accountsRes = await apiFetch(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/${activeUser?.customer_id}/accounts-balance`,
      );

      const data = await accountsRes.json();

      if (!accountsRes.ok) {
        throw new Error(data.message || "Failed to fetch accounts");
      }

      setCurrUserAllAccounts(data);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const newState = { Saver: false, ISA: false };

    currUserAllAccounts.forEach((acc) => {
      if (acc.account_type === "Saver") newState.Saver = true;
      if (acc.account_type === "ISA") newState.ISA = true;
    });

    setAccountExists(newState);
  }, [currUserAllAccounts]);

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
          {/* Saver */}
          <button
            className={`btn w-100 text-start mb-2 ${
              accountExists.Saver
                ? "btn-light text-muted disabled"
                : "btn-outline-success"
            }`}
            onClick={handleAccountClick("Saver")}
            disabled={accountExists.Saver}
          >
            Open Saver Account
          </button>

          {/* ISA */}
          <button
            className={`btn w-100 text-start ${
              accountExists.ISA
                ? "btn-light text-muted disabled"
                : "btn-outline-success"
            }`}
            onClick={handleAccountClick("ISA")}
            disabled={accountExists.ISA}
          >
            Open ISA Account
          </button>
        </div>
      )}
    </div>
  );
}
