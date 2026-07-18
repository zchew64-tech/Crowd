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
    <select
      value={sortBy}
      onChange={(event) =>
        setSortBy(event.target.value as SortOption)
      }
      className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 outline-none transition hover:border-purple-400/30"
    >
      <option value="nearest">Nearest</option>
      <option value="mostAvailable">Most seating available</option>
      <option value="leastAvailable">Least seating available</option>
    </select>
  );
}