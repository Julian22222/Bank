import AdminPageHeader from "@/src/components/AdminPageHeader";
import AccountTypesDashboard from "./AccountTypesDashboard";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";

export default async function AccountTypesPage() {
  const accountTypes = await adminApiServerFetch(
    `${process.env.BACK_END_URL}/accounts/saver-account/types`,
    {
      next: { tags: ["accountTypes"] },
      cache: "no-store",
    },
  );

  return (
    <>
      <AdminPageHeader />

      <AccountTypesDashboard accountTypes={accountTypes} />
    </>
  );
}
