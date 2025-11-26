export default function UserFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#004c3f",
        color: "white",
        textAlign: "center",
        padding: "30px 20px",
        marginTop: "40px",
      }}
    >
      <p>&copy; {new Date().toLocaleDateString().slice(-4)} Big Bank </p>
      <div style={{ marginTop: "10px" }}>
        <a href="#" style={{ ...footerLinkStyle }}>
          Privacy
        </a>
        <a href="#" style={{ ...footerLinkStyle }}>
          Security
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
};
