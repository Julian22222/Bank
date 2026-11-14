"use client";

import { useState } from "react";
import { ISaverAccountType } from "../../../../../../shared/types/saverAccountType.interface";
import AddSaverAccountTypesBtn from "./AddSaverAccountTypesBtn";
import AccountTypesFormModule from "./AccountTypesFormModule";
import styles from "../../../../styles/Admin/manage-admins.module.css";

interface Props {
  accountTypes: ISaverAccountType[];
}

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-gray-50 px-4 py-1.5 rounded-md min-w-0 w-full ${className}`}
    >
      <p className="text-gray-500 text-xs leading-tight m-0">{label}</p>
      <p className="font-medium text-gray-800 text-sm leading-tight m-0 break-words">
        {value}
      </p>
    </div>
  );
}

export default function AccountTypesDashboard({ accountTypes }: Props) {
  const [showModule, setShowModule] = useState(false);

  return (
    <div
      className="min-vh-100 py-4 px-3"
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="mb-4">Bank Saving Account Types</h1>

      <ul className="list-none p-0 mt-4 grid gap-3 grid-cols-[repeat(auto-fill,minmax(min(420px,100%),600px))] justify-center">
        {accountTypes.map((accountType) => (
          <li
            key={accountType.account_name}
            className={`bg-white rounded-xl shadow border border-gray-100 p-3 ${styles.block}`}
          >
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Account Name"
                value={accountType.account_name}
                className="col-span-2"
              />
              <Field label="Interest Rate" value={`${accountType.interest}%`} />
              <Field
                label="Max Money Limit"
                value={`£${accountType.money_limit}`}
              />
              <Field
                label="Account Duration"
                value={`${accountType.account_duration} months`}
                className="col-span-2"
              />
            </div>
          </li>
        ))}
      </ul>

      <AddSaverAccountTypesBtn setShowModule={setShowModule} />

      {showModule && <AccountTypesFormModule setShowModule={setShowModule} />}
    </div>
  );
}
