export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#004c3f",
        color: "white",
        textAlign: "center",
        padding: "30px 20px",
        marginTop: "60px",
      }}
    >
      <p style={{ marginBottom: "10px" }}>
        &copy; {new Date().toLocaleDateString().slice(-4)} Big Bank. All rights
        reserved.
      </p>
      <div>
        <a href="#" style={footerLinkStyle}>
          Privacy
        </a>
        <a href="#" style={footerLinkStyle}>
          Security
        </a>
        <a href="#" style={footerLinkStyle}>
          Accessibility
        </a>
        <a href="#" style={{ ...footerLinkStyle }}>
          Cookies
        </a>
        <a href="#" style={{ ...footerLinkStyle }}>
          Terms & Conditions
        </a>
        <a href="#" style={{ ...footerLinkStyle }}>
          Help
        </a>
      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  margin: "0 10px",
  fontSize: "14px",
};
