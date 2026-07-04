import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-footer text-white text-center py-4 px-3"
      style={{
        backgroundColor: "#a45d16",
        marginTop: "auto",
      }}
    >
      <p className="mb-2">
        &copy; {new Date().getFullYear()} Big Bank. All rights reserved.
      </p>

      <div className="d-flex justify-content-center flex-wrap gap-3">
        <Link href="#" className="text-white">
          Privacy
        </Link>
        <Link href="#" className="text-white">
          Security
        </Link>
        <Link href="#" className="text-white">
          Accessibility
        </Link>
        <Link href="#" className="text-white">
          Cookies
        </Link>
        <Link href="#" className="text-white">
          Terms & Conditions
        </Link>
        <Link href="#" className="text-white">
          Help
        </Link>
      </div>
    </footer>
  );
}
