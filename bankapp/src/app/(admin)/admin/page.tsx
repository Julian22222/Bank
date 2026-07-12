import ActiveChats from "./ActiveChats";
import AdminPageHeader from "../../../components/AdminPageHeader";
import Footer from "../../../components/AdminFooter";
import NewUserRegistration from "./NewUserRegistration";
import WelcomeAdmin from "./WelcomeAdmin";
import AdminTitle from "./AdminTitle";
import styles from "../../../styles/Admin/admin.module.css";
// require("dotenv").config();

export default async function AdminPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/admin/user-registration`,
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to load users to register data: ${errorText}`);
  }

  const usersToRegister = await res.json();

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

      <div className="row g-3 m-4">
        <div className="col-8">
          <div
            className="rounded p-3"
            style={{
              border: "2px solid #a45d16",
            }}
          >
            <AdminTitle num={chatNumber} title="New Chats to reply back" />
            <ActiveChats />
          </div>
        </div>

        <div className="col-4">
          <div
            className="rounded p-3"
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
                <li>🟢 Julian Golovens</li>
                <li>🟢 Tom Simpson</li>
                <li>🟢 Jack Morgan</li>
                <li>🟢 William Thompson</li>
                <li>🟢 Jessica Evans</li>
                <li>🟢 Arthur Cooper</li>
                <li>🟢 Lily Richardson</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 m-4">
        <div className="col-6">
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

        <div className="col-6">
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
      </div>

      <Footer />
    </div>
  );
}
