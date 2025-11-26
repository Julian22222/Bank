export default function CreditCard() {
  return (
    <div style={smallCard}>
      <h3 style={{ color: "#004c3f" }}>Big Credit Card</h3>
      <p>Card Number: **** **** **** 2384</p>
      <h2 style={{ color: "#006a4d" }}>£2,150.00</h2>
      <p style={{ fontSize: "14px", color: "#555" }}>
        Available credit: £3,850.00
      </p>
      <a href="#" style={linkButtonStyle}>
        View Credit Card
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
