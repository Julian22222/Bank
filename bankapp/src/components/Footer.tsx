import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className=" text-white text-center py-4 mt-5"
      style={{ backgroundColor: "#004c3f" }}
    >
      <p className="mb-2">
        &copy; {new Date().getFullYear()} Big Bank. All rights reserved.
      </p>

      <div className="d-flex flex-wrap justify-content-center gap-3">
        <Link href="#" className="text-white text-decoration-none small">
          Privacy
        </Link>

        <Link href="#" className="text-white text-decoration-none small">
          Security
        </Link>

        <Link href="#" className="text-white text-decoration-none small">
          Accessibility
        </Link>

        <Link href="#" className="text-white text-decoration-none small">
          Cookies
        </Link>

        <Link href="#" className="text-white text-decoration-none small">
          Terms & Conditions
        </Link>

        <Link href="#" className="text-white text-decoration-none small">
          Help
        </Link>
      </div>
    </footer>
  );
}
