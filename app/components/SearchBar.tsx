type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="mb-10 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-5 shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:border-purple-400/30">
      <span className="text-2xl text-zinc-500">⌕</span>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search cafes or lounges near UCR..."
        className="w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
      />

      <button className="rounded-2xl border border-purple-400/20 bg-purple-500/10 px-5 py-3 text-sm font-medium text-purple-300 transition hover:bg-purple-500/20">
        Filter
      </button>
    </div>
  );
}