"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../UserContext";
import { userLogOut } from "../../actions/userLogOut";

export default function UserPageHeader() {
  const { activeUser, setActiveUser, userAccountType } = useUser();

  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/user-page", label: "Home" },
    {
      href: `/transactions/${userAccountType ?? "Main"}/${activeUser?.last_name}`,
      label: "Transactions",
    },
    { href: "/accounts", label: "Accounts" },
    { href: "/messages", label: "Messages" },
    { href: "/contacts", label: "Contact Us" },
  ];

  const handleLogout = async () => {
    await userLogOut();
    setActiveUser(null);

    router.replace("/");
    router.refresh();
  };

  return (
    <header
      className="text-white py-2 px-4 d-flex justify-content-between align-items-center"
      style={{ backgroundColor: "#006a4d" }}
    >
      <Link href="/" className="text-white text-decoration-none">
        <div className="d-flex align-items-center">
          <Image
            src="/elephant3.png"
            alt="Bank Logo"
            width={40}
            height={40}
            className="me-2"
          />

          <h1 className="m-0 fs-5">BIG BANK</h1>
        </div>
      </Link>

      <nav className="d-flex align-items-center flex-wrap gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`text-decoration-none fw-bold ms-3 ${
                isActive ? "text-dark" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline-light fw-bold"
          style={{ cursor: "pointer" }}
        >
          Log out
        </button>
      </nav>
    </header>
  );
}
