export default function CreditCard() {
  return (
    <div
      className="bg-white rounded shadow-sm p-4 flex-fill"
      style={{ minWidth: "300px" }}
    >
      <h3 className="text-success">Big Credit Card</h3>

      <p className="mb-2">Card Number: **** **** **** 2384</p>

      <h2 className="fw-bold" style={{ color: "#006a4d" }}>
        £2,150.00
      </h2>

      <p className="small text-muted">Available credit: £3,850.00</p>

      <a href="#" className="fw-bold text-decoration-none text-success">
        View Credit Card
      </a>
    </div>
  );
}
