const testimonials = [
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
];

export default function Testimonials() {
  return (
    <section
      className="py-5 px-3 text-center"
      style={{ backgroundColor: "#e6f2ef" }}
    >
      <h2 className="fs-2 text-success">What Our Customers Say</h2>

      <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded shadow-sm"
            style={{ width: "300px" }}
          >
            <blockquote className="fst-italic">"{t.quote}"</blockquote>

            <p className="fw-bold mt-3 text-success">– {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
