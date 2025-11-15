import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#006a4d",
        color: "white",
        padding: "12px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="http://localhost:3000/"
        style={{ color: "white", textDecoration: "none" }}
      >
        <h1 style={{ margin: 0, fontSize: "22px" }}>BIG BANK</h1>
      </Link>
      <nav>
        <a href="#" style={navLinkStyle}>
          Personal
        </a>
        <a href="#" style={navLinkStyle}>
          Business
        </a>
        <a href="#" style={navLinkStyle}>
          Help & Support
        </a>
        <a href="#" style={navLinkStyle}>
          Contact
        </a>
      </nav>
    </header>
  );
}

// Inline style objects
const navLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  marginLeft: "20px",
  fontWeight: "bold",
};
