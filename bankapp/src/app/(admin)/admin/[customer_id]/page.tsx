import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import AdminUserDashboard from "./AdminUserDashboard";

export default async function UsersData({
  params,
}: {
  params: Promise<{ customer_id: string }>;
}) {
  const { customer_id } = await params;

  const [userData, currentUserAccounts] = await Promise.all([
    adminApiServerFetch(`${process.env.BACK_END_URL}/users/${customer_id}`, {
      cache: "no-store",
      next: { tags: ["userData-Page"] },
    }),
    adminApiServerFetch(
      `${process.env.BACK_END_URL}/accounts/user/${customer_id}/accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["userAccounts-Page"] },
      },
    ),
  ]);

  return (
    <div
      style={{
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AdminUserDashboard
        userData={userData}
        currentUserAccounts={currentUserAccounts}
      />
    </div>
  );
}
