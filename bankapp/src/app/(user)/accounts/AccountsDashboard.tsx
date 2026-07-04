"use client";

import { useEffect, useState } from "react";
import { EditUserModule } from "./EditUserModule";
import { EditUserPasswordModule } from "./EditUserPasswordModule";
import { HelpAndGuidance } from "./Help&Guidance";
import Footer from "@/src/components/Footer";
import UserPageHeader from "../user-page/UserPageHeader";
import { AccountWithBalance } from "@/src/shared/types/account_withBalance.interface";
import LeftSideAccounts from "./LeftSideAccounts";
import RightSideAccounts from "./RightSideAccounts";

export default function AccountsDashboard({
  userAllAccounts_withBalance,
}: {
  userAllAccounts_withBalance: AccountWithBalance[];
}) {
  const [showEditUserModule, setShowEditUserModule] = useState(false);
  const [showChangePasswordModule, setShowChangePasswordModule] =
    useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  useEffect(() => {
    if (passwordChangeSuccess) {
      const timer = setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [passwordChangeSuccess]);

  if (showEditUserModule) {
    return <EditUserModule setShowEditUserModule={setShowEditUserModule} />;
  }

  if (showChangePasswordModule) {
    return (
      <EditUserPasswordModule
        setShowChangePasswordModule={setShowChangePasswordModule}
        setPasswordChangeSuccess={setPasswordChangeSuccess}
      />
    );
  }

  return (
    <>
      {passwordChangeSuccess && (
        <div className="alert alert-success position-absolute top-0 start-50 translate-middle-x mt-3">
          Password updated successfully!
        </div>
      )}

      <div
        className="min-vh-100"
        style={{
          backgroundImage: "url('/LogInPic/Login7.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <UserPageHeader />

        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-11">
              <div className="row g-4">
                {/* LEFT SIDE - ACCOUNTS */}
                <LeftSideAccounts
                  userAllAccounts_withBalance={userAllAccounts_withBalance}
                />

                {/* RIGHT SIDE - USER DETAILS */}
                <RightSideAccounts
                  setShowEditUserModule={setShowEditUserModule}
                  setShowChangePasswordModule={setShowChangePasswordModule}
                />
              </div>

              <hr className="my-4" />
            </div>
            <HelpAndGuidance />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
