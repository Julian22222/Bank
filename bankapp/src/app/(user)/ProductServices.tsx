import Image from "next/image";
import Link from "next/link";

const servicesBlocks = [
  {
    title: "Current Accounts",
    desc: "Flexible accounts to suit your needs.",
    img: "/bank10.jpg",
    href: "#",
  },
  {
    title: "Credit Cards",
    desc: "Find the right credit card for you.",
    img: "/bank2.jpg",
    href: "#",
  },
  {
    title: "Loans",
    desc: "Personal and business loan options.",
    img: "/bank19.jpg",
    href: "#",
  },
  {
    title: "Mortgages",
    desc: "Home buying made easy with our mortgage plans.",
    img: "/bank8.jpg",
    href: "#",
  },
  {
    title: "Savings & ISAs",
    desc: "Grow your savings with competitive rates.",
    img: "/bank18.jpeg",
    href: "#",
  },
  {
    title: "Insurance",
    desc: "Protect what matters most with our insurance plans.",
    img: "/bank15.jpg",
    href: "#",
  },
  {
    title: "Pensions & Investments",
    desc: "Plan for your future with our pension and investment options.",
    img: "/bank16.jpg",
    href: "#",
  },
];

export default function ProductServices() {
  return (
    <section className="mx-auto py-5 px-3 bg-white text-center">
      <h2 className="fs-2 text-success">Products & Services</h2>

      <p>
        See everything we offer — banking, insurance, investments, and more.
      </p>

      <div className="row g-4 mt-4 d-flex justify-content-center">
        {servicesBlocks.map((card, i) => (
          <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="p-3 border rounded bg-light h-100 d-flex flex-column">
              <h3 className="text-success fs-6 fw-bold">{card.title}</h3>

              <p className="small">
                Find out more about {card.desc.toLowerCase()}.
              </p>

              <div
                style={{ position: "relative", height: "180px", width: "100%" }}
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="rounded mb-3"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <Link
                href={card.href}
                className="fw-bold text-decoration-none text-success mt-auto"
              >
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
