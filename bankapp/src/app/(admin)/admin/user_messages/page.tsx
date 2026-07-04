import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import AdminUserMessagesDashboard from "./AdminUserMessagesDashboard";
import { notFound } from "next/navigation";

interface Props {
  searchParams: Promise<{ userId: string }>;
}

export default async function AdminCurrentUserMessages({
  searchParams,
}: Props) {
  const params = await searchParams;
  const userId = params.userId;

  if (!userId) {
    // throw new Error("Missing userId");
    notFound();
  }

  const allMessagesWithUser = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/messages/user/${userId}`,
    { cache: "no-store", next: { tags: [`userMessages`] } },
  );

  if (!allMessagesWithUser.ok) {
    throw new Error("Failed to fetch user messages");
  }

  const allMessages: MessageWithUser[] = await allMessagesWithUser.json();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <AdminUserMessagesDashboard userId={userId} allMessages={allMessages} />
    </div>
  );
}
