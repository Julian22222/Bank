export default function RecentTransactions() {
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
      <h3 style={{ color: "#004c3f" }}>Recent Transactions</h3>
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e6f2ef", textAlign: "left" }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              date: "02 Nov 2025",
              desc: "Starbucks Coffee",
              amount: "-£4.50",
              balance: "£4,285.27",
            },
            {
              date: "01 Nov 2025",
              desc: "Tesco Superstore",
              amount: "-£52.30",
              balance: "£4,289.77",
            },
            {
              date: "30 Oct 2025",
              desc: "Salary - ACME Ltd",
              amount: "+£2,400.00",
              balance: "£4,342.07",
            },
            {
              date: "29 Oct 2025",
              desc: "Netflix Subscription",
              amount: "-£10.99",
              balance: "£1,942.07",
            },
          ].map((t, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{t.date}</td>
              <td style={tdStyle}>{t.desc}</td>
              <td
                style={{
                  ...tdStyle,
                  color: t.amount.startsWith("-") ? "red" : "#006a4d",
                }}
              >
                {t.amount}
              </td>
              <td style={tdStyle}>{t.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <a href="#" style={linkButtonStyle}>
          View All Transactions
        </a>
      </div>
    </section>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "10px",
  fontSize: "14px",
};

const linkButtonStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "10px",
};

const thStyle: React.CSSProperties = {
  padding: "10px",
  fontSize: "14px",
};
