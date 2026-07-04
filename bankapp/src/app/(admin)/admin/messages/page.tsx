import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import AdminUsersDashboard from "./AdminMessagesDashboard";

export default async function AdminMessages() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/messages`,
    { cache: "no-store", next: { tags: ["allUsersMessages"] } },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const allUsersMessages: MessageWithUser[] = await response.json();

  return (
    <div
      className="min-vh-100 w-100"
      style={{
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AdminUsersDashboard allUsersMessages={allUsersMessages} />
    </div>
  );
}
