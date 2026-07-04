type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchComponent({ searchTerm, setSearchTerm }: Props) {
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-2 px-3 position-relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control rounded-2 border"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="position-absolute btn btn-sm btn-outline-danger rounded px-2 py-1"
          style={{
            top: "50%",
            right: "25px",
            transform: "translateY(-50%)",
            lineHeight: 1,
          }}
        >
          X
        </button>
      )}
    </div>
  );
}
