export default function Navbar() {
  return (
    <nav className="mb-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-purple-900/20 backdrop-blur">
          <span className="bg-gradient-to-br from-purple-300 to-purple-700 bg-clip-text text-xl font-black text-transparent">
            C
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">crowd</h1>
          <p className="text-xs text-zinc-500">Study spaces near UCR</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-200 shadow-lg shadow-black/20 backdrop-blur transition hover:border-purple-400/40 hover:bg-purple-500/10">
          UCR Area
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-purple-300 shadow-lg shadow-black/20 backdrop-blur">
          ZC
        </div>
      </div>
    </nav>
  );
}