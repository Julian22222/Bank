export default function Loan() {
  return (
    <div style={smallCard}>
      <h3 style={{ color: "#004c3f" }}>Personal Loan</h3>
      <p>Balance remaining: £5,200.00</p>
      <p style={{ fontSize: "14px", color: "#555" }}>
        Monthly payment: £220.00
      </p>
      <a href="#" style={linkButtonStyle}>
        Manage Loan
      </a>
    </div>
  );
}

const linkButtonStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "10px",
};

const smallCard: React.CSSProperties = {
  flex: "1 1 300px",
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
