"use client";

import { useState } from "react";
import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import AdminPageHeader from "../../../../components/AdminPageHeader";
import SideBar from "@/src/components/SideBar";
import ChatArea from "@/src/components/ChatArea";
import { AdminMessageModule } from "@/src/components/AdminMessageModule";
import { ReturnUser } from "@/src/shared/types/returnUser.interface";

interface Props {
  userId: string | null;
  allMessages: MessageWithUser[];
  allUsersData: ReturnUser[];
}

export default function AdminUserMessagesDashboard({
  userId,
  allMessages,
  allUsersData,
}: Props) {
  const [findMessage, setFindMessage] = useState<MessageWithUser | null>(null);
  const [showMsgModule, setShowMsgModule] = useState<boolean>(false);

  return (
    <>
      {showMsgModule ? (
        <AdminMessageModule
          setShowMsgModule={setShowMsgModule}
          userId={userId}
          allUsersData={allUsersData}
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
              allMessages={allMessages}
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
