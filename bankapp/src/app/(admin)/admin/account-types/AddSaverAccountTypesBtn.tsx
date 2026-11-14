"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  setShowModule: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddSaverAccountTypesBtn({ setShowModule }: Props) {
  const router = useRouter();

  return (
    <div className="d-flex gap-2 justify-content-center mt-4">
      <button className="btn btn-primary" onClick={() => setShowModule(true)}>
        Add new Saver Account
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => router.push("/admin")}
      >
        Return Back
      </button>
    </div>
  );
}
