"use client";

import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import { useUser } from "../UserContext";
import { useEffect, useState } from "react";
import UserPageHeader from "../user-page/UserPageHeader";
import SideBar from "../../../components/SideBar";
import ChatArea from "../../../components/ChatArea";

interface Props {
  userAllMessages: MessageWithUser[];
}

export default function MessagesDashboard({ userAllMessages }: Props) {
  const [findMessage, setFindMessage] = useState<MessageWithUser | null>(null);

  return (
    <>
      <UserPageHeader />

      <div
        className="d-flex vh-100"
        style={{
          backgroundImage: "url('/LogInPic/Login7.jpg')",
          fontFamily: "Segoe UI, Tahoma, sans-serif",
        }}
      >
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <SideBar
            allMessages={userAllMessages}
            setFindMessage={setFindMessage}
            fromAdminModule={false}
          />
        </div>

        {/* Chat */}
        <div className="flex-grow-1">
          <ChatArea findMessage={findMessage} fromAdminModule={false} />
        </div>
      </div>
    </>
  );
}
