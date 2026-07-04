import Image from "next/image";

export default function MobileBanking() {
  return (
    <section className="py-5 px-3 text-center bg-white">
      <h2 className="fs-2 text-success">Banking in Your Pocket</h2>

      <p>
        Download our app and manage your finances anytime, anywhere. Over 10
        million customers already use it.
      </p>

      <div
        className="position-relative mx-auto w-100"
        style={{ maxWidth: "350px", aspectRatio: "7 / 5" }}
      >
        <Image
          src="/bank6.jpg"
          alt="mobile banking"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className="mt-4">
        <a
          href="#"
          className="btn fw-bold text-white px-4 py-2"
          style={{ backgroundColor: "#006a4d", borderColor: "#006a4d" }}
        >
          Download App
        </a>
      </div>
    </section>
  );
}
