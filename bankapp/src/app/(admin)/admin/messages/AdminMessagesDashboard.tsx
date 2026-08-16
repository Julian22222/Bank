"use client";

import { useState } from "react";
import { MessageWithUser } from "../../../../shared/types/messageWithUser.interface";
import AdminPageHeader from "../../../../components/AdminPageHeader";
import SideBar from "@/src/components/SideBar";
import ChatArea from "@/src/components/ChatArea";
import { AdminMessageModule } from "@/src/components/AdminMessageModule";

type Props = {
  allUsersMessages: MessageWithUser[];
};

export default function AdminUsersDashboard({ allUsersMessages }: Props) {
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
        <AdminMessageModule setShowMsgModule={setShowMsgModule} userId={null} />
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
