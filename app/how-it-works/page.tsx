import Link from "next/link";

import Navbar from "../components/Navbar";

const steps = [
  {
    number: "01",
    title: "We track cafés and lounges near UCR",
    description:
      "Each spot on the map — cafés, lounges, and the library — has a live seat availability score based on recent reports from people like you.",
  },
  {
    number: "02",
    title: "Anyone can report what they see",
    description:
      "Sitting at a spot right now? Tap \"Report availability\" on that spot's card and let us know whether it's plenty, some, limited, or no seats.",
  },
  {
    number: "03",
    title: "The crowd meter updates instantly",
    description:
      "Your report immediately updates that spot's availability percentage and crowd bar, so the next person searching sees fresh, real information.",
  },
];

const crowdLevels = [
  {
    range: "75–100%",
    label: "Open",
    color: "from-emerald-400 to-emerald-500",
    description: "Plenty of open seats. Good chance you'll find a table right away.",
  },
  {
    range: "50–74%",
    label: "Some seats",
    color: "from-amber-300 to-orange-400",
    description: "A handful of seats left. Might need to wait or look around a bit.",
  },
  {
    range: "0–49%",
    label: "Busy / Full",
    color: "from-rose-400 to-red-500",
    description: "Seating is limited or the spot is essentially full right now.",
  },
];

export default function HowItWorks() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-8 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b0764_0%,#09090b_45%,#000_100%)]" />

      <section className="relative z-10 mx-auto max-w-4xl">
        <Navbar />

        <div className="mb-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back home
          </Link>

          <h1 className="text-5xl font-black leading-tight tracking-tight">
            How{" "}
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-500 bg-clip-text text-transparent">
              crowd
            </span>{" "}
            works
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Crowd is a community-powered way to see how busy cafés and lounges
            around UCR are before you make the trip. Here&apos;s how it all
            works.
          </p>
        </div>

        <div className="mb-16 space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-6 rounded-3xl border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <span className="bg-gradient-to-br from-purple-300 to-purple-700 bg-clip-text text-3xl font-black text-transparent">
                {step.number}
              </span>

              <div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 leading-7 text-zinc-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            What the crowd meter means
          </h2>

          <div className="space-y-4">
            {crowdLevels.map((level) => (
              <div
                key={level.label}
                className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full bg-gradient-to-r ${level.color}`}
                    />
                    <span className="font-semibold text-white">
                      {level.label}
                    </span>
                  </div>

                  <span className="text-sm text-zinc-500">{level.range}</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-purple-400/20 bg-purple-500/10 p-8 text-center backdrop-blur">
          <h3 className="text-xl font-bold text-white">
            Ready to find a seat?
          </h3>
          <p className="mt-2 text-zinc-300">
            Head back and check out what&apos;s open right now.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-violet-700 px-7 py-4 font-semibold shadow-xl shadow-purple-950/40 transition duration-300 hover:scale-105"
          >
            Explore Nearby Spots
          </Link>
        </div>
      </section>
    </main>
  );
}