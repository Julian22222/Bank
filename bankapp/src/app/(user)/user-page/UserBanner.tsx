"use client";

// import { useGlobal } from "../../Context";
import { useUser } from "../UserContext";

export default function UserBanner() {
  const { activeUser } = useUser();

  return (
    <section
      className="text-white text-center py-5 px-3"
      style={{ backgroundColor: "#004c3f" }}
    >
      <h2 className="fs-2">
        Welcome back,{" "}
        <span style={{ color: "#9ee0cf" }}>
          {activeUser?.first_name} {activeUser?.last_name}
        </span>
      </h2>

      <p className="mb-0">Your Big Bank personal account overview</p>
    </section>
  );
}
