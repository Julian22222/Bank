"use client";

import { useUser } from "../UserContext";

import Link from "next/link";

export default function QuickActions() {
  const { activeUser } = useUser();
  return (
    <section className="bg-light rounded p-4 d-flex flex-wrap justify-content-center gap-3">
      {[
        { icon: "💰", label: "Top Up Account", href: "#" },
        { icon: "💳", label: "Pay Credit Card", href: "#" },
        { icon: "🏦", label: "Open New Account", href: "/accounts" },
        { icon: "📊", label: "Spending Insights", href: "/charts" },
        {
          icon: "📄",
          label: "Download Statement",
          href: `/transactions/Main/${activeUser?.last_name}`,
        },
      ].map((action, i) => (
        <Link
          key={i}
          href={action.href}
          className="text-decoration-none bg-white rounded shadow-sm p-3 text-center fw-bold text-success"
          style={{ width: "180px" }}
        >
          <div className="fs-1">{action.icon}</div>
          {action.label}
        </Link>
      ))}
    </section>
  );
}
