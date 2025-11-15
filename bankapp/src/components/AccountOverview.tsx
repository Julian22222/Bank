export default function AccountOverview() {
  return (
    <section
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "25px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "40px",
      }}
    >
      <h3 style={{ color: "#004c3f" }}>Current Account</h3>
      <p style={{ marginTop: "10px" }}>
        Account Number: <strong>12-34-56 / 98765432</strong>
      </p>
      <h1 style={{ fontSize: "36px", color: "#006a4d", margin: "20px 0" }}>
        £4,285.27
      </h1>
      <div>
        <a href="#" style={buttonStyle}>
          Make a Payment
        </a>
        <a href="#" style={buttonStyle}>
          Transfer Money
        </a>
        <a href="#" style={buttonStyle}>
          View Statements
        </a>
      </div>
    </section>
  );
}

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#006a4d",
  color: "white",
  textDecoration: "none",
  padding: "10px 18px",
  borderRadius: "4px",
  marginRight: "10px",
  fontWeight: "bold",
};
