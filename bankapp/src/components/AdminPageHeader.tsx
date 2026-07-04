"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAdmin } from "../app/(admin)/AdminContext";
import { adminLogOut } from "../app/actions/adminLogOut";

const navLinks = [
  { label: "Home", href: "/admin" },
  { label: "Users", href: "/admin-users" },
  { label: "Transactions", href: "/admin/allTransactions" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Chats", href: "#" },
];

export default function AdminPageHeader() {
  const { setActiveAdmin } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await adminLogOut();
    setActiveAdmin(null);
    router.replace("/");
    router.refresh();
  };

  return (
    <header
      className="d-flex justify-content-between align-items-center px-4 py-2"
      style={{ backgroundColor: "#a45d16", color: "white" }}
    >
      {/* Logo */}
      <Link href="/" className="text-decoration-none text-white">
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

      {/* Navigation */}
      <nav className="d-flex align-items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
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
          className="btn btn-sm btn-outline-light fw-bold ms-3 cursor-pointer"
        >
          Log out
        </button>
      </nav>
    </header>
  );
}
