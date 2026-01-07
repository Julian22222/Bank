"use client";

import { useState } from "react";
import { Transaction } from "../shared/types/transaction.interface";
import { useGlobal } from "../app/Context"; //IMPORT GLOBAL CONTEXT, Global UseState
import { addPayment } from "../app/actions/payModuleActions";

interface Props {
  setShowPayModule: React.Dispatch<React.SetStateAction<boolean>>;
  additionalParam: string;
}

export function PayModule({ setShowPayModule, additionalParam }: Props) {
  const { activeUser, CurrUserAllAccounts, currUserTrx } = useGlobal();

  console.log(
    "currUserTrx from paymodule",
    currUserTrx[currUserTrx.length - 1]
  );

  //   const [data, setData] = useState<Transaction>({
  //     account_id: 0,
  //     customer_id: 0,
  //     money_amount: "",
  //     balance: "",
  //     transaction_date: "",
  //     details: "",
  //   });

  return (
    <div style={mainPayModule}>
      <form style={formContainer} action={addPayment}>
        {/*  */}
        <input type="hidden" name="additionalParam" value={additionalParam} />
        <input type="hidden" name="userId" value={activeUser?.customer_id} />
        {/* hidden input to pass customer_id to ->  addPayment function*/}
        <input
          type="hidden"
          name="accountId"
          value={CurrUserAllAccounts[0]?.account_id}
        />
        {/* hidden input to pass account_id to ->  addPayment function */}
        <input
          type="hidden"
          name="accountType"
          value={CurrUserAllAccounts[0]?.account_type}
        />
        {/* hidden input to pass account_type to ->  addPayment function */}
        <input
          type="hidden"
          name="accountNumber"
          value={CurrUserAllAccounts[0]?.account_nr}
        />
        {/* hidden input to pass account_nr to ->  addPayment function */}
        <input
          type="hidden"
          name="LastBalance"
          value={currUserTrx[currUserTrx?.length - 1]?.balance}
        />
        {/* hidden input to pass currrent User last transaction balance to ->  addPayment function  */}

        <h2
          style={{
            color: "white",
            marginBottom: "20px",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          {additionalParam}
        </h2>
        <button style={XModuleBtn} onClick={() => setShowPayModule(false)}>
          X
        </button>
        <label htmlFor="payee">Payee:</label>
        <input type="text" id="payee" name="payee" required />
        <br />
        <label htmlFor="amount">Amount:</label>
        <input type="text" id="money_amount" name="money_amount" required />
        <br />
        <label htmlFor="details">Description:</label>
        <input type="text" id="details" name="details" required />
        <br />
        <button style={payBtn} type="submit">
          Pay
        </button>
      </form>
    </div>
  );
}

const mainPayModule: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  //   backdropFilter: "blur(8px)", // <--- BLUR EFFECT
  //   WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // ensure it stays on top
};

const formContainer: React.CSSProperties = {
  position: "relative",
  background: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(3px)",
  border: "2px solid #004c3f",
  borderRadius: "10px",
  padding: "30px",
  color: "white",
  fontSize: "18px",
  height: "250px",
};

const XModuleBtn: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  fontSize: "24px",
  color: "white",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const payBtn: React.CSSProperties = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  fontSize: "24px",
  color: "white",
  background: "none",
  border: "1px solid #004c3f",
  cursor: "pointer",
  padding: "5px 15px",
  borderRadius: "10px",
};
