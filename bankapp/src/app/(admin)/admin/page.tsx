import ActiveChats from "./ActiveChats";
import AdminPageHeader from "../../../components/AdminPageHeader";
import Footer from "../../../components/AdminFooter";
import NewUserRegistration from "./NewUserRegistration";
import WelcomeAdmin from "./WelcomeAdmin";
import AdminTitle from "./AdminTitle";
import styles from "../../../styles/Admin/admin.module.css";
import ManageAdmins from "./ManageAdmins";
import { cookies } from "next/headers";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import AccountTypeBtn from "./AccountTypeBtn";

export default async function AdminPage() {
  const cookieStore = await cookies();

  const access_token = cookieStore.get("admin_access_token")?.value;

  console.log("DEBUG cookie string:", cookieStore.toString());
  console.log("access_token in admin page.tsx", access_token);

  const usersToRegister = await adminApiServerFetch(
    `${process.env.BACK_END_URL}/admin/user-registration`,
    {
      headers: {
        //JwtAuthGuard requires a JWT, If your JWT is stored in a cookie, then req.user
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  const fetchOnlineUsers: string[] = [
    "Julian Golovens",
    "Tom Simpson",
    "Jack Morgan",
    "William Thompson",
    "Jessica Evans",
    "Arthur Cooper",
    "Lily Richardson",
  ];

  const registerNumber = usersToRegister?.length ?? 0;

  const chatNumber = 6;

  return (
    <div className={styles.mainBlock}>
      <AdminPageHeader />

      <WelcomeAdmin />
      <AdminTitle num={registerNumber} title="New requests To Register" />

      <NewUserRegistration usersToRegister={usersToRegister} />
      <div className="my-4" />
      <hr />
      <div className="my-4" />

      <div className="row g-3 m-4 align-items-stretch">
        {/* Left block */}
        <div className="col-8">
          <div
            className="rounded p-3 h-100"
            style={{
              border: "2px solid #a45d16",
            }}
          >
            <AdminTitle num={chatNumber} title="New Chats to reply back" />
            <ActiveChats />
          </div>
        </div>

        {/* RIGHT block*/}
        <div className="col-4 d-flex flex-column">
          <div
            className="rounded p-3 flex-grow-1"
            style={{
              border: "2px solid #a45d16",
            }}
          >
            <h3 className="text-center mb-3">🌐 Online users</h3>

            <div className="row g-3">
              <div className="col-9">
                <input className="form-control" placeholder="Search user" />
              </div>

              <div className="col-3">
                <button className="btn btn-success w-100">Search</button>
              </div>
            </div>

            <div className="mt-3">
              <ul>
                {fetchOnlineUsers.slice(0, 6).map((user, index) => (
                  <li key={index}>🟢 {user}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* SuperAdmin role button */}
          <ManageAdmins />
        </div>
      </div>

      <div className="row g-3 m-4">
        <div className="col-4">
          <div
            className="rounded p-3"
            style={{
              border: "2px solid #a45d16",
            }}
          >
            <h3 className="text-center">💳 Credit Card requests</h3>
            <hr />
            <div className="ms-3">
              <li>Harry Collins</li>
              <li>Amelia Parker</li>
              <li>Sophie Turner</li>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div
            className="rounded p-3"
            style={{
              border: "2px solid #a45d16",
            }}
          >
            <h3 className="text-center">〽️ Loans & Credit requests</h3>
            <hr />
            <div className="ms-3">
              <li>James Carter</li>
              <li>Emily Mitchell</li>
              <li>Oliver Bennett</li>
            </div>
          </div>
        </div>

        <div className="col-4">
          <AccountTypeBtn />
        </div>
      </div>

      <Footer />
    </div>
  );
}
