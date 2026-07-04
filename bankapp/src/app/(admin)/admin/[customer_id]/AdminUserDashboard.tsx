"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "../../../../components/AdminPageHeader";
import AccountTypeBlock from "./AccountTypeBlock";
import { ReturnUser } from "@/src/shared/types/returnUser.interface";
import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import AdminEditUser from "./AdminEditUserModule";
import Link from "next/link";
import AdminEditUserPassword from "./AdminEditUserPasswordModule";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

interface Props {
  userData: ReturnUser;
  currentUserAccounts: AccountWithBalance[];
}

export default function AdminUserDashboard({
  userData,
  currentUserAccounts,
}: Props) {
  const [userAccounts, setUserAccounts] = useState<AccountWithBalance[]>([]);
  const [showModule, setShowModule] = useState<boolean>(false);
  const [showPasswordModule, setShowPasswordModule] = useState<boolean>(false);

  useEffect(() => {
    if (showModule) return;

    setUserAccounts(currentUserAccounts);
  }, [showModule]);

  return (
    <>
      {/* <AdminPageHeader /> */}
      {showModule && userData ? (
        <AdminEditUser setShowModule={setShowModule} userData={userData} />
      ) : null}

      {/* <AdminPageHeader /> */}
      {showPasswordModule && (
        <AdminEditUserPassword
          setShowPasswordModule={setShowPasswordModule}
          userData={userData}
        />
      )}

      {!userData && (
        <p className="d-flex justify-content-center align-items-center vh-100">
          Loading...
        </p>
      )}

      {userData && !showModule && !showPasswordModule ? (
        <div className="p-8">
          <AdminPageHeader />
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-5 mb-0 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {userData.first_name} {userData.last_name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Customer ID: {userData.customer_id}
                </p>
              </div>

              <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                Active User
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{userData.email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-800">{userData.phone}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <p className="text-gray-500 mb-1">Address</p>
                <p className="font-medium text-gray-800">
                  {userData.customer_address}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Date of Birth</p>
                <p className="font-medium text-gray-800">
                  {formatDate(userData.dob)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Created At</p>
                <p className="font-medium text-gray-800">
                  {formatDate(userData.created_at)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-center gap-3">
                <p className="text-gray-500 mb-1">Phone verified</p>
                <span className="font-medium text-gray-800">
                  {userData.phone_verified ? "✔️" : "❌"}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-center gap-3">
                <p className="text-gray-500 m-1">Email verified</p>
                <span className="font-medium text-gray-800">
                  {userData.email_verified ? "✔️" : "❌"}
                </span>
              </div>

              <button
                onClick={() => setShowModule(true)}
                className="bg-primary text-white fs-6 py-2 px-3 rounded-4 border-0 cursor-pointer"
                style={{
                  transition: "background-color 0.3s ease",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => setShowPasswordModule(true)}
                className="bg-primary text-white fs-6 py-2 px-3 rounded-4 border-0 cursor-pointer"
                style={{
                  transition: "background-color 0.3s ease",
                }}
              >
                Edit password
              </button>
            </div>

            <hr />
            <br />

            {/* Accounts Section */}
            <AccountTypeBlock userAccounts={userAccounts} userData={userData} />

            <br />
            <hr />
            <br />

            {/* Messages and Chats Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Messages and Chats
                </h3>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        See all messages to user or send new message
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Notification of Important Updates within our Bank
                      </p>
                    </div>
                    <Link
                      href={`/admin/user_messages?userId=${userData.customer_id}`}
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-5 text-sm hover:bg-blue-700 transition text-decoration-none"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Start a Chat with the user
                      </p>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-5 text-sm hover:bg-blue-700 transition">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
