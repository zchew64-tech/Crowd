type SortOption = "nearest" | "mostAvailable" | "leastAvailable";

type SortMenuProps = {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
};

export default function SortMenu({
  sortBy,
  setSortBy,
}: SortMenuProps) {
  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(event) =>
          setSortBy(event.target.value as SortOption)
        }
        className="appearance-none rounded-2xl border border-white/10 bg-white/5 py-3 pl-5 pr-11 text-sm text-zinc-300 shadow-lg shadow-black/20 backdrop-blur outline-none transition hover:border-purple-400/40 hover:bg-purple-500/10"
      >
        <option value="nearest" className="bg-zinc-950">
          Nearest
        </option>
        <option value="mostAvailable" className="bg-zinc-950">
          Most seating available
        </option>
        <option value="leastAvailable" className="bg-zinc-950">
          Least seating available
        </option>
      </select>

      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
        ⌄
      </span>
    </div>
  );
}