export default function Savings() {
  return (
    <div style={smallCard}>
      <h3 style={{ color: "#004c3f" }}>Saver Account</h3>
      <p>
        Account Number: <strong>98-76-54 / 12345678</strong>
      </p>
      <h2 style={{ color: "#006a4d" }}>£8,932.10</h2>
      <p style={{ fontSize: "14px", color: "#555" }}>1.25% AER (variable)</p>
      <a href="#" style={linkButtonStyle}>
        Manage Saver Account
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
