"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>Something went wrong</h2>

      <button className="btn btn-primary mt-3" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
