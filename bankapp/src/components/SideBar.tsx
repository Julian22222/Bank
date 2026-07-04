"use client";

import SearchComponent from "@/src/components/SearchComponent";
import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import { useEffect, useMemo, useState } from "react";
import { handleAdminMessageDeletion } from "../app/actions/adminMessageDeleteAction";
import styles from "@/src/styles/Components/components.module.css";
import { handleReadMessage } from "../app/actions/handleReadMessageActions";

interface Props {
  allMessages: MessageWithUser[] | null;
  setFindMessage?: React.Dispatch<React.SetStateAction<MessageWithUser | null>>;
  fromAdminModule: boolean;
  setShowMsgModule?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideBar({
  allMessages,
  setFindMessage,
  fromAdminModule,
  setShowMsgModule,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [messages, setMessages] = useState<MessageWithUser[] | null>([]);

  useEffect(() => {
    setMessages(allMessages);
  }, [allMessages]);

  const filteredMessages = useMemo(() => {
    if (!Array.isArray(messages)) return [];

    let all_msg = [...messages];

    if (searchTerm.trim() === "") return all_msg;

    return all_msg.filter((message) =>
      message.msg_subject.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [messages, searchTerm]);

  const handleClick = async (messageId: number | undefined) => {
    if (messageId === undefined) return;

    const selectedMessage =
      messages?.find((msg) => msg.message_id === messageId) || null;

    setFindMessage?.(selectedMessage);

    if (!selectedMessage) return;

    //mark is_read === true only for user clicks,
    //optimistic rendering.
    if (!fromAdminModule) {
      setMessages((prev) =>
        prev
          ? prev.map((m) =>
              m.message_id === messageId ? { ...m, is_read: true } : m,
            )
          : prev,
      );
    }

    //mark is_read === true only for user clicks
    if (!selectedMessage.is_read && !fromAdminModule) {
      const markAsRead = await handleReadMessage(messageId);

      if (!markAsRead?.success) {
        console.log("Failed to mark message as read");
      }
    } else {
      console.log("Message already marked as read");
    }
  };

  const deleteMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const message_id = Number(event.currentTarget.name);

    const response = await handleAdminMessageDeletion(message_id);

    if (!allMessages || !response?.success) return;

    setFindMessage?.(null);
  };

  return (
    <div
      className="d-flex flex-column border-end ps-3 h-100"
      style={{
        width: "320px",
        minWidth: "320px",
        flexShrink: 0,
        minHeight: "100vh",
        background: fromAdminModule
          ? "url('/LogInPic/BackgroundPic2.png')"
          : "url('/LogInPic/Login7.jpg')",
      }}
    >
      {/* HEADER */}
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <p className="m-0 fw-semibold fs-5">Messages</p>

        {fromAdminModule && (
          <button
            onClick={() => setShowMsgModule?.(true)}
            className="btn btn-sm btn-outline-secondary rounded-pill fs-5"
          >
            📨
          </button>
        )}
      </div>

      {/* SEARCH */}
      <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* LIST */}
      <div className="flex-grow-1 overflow-auto">
        {filteredMessages?.length ? (
          <ul className="list-unstyled m-0">
            {filteredMessages.map((message) => (
              <li
                key={message.message_id}
                className={styles.messageItem}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="d-flex justify-content-between p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(message.message_id)}
                >
                  <div>
                    <div
                      className={
                        message.is_read
                          ? "fw-normal text-secondary"
                          : "fw-semibold"
                      }
                    >
                      {message.msg_subject}
                    </div>

                    <div
                      className={
                        message.is_read
                          ? "text-muted small text-secondary"
                          : "text-muted small fw-bold"
                      }
                    >
                      {message.msg_body.length > 25
                        ? message.msg_body.substring(0, 30) + "..."
                        : message.msg_body}
                    </div>
                  </div>

                  {fromAdminModule && (
                    <button
                      className={`btn btn-sm ${styles["delete-btn"]}`}
                      name={String(message.message_id)}
                      onClick={deleteMessage}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3">No messages available</div>
        )}
      </div>
    </div>
  );
}
