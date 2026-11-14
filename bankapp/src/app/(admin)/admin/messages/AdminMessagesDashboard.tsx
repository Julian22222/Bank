"use client";

import { useState } from "react";
import { MessageWithUser } from "../../../../shared/types/messageWithUser.interface";
import AdminPageHeader from "../../../../components/AdminPageHeader";
import SideBar from "@/src/components/SideBar";
import ChatArea from "@/src/components/ChatArea";
import { AdminMessageModule } from "@/src/components/AdminMessageModule";
import { ReturnUser } from "@/src/shared/types/returnUser.interface";

type Props = {
  allUsersMessages: MessageWithUser[];
  allUsers: ReturnUser[];
};

export default function AdminUsersDashboard({
  allUsersMessages,
  allUsers,
}: Props) {
  const [findMessage, setFindMessage] = useState<MessageWithUser | null>(null);
  const [showMsgModule, setShowMsgModule] = useState<boolean>(false);

  return (
    <>
      {allUsersMessages.length === 0 && (
        <p className="d-flex justify-content-center align-items-center vh-100">
          No messages found
        </p>
      )}

      {showMsgModule ? (
        <AdminMessageModule
          setShowMsgModule={setShowMsgModule}
          userId={null}
          allUsersData={allUsers}
        />
      ) : (
        <div>
          <AdminPageHeader />

          <div
            className="d-flex min-vh-100"
            style={{
              fontFamily: "Segoe UI, Tahoma, sans-serif",
            }}
          >
            <SideBar
              allMessages={allUsersMessages}
              setFindMessage={setFindMessage}
              fromAdminModule={true}
              setShowMsgModule={setShowMsgModule}
            />

            <ChatArea findMessage={findMessage} fromAdminModule={true} />
          </div>
        </div>
      )}
    </>
  );
}
