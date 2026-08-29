import Link from "next/link";
import styles from "../../styles/FirstPage/firstPage.module.css";

export default async function LogOn() {
  console.log("start");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/accounts/user/2/accounts-balance`,
  );
  console.log("res", res);

  console.log("start");

  return (
    <section className={`text-white text-center py-5 ${styles.logOnSection}`}>
      <div className="container py-5">
        <h2 className="fs-1 mb-3 fw-normal">Welcome to Big Bank</h2>

        <p className="fs-5 mb-4">
          Manage your money with confidence, wherever you are.
        </p>

        <Link
          href="/login"
          className={`btn fw-bold px-4 py-2 fs-6 ${styles.logOn}`}
        >
          Log In
        </Link>
      </div>
    </section>
  );
}
