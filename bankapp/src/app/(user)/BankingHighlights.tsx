import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Everyday Banking",
    text: "Explore our current accounts designed to fit your daily needs.",
    img: "/bank1.jpg",
    href: "#",
  },
  {
    title: "Loans & Credit Cards",
    text: "Flexible borrowing options to support your goals and plans.",
    img: "/bank3.jpeg",
    href: "#",
  },
  {
    title: "Savings & Investments",
    text: "Make your money work harder with our range of saving options.",
    img: "/bank9.jpeg",
    href: "#",
  },
];

export default function BankingHighlights() {
  return (
    <section className="d-flex justify-content-center flex-wrap gap-4 py-5 px-3 bg-light">
      {highlights.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded shadow-sm overflow-hidden flex-fill"
          style={{
            minWidth: 280,
            maxWidth: 320,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "320px",
              height: "180px",
            }}
          >
            <Image
              src={card.img}
              alt={card.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="p-3">
            <h3 className="text-success">{card.title}</h3>
            <p>{card.text}</p>

            <Link
              href={card.href}
              className="fw-bold text-decoration-none text-success"
            >
              Learn more
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
