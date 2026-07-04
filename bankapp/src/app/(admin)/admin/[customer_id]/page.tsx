import AdminUserDashboard from "./AdminUserDashboard";

export default async function UsersData({
  params,
}: {
  params: Promise<{ customer_id: string }>;
}) {
  const { customer_id } = await params;

  const [userResponse, accountsResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/users/${customer_id}`, {
      cache: "no-store",
      next: { tags: ["userData-Page"] },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/${customer_id}/accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["userAccounts-Page"] },
      },
    ),
  ]);

  const [userData, currentUserAccounts] = await Promise.all([
    userResponse.json(),
    accountsResponse.json(),
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
