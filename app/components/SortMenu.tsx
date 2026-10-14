"use client";

export type SortOption = "nearest" | "mostAvailable" | "leastAvailable";

type SortMenuProps = {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
};

export default function SortMenu({ sortBy, setSortBy }: SortMenuProps) {
  return (
    <label>
      <span className="sr">Sort spots</span>
      <select
        className="sort"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value as SortOption)}
      >
        <option value="nearest">Nearest</option>
        <option value="mostAvailable">Most seating available</option>
        <option value="leastAvailable">Least seating available</option>
      </select>
    </label>
  );
}