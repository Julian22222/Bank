export default function UserPageHeader() {
  return (
    <header
      style={{
        backgroundColor: "#006a4d",
        color: "white",
        padding: "12px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "22px" }}>BIG BANK</h1>
      <nav>
        <a href="http://localhost:3000/" style={navLinkStyle}>
          Home
        </a>
        <a href="#" style={navLinkStyle}>
          Accounts
        </a>
        <a href="#" style={navLinkStyle}>
          Payments
        </a>
        <a href="#" style={navLinkStyle}>
          Help
        </a>
        <a href="#" style={navLinkStyle}>
          Log out
        </a>
      </nav>
    </header>
  );
}

// Inline style constants
const navLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  marginLeft: "20px",
  fontWeight: "bold",
};
