import Link from "next/link";

type HeroProps = {
  onExplore: () => void;
};

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative mb-20 max-w-4xl">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-purple-700/20 blur-[120px]" />
      <div className="absolute left-80 top-24 h-60 w-60 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 backdrop-blur">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          Live availability reports
        </div>

        <h1 className="text-7xl font-black leading-[0.95] tracking-tight">
          Find an open seat
          <br />

          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-500 bg-clip-text text-transparent">
            before you leave.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          Live seat availability for cafés and lounges around UCR, so you can
          choose where to go before making the trip.
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={onExplore}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-violet-700 px-7 py-4 font-semibold shadow-2xl shadow-purple-900/40 transition duration-300 hover:scale-105"
          >
            Explore Nearby Spots
          </button>

          <Link
            href="/how-it-works"
            className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-zinc-300 backdrop-blur transition duration-300 hover:bg-white/10"
          >
            How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}