import Link from "next/link";

const sections = [
  {
    title: "Legal Info",
    desc: "Terms, privacy, cookie policy.",
    href: "#",
  },
  {
    title: "About Big Bank",
    desc: "Our history, mission & values.",
    href: "#",
  },
  {
    title: "Sitemap",
    desc: "Navigate through our site easily.",
    href: "#",
  },
  {
    title: "Careers",
    desc: "Join our team & opportunities.",
    href: "#",
  },
];

export default function AboutLegal() {
  return (
    <section className="py-5 px-3" style={{ backgroundColor: "#f8f8f8" }}>
      <h2 className="fs-3 text-center text-success">About Us & Legal</h2>

      <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
        {sections.map((section, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded shadow-sm flex-fill"
            style={{ width: "220px" }}
          >
            <h3 className="text-success fs-6 fw-bold">{section.title}</h3>

            <p className="small">{section.desc}</p>

            <Link
              href={section.href}
              className="fw-bold text-decoration-none text-success"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
