import Link from "next/link";

const helpItems = [
  {
    title: "Payments & Transfers",
    desc: "How to send money, limits, timings.",
    href: "#",
  },
  {
    title: "Using Your Card",
    desc: "Lost cards, PIN, blocked transactions.",
    href: "#",
  },
  {
    title: "Online Banking",
    desc: "Login, reset password, security tips.",
    href: "#",
  },
  {
    title: "Protecting Yourself",
    desc: "Fraud, scams, safety advice.",
    href: "#",
  },
];

export default function HelpGuidance() {
  return (
    <section className="py-5 px-3" style={{ backgroundColor: "#e6f2ef" }}>
      <h2 className="fs-2 text-center text-success">Help & Guidance</h2>

      <p className="text-center">
        Need support? Find helpful guides and resources for all your banking
        needs.
      </p>

      <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
        {helpItems.map((item, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded shadow-sm"
            style={{ width: "260px" }}
          >
            <h3 className="text-success fs-6 fw-bold">{item.title}</h3>

            <p className="small">{item.desc}</p>

            <Link
              href={item.href}
              className="fw-bold text-decoration-none text-success"
            >
              Learn more
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
