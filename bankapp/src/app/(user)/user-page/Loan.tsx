import Link from "next/link";

export default function Loan() {
  return (
    <div
      className="bg-white rounded shadow-sm p-4 flex-fill"
      style={{ minWidth: "300px" }}
    >
      <h3 className="text-success">Personal Loan</h3>

      <p className="mb-2">Balance remaining: £5,200.00</p>

      <p className="small text-muted">Monthly payment: £220.00</p>

      <Link href="#" className="fw-bold text-decoration-none text-success">
        Manage Loan
      </Link>
    </div>
  );
}
