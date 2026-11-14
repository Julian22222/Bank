import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import AdminUserMessagesDashboard from "./AdminUserMessagesDashboard";
import { notFound } from "next/navigation";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

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

  const allMessagesWithUser: MessageWithUser[] = await adminApiServerFetch(
    `${process.env.BACK_END_URL}/messages/user/${userId}`,
    { cache: "no-store", next: { tags: [`userMessages`] } },
  );

  const allUsersData = await adminApiServerFetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/users`,
  );

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
      <AdminUserMessagesDashboard
        userId={userId}
        allMessages={allMessagesWithUser}
        allUsersData={allUsersData}
      />
    </div>
  );
}
