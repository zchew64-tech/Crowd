"use client";

import Reveal from "./Reveal";

export type Filter =
  | "all"
  | "Cafe"
  | "Lounge"
  | "Library"
  | "quiet"
  | "outlets";

const chips: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Cafés", value: "Cafe" },
  { label: "Lounges", value: "Lounge" },
  { label: "Libraries", value: "Library" },
  { label: "Quiet", value: "quiet" },
  { label: "Plenty of outlets", value: "outlets" },
];

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  filter: Filter;
  setFilter: (value: Filter) => void;
};

export default function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
}: SearchBarProps) {
  return (
    <Reveal className="tools">
      <label className="sb">
        <span className="sr">Search spots</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search cafés, lounges, or libraries near UCR"
          autoComplete="off"
        />
      </label>

      <div className="chs" role="group" aria-label="Filter spots">
        {chips.map((chip) => (
          <button
            key={chip.value}
            className={`ch ${filter === chip.value ? "on" : ""}`}
            aria-pressed={filter === chip.value}
            onClick={() => setFilter(chip.value)}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </Reveal>
  );
}