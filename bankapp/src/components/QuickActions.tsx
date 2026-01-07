export default function QuickActions() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "20px",
        backgroundColor: "#e6f2ef",
        borderRadius: "10px",
        padding: "30px",
      }}
    >
      {[
        { icon: "💰", label: "Top Up Account" },
        { icon: "💳", label: "Pay Credit Card" },
        { icon: "🏦", label: "Open New Account" },
        { icon: "📊", label: "Spending Insights" },
        { icon: "📄", label: "Download Statement" },
      ].map((action, i) => (
        <a
          key={i}
          href="#"
          style={{
            textDecoration: "none",
            backgroundColor: "white",
            padding: "20px",
            width: "180px",
            textAlign: "center",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            color: "#004c3f",
            fontWeight: "bold",
          }}
        >
          <div style={{ fontSize: "36px" }}>{action.icon}</div>
          {action.label}
        </a>
      ))}
    </section>
  );
}
