"use client";
import { useGlobal } from "../Context"; //IMPORT GLOBAL CONTEXT, Global UseState

export default function LogOn() {
  const { activeUser } = useGlobal();

  console.log("Active User in LogOnSection:", activeUser);

  return (
    <section
      style={{
        backgroundImage: "url(/mainbankPic.jpg)",
        // "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: "120px 20px",
      }}
    >
      <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
        Welcome to Big Bank
      </h2>
      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        Manage your money with confidence, wherever you are.
      </p>
      {activeUser ? (
        <a
          href="/user-page"
          style={{
            backgroundColor: "#006a4d",
            color: "white",
            padding: "14px 30px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Return to Dashboard
        </a>
      ) : (
        <a
          href="/login"
          style={{
            backgroundColor: "#006a4d",
            color: "white",
            padding: "14px 30px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Log on
        </a>
      )}
    </section>
  );
}
