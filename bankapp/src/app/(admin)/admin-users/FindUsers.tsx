"use client";

import Link from "next/link";

type Props = {
  option: string;
  setOption: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function FindUsers({
  option,
  setOption,
  search,
  setSearch,
}: Props) {
  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="d-flex justify-content-between align-items-center w-100 px-3 py-2">
      {/* LEFT SIDE */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <select
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="form-select w-auto"
          style={{ minWidth: "140px" }}
        >
          <option value="">Search by:</option>
          <option value="name">name</option>
          <option value="surname">surname</option>
          <option value="email">email</option>
          <option value="phone">phone</option>
        </select>

        <div className="position-relative d-flex align-items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="form-control"
            style={{ minWidth: "250px" }}
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="btn btn-sm btn-outline-danger position-absolute end-0 me-2"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <Link
          href="/registration"
          className="btn btn-primary fw-bold px-4 py-2 shadow"
        >
          Register New User
        </Link>
      </div>
    </div>
  );
}
