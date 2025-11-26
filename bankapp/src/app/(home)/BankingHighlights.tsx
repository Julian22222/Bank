export default function BankingHighlights() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "25px",
        padding: "60px 20px",
        backgroundColor: "#f8f8f8",
      }}
    >
      {[
        {
          title: "Everyday Banking",
          text: "Explore our current accounts designed to fit your daily needs.",
          img: "https://images.unsplash.com/photo-1567427013953-7fc3d5ad9f9c?auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Loans & Credit Cards",
          text: "Flexible borrowing options to support your goals and plans.",
          img: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Savings & Investments",
          text: "Make your money work harder with our range of saving options.",
          img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80",
        },
      ].map((card, i) => (
        <div
          key={i}
          style={{
            width: "300px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <img
            src={card.img}
            alt={card.title}
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
          />
          <div style={{ padding: "20px" }}>
            <h3 style={{ color: "#004c3f" }}>{card.title}</h3>
            <p>{card.text}</p>
            <a href="#" style={{ ...linkButtonStyle }}>
              Learn more
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}

// Inline style objects

const linkButtonStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#006a4d",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "10px",
};
