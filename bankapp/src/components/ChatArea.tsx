import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";

export default function ChatArea({
  findMessage,
  fromAdminModule,
}: {
  findMessage: MessageWithUser | null;
  fromAdminModule: boolean;
}) {
  return (
    <div className="flex-grow-1 d-flex flex-column">
      {/* HEADER */}
      <header
        className="p-3 border-bottom fw-semibold bg-white"
        style={{
          backgroundImage: fromAdminModule
            ? "url('/LogInPic/BackgroundPic2.png')"
            : "url('/LogInPic/Login7.jpg')",
        }}
      >
        <div>
          {findMessage
            ? findMessage.msg_subject
            : "Select a message from the list to view details"}
        </div>

        {findMessage && fromAdminModule && (
          <div className="small text-muted fw-normal">
            Sent to: {findMessage.first_name} {findMessage.last_name} (DOB:
            {findMessage?.dob &&
              new Date(findMessage.dob).toLocaleDateString("en-GB")}
            )
          </div>
        )}
      </header>

      {/* MESSAGE BODY */}
      <section className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-2">
        <div
          className="p-3 rounded w-75 pre-wrap"
          style={{
            backgroundColor: "#e9ecef",
          }}
        >
          <div>
            {findMessage ? findMessage.msg_body : "No message selected"}
          </div>

          <div className="small mt-1 opacity-75">
            {findMessage?.sent_at &&
              new Date(findMessage.sent_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
