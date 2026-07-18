"use client";

import { useRef, useState } from "react";

import Hero from "./components/Hero";
import MapBackground from "./components/MapBackground";
import Navbar from "./components/Navbar";
import ReportModal from "./components/ReportModal";
import SearchBar from "./components/SearchBar";
import SpotCard from "./components/SpotCard";
import StatsBar from "./components/StatsBar";
import { spots as initialSpots } from "./data/spots";

function getAvailabilityText(availability: number) {
  if (availability >= 80) {
    return "High chance of finding seating";
  }

  if (availability >= 50) {
    return "Some seats are available";
  }

  if (availability >= 20) {
    return "Limited seating available";
  }

  return "Very unlikely to find seating";
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [spotList, setSpotList] = useState(initialSpots);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const filteredSpots = spotList.filter((spot) =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  );

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleAvailabilityReport(availability: number) {
    if (!selectedSpot) return;

    setSpotList((currentSpots) =>
      currentSpots.map((spot) =>
        spot.name === selectedSpot
          ? {
              ...spot,
              seatAvailability: availability,
              availabilityText: getAvailabilityText(availability),
              updated: "just now",
            }
          : spot
      )
    );

    setSelectedSpot(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-8 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e3a8a_0%,#09090b_45%,#000_100%)]" />

      <MapBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <Navbar />

        <Hero onExplore={scrollToResults} />

        <StatsBar />

        <SearchBar search={search} setSearch={setSearch} />

        <div ref={resultsRef} className="scroll-mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Open Seats Nearby
            </h2>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition hover:bg-white/10">
              Sort by: Nearest
            </button>
          </div>

          <div className="space-y-4">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.name}
                {...spot}
                onReport={() => setSelectedSpot(spot.name)}
              />
            ))}
          </div>

          {filteredSpots.length === 0 && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-zinc-300 backdrop-blur">
              No spots found. Try searching for another cafe or lounge.
            </div>
          )}
        </div>
      </section>

      <ReportModal
        spotName={selectedSpot ?? ""}
        isOpen={selectedSpot !== null}
        onClose={() => setSelectedSpot(null)}
        onSubmit={handleAvailabilityReport}
      />
    </main>
  );
}