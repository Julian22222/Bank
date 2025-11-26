import BankingHighlights from "@/src/app/(home)/BankingHighlights";
import Header from "@/src/app/(home)/Header";
import LogOnSection from "@/src/app/(home)/LogOnSection";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#222",
        lineHeight: 1.6,
      }}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <LogOnSection />

      {/* Banking Highlights */}
      <BankingHighlights />

      {/* Products & Services Section */}
      <section
        style={{
          padding: "60px 20px",
          backgroundColor: "#ffffff",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "32px", color: "#004c3f" }}>
          Products & Services
        </h2>
        <p>
          See everything we offer — banking, insurance, investments, and more.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {[
            "Current Accounts",
            "Credit Cards",
            "Loans",
            "Mortgages",
            "Savings & ISAs",
            "Insurance",
            "Pensions & Investments",
            "Car Finance",
          ].map((prod, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ color: "#004c3f" }}>{prod}</h3>
              <p style={{ fontSize: "14px" }}>
                {`Find out more about ${prod.toLowerCase()}.`}
              </p>
              <a href="#" style={{ ...linkButtonStyle }}>
                Explore
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Help & Guidance Section */}
      <section
        style={{
          backgroundColor: "#e6f2ef",
          padding: "60px 20px",
        }}
      >
        <h2 style={{ fontSize: "32px", textAlign: "center", color: "#004c3f" }}>
          Help & Guidance
        </h2>
        <p style={{ textAlign: "center" }}>
          Need support? Find helpful guides and resources for all your banking
          needs.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "25px",
            marginTop: "40px",
          }}
        >
          {[
            {
              title: "Payments & Transfers",
              desc: "How to send money, limits, timings.",
            },
            {
              title: "Using Your Card",
              desc: "Lost cards, PIN, blocked transactions.",
            },
            {
              title: "Online Banking",
              desc: "Login, reset password, security tips.",
            },
            {
              title: "Protecting Yourself",
              desc: "Fraud, scams, safety advice.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                width: "260px",
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#004c3f", fontSize: "18px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px" }}>{item.desc}</p>
              <a href="#" style={{ ...linkButtonStyle }}>
                Learn more
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* App / Mobile Banking Promotion */}
      <section
        style={{
          padding: "60px 20px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ fontSize: "32px", color: "#004c3f" }}>
          Banking in Your Pocket
        </h2>
        <p>
          Download our app and manage your finances anytime, anywhere. Over 10
          million customers already use it.
        </p>
        <img
          src="https://images.unsplash.com/photo-1586953208448-57530cde6f0c?auto=format&fit=crop&w=600&q=80"
          alt="mobile banking"
          style={{ width: "250px", marginTop: "20px", borderRadius: "8px" }}
        />
        <div style={{ marginTop: "30px" }}>
          <a
            href="#"
            style={{
              ...linkButtonStyle,
              backgroundColor: "#006a4d",
              color: "white",
              padding: "12px 25px",
            }}
          >
            Download App
          </a>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        style={{
          backgroundColor: "#e6f2ef",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "32px", color: "#004c3f" }}>
          What Our Customers Say
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "25px",
            marginTop: "30px",
          }}
        >
          {[
            {
              name: "Sarah L.",
              quote:
                "I've been with Big Bank for years — their online banking makes everything so easy!",
            },
            {
              name: "James T.",
              quote:
                "Great customer service and really helpful with my home loan application.",
            },
            {
              name: "Priya D.",
              quote:
                "The mobile app is intuitive and secure. I can manage everything from my phone.",
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                width: "300px",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ fontStyle: "italic" }}>"{t.quote}"</p>
              <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                – {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About / Legal Section */}
      <section
        style={{
          padding: "60px 20px",
          backgroundColor: "#f8f8f8",
        }}
      >
        <h2 style={{ fontSize: "28px", textAlign: "center", color: "#004c3f" }}>
          About Us & Legal
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          {[
            { title: "Legal Info", desc: "Terms, privacy, cookie policy." },
            { title: "About Big Bank", desc: "Our history, mission & values." },
            { title: "Sitemap", desc: "Navigate through our site easily." },
            { title: "Careers", desc: "Join our team & opportunities." },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                width: "220px",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#004c3f", fontSize: "18px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px" }}>{item.desc}</p>
              <a href="#" style={{ ...linkButtonStyle }}>
                View
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#004c3f",
          color: "white",
          textAlign: "center",
          padding: "40px 20px",
          marginTop: "40px",
        }}
      >
        <p>&copy; {new Date().toLocaleDateString().slice(-4)} Big Bank </p>
        <div style={{ marginTop: "10px" }}>
          <a href="#" style={{ ...footerLinkStyle }}>
            Accessibility
          </a>
          <a href="#" style={{ ...footerLinkStyle }}>
            Privacy
          </a>
          <a href="#" style={{ ...footerLinkStyle }}>
            Cookies
          </a>
          <a href="#" style={{ ...footerLinkStyle }}>
            Terms & Conditions
          </a>
        </div>
      </footer>
    </div>
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

const footerLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  margin: "0 10px",
};
