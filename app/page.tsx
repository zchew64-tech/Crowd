"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import CampusMap from "./components/CampusMap";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ReportModal from "./components/ReportModal";
import Reveal from "./components/Reveal";
import SearchBar, { type Filter } from "./components/SearchBar";
import {
  Categories,
  CtaBand,
  Footer,
  HowItWorks,
  LiveTicker,
  Toast,
  type FeedItem,
} from "./components/Sections";
import SortMenu, { type SortOption } from "./components/SortMenu";
import SpotCard from "./components/SpotCard";
import StatsBar from "./components/StatsBar";
import { spots as initialSpots } from "./data/spots";
import {
  getAvailabilityText,
  getLabel,
  getReportText,
} from "./lib/availability";
import type { Spot } from "./types/spot";

export default function Home() {
  const [spotList, setSpotList] = useState<Spot[]>(initialSpots);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [flashes, setFlashes] = useState<Record<string, number>>({});
  const [feed, setFeed] = useState<FeedItem>({
    id: 0,
    when: "",
    text: "Reports from students near UCR appear here as they come in.",
  });
  const [toast, setToast] = useState({
    message: "",
    open: false,
    showLink: false,
  });

  const listRef = useRef(spotList);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promoShown = useRef(false);
  const dismissed = useRef(false);

  useEffect(() => {
    listRef.current = spotList;
  }, [spotList]);

  /* ---------- pop-up card ---------- */

  const say = useCallback((message: string, showLink = false) => {
    setToast({ message, open: true, showLink });

    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((current) => ({ ...current, open: false })),
      7000
    );
  }, []);

  const closeToast = useCallback(() => {
    dismissed.current = true;
    setToast((current) => ({ ...current, open: false }));
  }, []);

  /* ---------- live updates ---------- */

  const flash = useCallback((id: string) => {
    setFlashes((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }, []);

  const pushReport = useCallback(
    (id: string, value: number, who: string) => {
      const spot = listRef.current.find((item) => item.id === id);
      if (!spot) return;

      const timestamp = Date.now();

      setSpotList((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                seatAvailability: value,
                availabilityText: getAvailabilityText(value),
                updated: "just now",
                updatedAt: timestamp,
              }
            : item
        )
      );

      setNow(timestamp);
      flash(id);
      setFeed((current) => ({
        id: current.id + 1,
        when: "Just now",
        text: `${who} reported ${getReportText(value)} at ${spot.name}`,
      }));
    },
    [flash]
  );

  // First load: stamp update times, show the skeleton briefly, tick the clock.
  useEffect(() => {
    const start = Date.now();
    setNow(start);
    setSpotList((current) =>
      current.map((spot) => ({
        ...spot,
        updatedAt: start - parseInt(spot.updated, 10) * 60000,
      }))
    );

    const loadTimer = setTimeout(() => setLoading(false), 1100);
    const clock = setInterval(() => setNow(Date.now()), 10000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(clock);
    };
  }, []);

  // Simulated reports from other students. Replace with Firestore listeners later.
  useEffect(() => {
    const timer = setInterval(() => {
      const current = listRef.current;
      const spot = current[Math.floor(Math.random() * current.length)];

      let next =
        spot.seatAvailability + Math.round((Math.random() - 0.5) * 28);
      next = Math.max(4, Math.min(98, next));
      if (next === spot.seatAvailability) {
        next += next > 50 ? -3 : 3;
      }

      pushReport(spot.id, next, "A student");
    }, 4500);

    return () => clearInterval(timer);
  }, [pushReport]);

  // Pop-up card after the visitor scrolls past most of the first screen.
  useEffect(() => {
    function onScroll() {
      if (promoShown.current || dismissed.current) return;

      if (window.scrollY > window.innerHeight * 0.7) {
        promoShown.current = true;

        const best = [...listRef.current].sort(
          (a, b) => b.seatAvailability - a.seatAvailability
        )[0];

        if (best) {
          say(
            `${best.seatAvailability}% of seats are open at ${best.name} right now.`,
            true
          );
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [say]);

  /* ---------- search, filter, sort ---------- */

  const visibleSpots = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = spotList.filter((spot) => {
      if (!spot.name.toLowerCase().includes(query)) return false;
      if (filter === "all") return true;
      if (filter === "quiet") return spot.noise === "Quiet";
      if (filter === "outlets") return spot.outlets === "Plenty";
      return spot.type === filter;
    });

    return matches.sort((a, b) => {
      if (sortBy === "mostAvailable") {
        return b.seatAvailability - a.seatAvailability;
      }
      if (sortBy === "leastAvailable") {
        return a.seatAvailability - b.seatAvailability;
      }
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
  }, [spotList, search, filter, sortBy]);

  const visibleIds = useMemo(
    () => new Set(visibleSpots.map((spot) => spot.id)),
    [visibleSpots]
  );

  const plentyCount = spotList.filter(
    (spot) => spot.seatAvailability >= 75
  ).length;

  const selectedSpot = spotList.find((spot) => spot.id === selectedId);

  /* ---------- actions ---------- */

  function handleReport(value: number) {
    if (!selectedId) return;

    const spot = spotList.find((item) => item.id === selectedId);
    pushReport(selectedId, value, "You");

    if (spot) {
      say(
        `Thanks. ${spot.name} is now marked ${getLabel(value).toLowerCase()}.`
      );
    }

    setSelectedId(null);
  }

  function toggleSave(spot: Spot) {
    const alreadySaved = savedIds.has(spot.id);

    setSavedIds((current) => {
      const next = new Set(current);
      if (alreadySaved) next.delete(spot.id);
      else next.add(spot.id);
      return next;
    });

    if (!alreadySaved) say(`${spot.name} saved to your spots.`);
  }

  function jumpToSpot(id: string) {
    const go = () => {
      const row = document.getElementById(`spot-${id}`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        flash(id);
      }
    };

    if (document.getElementById(`spot-${id}`)) {
      go();
    } else {
      setSearch("");
      setFilter("all");
      setTimeout(go, 80);
    }
  }

  function openNearestReport() {
    const nearest = [...spotList].sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    )[0];

    if (nearest) setSelectedId(nearest.id);
  }

  return (
    <>
      <Navbar />

      <main id="top">
        <Hero />

        <LiveTicker feed={feed} />

        <div className="wrap">
          <Categories spots={spotList} onPick={setFilter} />

          <CampusMap
            spots={spotList}
            visibleIds={visibleIds}
            highlightId={hoverId}
            onPick={jumpToSpot}
          />

          <section className="block" id="spots" aria-labelledby="open-heading">
            <Reveal className="head">
              <h2 id="open-heading">Open seats nearby</h2>
              <SortMenu sortBy={sortBy} setSortBy={setSortBy} />
            </Reveal>

            <SearchBar
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
            />

            <StatsBar total={spotList.length} plenty={plentyCount} />

            <div id="list">
              {loading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="row sk">
                    <div>
                      <i style={{ width: "70%" }} />
                      <i style={{ width: "40%" }} />
                    </div>
                    <div>
                      <i style={{ width: "45%", height: 38 }} />
                      <i style={{ height: 8 }} />
                    </div>
                    <div>
                      <i style={{ width: "85%" }} />
                    </div>
                    <div>
                      <i style={{ width: "60%", height: 38, marginLeft: "auto" }} />
                    </div>
                  </div>
                ))}

              {!loading && visibleSpots.length === 0 && (
                <p className="empty">
                  No spots match. Try another search or filter.
                </p>
              )}

              {!loading &&
                visibleSpots.map((spot, index) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    index={index}
                    now={now}
                    saved={savedIds.has(spot.id)}
                    flash={flashes[spot.id] ?? 0}
                    onReport={() => setSelectedId(spot.id)}
                    onSave={() => toggleSave(spot)}
                    onHover={setHoverId}
                  />
                ))}
            </div>
          </section>

          <HowItWorks />
        </div>

        <CtaBand onReport={openNearestReport} />
      </main>

      <Footer />

      <Toast
        message={toast.message}
        open={toast.open}
        showLink={toast.showLink}
        onClose={closeToast}
      />

      <ReportModal
        spotName={selectedSpot?.name ?? ""}
        isOpen={selectedId !== null}
        onClose={() => setSelectedId(null)}
        onSubmit={handleReport}
      />
    </>
  );
}