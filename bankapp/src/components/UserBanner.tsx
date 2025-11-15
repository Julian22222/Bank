"use client";

import { useGlobal } from "../app/Context"; //IMPORT GLOBAL CONTEXT, Global UseState

export default function UserBanner() {
  const { activeUser } = useGlobal();
  return (
    <section
      style={{
        backgroundColor: "#004c3f",
        color: "white",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "30px" }}>
        Welcome back,{" "}
        <span style={{ color: "#9ee0cf" }}>
          {activeUser?.first_name + " " + activeUser?.last_name}
        </span>
      </h2>
      <p>Your Big Bank personal account overview</p>
    </section>
  );
}
