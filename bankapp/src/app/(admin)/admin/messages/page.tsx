import { MessageWithUser } from "@/src/shared/types/messageWithUser.interface";
import { ReturnUser } from "@/src/shared/types/returnUser.interface";
import AdminUsersDashboard from "./AdminMessagesDashboard";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

async function apiGet(path: string, tag: string) {
  const response = await adminApiServerFetch(
    `${process.env.BACK_END_URL}${path}`,
    {
      cache: "no-store",
      next: { tags: [tag] },
    },
  );

  return response;
}

export default async function AdminMessages() {
  const [messagesData, usersData] = await Promise.all([
    apiGet("/messages", "allUsersMessages"),
    apiGet("/users", "allUsers"),
  ]);

  const allUsersMessages: MessageWithUser[] = messagesData;
  const allUsers: ReturnUser[] = usersData;

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
      <AdminUsersDashboard
        allUsersMessages={allUsersMessages}
        allUsers={allUsers}
      />
    </div>
  );
}
