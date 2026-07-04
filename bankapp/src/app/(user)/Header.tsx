import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/FirstPage/firstPage.module.css";

const navItems = [
  { href: "#", label: "Personal" },
  { href: "#", label: "Business" },
  { href: "#", label: "Help & Support" },
  { href: "#", label: "Contact" },
];

export default function Header() {
  return (
    <header
      className={`text-white py-2 px-4 d-flex justify-content-between align-items-center sticky-top ${styles.headerBlock}`}
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

      <nav className="d-flex flex-wrap justify-content-center gap-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-white text-decoration-none fw-bold"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
