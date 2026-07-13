"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import AdminPageHeader from "../../../../components/AdminPageHeader";
import SideBar from "@/src/components/SideBar";
import ChatArea from "@/src/components/ChatArea";
import { AdminMessageModule } from "@/src/components/AdminMessageModule";
import { useAdmin } from "../../AdminContext";

interface Props {
  userId: string | null;
  allMessages: MessageWithUser[];
}

export default function AdminUserMessagesDashboard({
  userId,
  allMessages,
}: Props) {
  const [findMessage, setFindMessage] = useState<MessageWithUser | null>(null);
  const [showMsgModule, setShowMsgModule] = useState<boolean>(false);

  return (
    <>
      {showMsgModule ? (
        <AdminMessageModule
          setShowMsgModule={setShowMsgModule}
          userId={userId}
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
