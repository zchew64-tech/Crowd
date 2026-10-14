"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
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
import type { LiveSpot } from "./types/liveSpot";
import type { Spot } from "./types/spot";

const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

function formatRelativeTime(timestamp: Timestamp | null, currentTime: number) {
  if (!timestamp) return "just now";

  const diffMs = currentTime - timestamp.toMillis();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes === 1) return "1 min ago";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "1 hr ago";
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function isSpotStale(timestamp: Timestamp | null, currentTime: number) {
  if (!timestamp) return false;
  return currentTime - timestamp.toMillis() > STALE_THRESHOLD_MS;
}

export default function Home() {
  const [rawSpots, setRawSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
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

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promoShown = useRef(false);
  const dismissed = useRef(false);
  const ready = useRef(false);
  const previous = useRef(new Map<string, { sum: number; count: number }>());
  const selfReports = useRef(new Set<string>());

  /* ---------- spots as the design components expect them ---------- */

  const spotList: LiveSpot[] = useMemo(
    () =>
      rawSpots.map((spot) => ({
        id: spot.id,
        name: spot.name,
        type: spot.type,
        address: spot.address,
        distance: spot.distance,
        seatAvailability: spot.seatAvailability,
        availabilityText: spot.availabilityText,
        noise: spot.noise,
        wifi: spot.wifi,
        outlets: spot.outlets,
        updated: formatRelativeTime(spot.lastUpdatedAt, now),
        isStale: isSpotStale(spot.lastUpdatedAt, now),
      })),
    [rawSpots, now]
  );

  const listRef = useRef(spotList);

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

  const flash = useCallback((id: string) => {
    setFlashes((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }, []);

  /* ---------- live data from Firestore ---------- */

  useEffect(() => {
    const spotsRef = collection(db, "spots");

    async function seedIfEmpty() {
      const snapshot = await getDocs(spotsRef);

      if (snapshot.empty) {
        const batch = writeBatch(db);

        initialSpots.forEach((spot) => {
          batch.set(doc(db, "spots", spot.id), {
            ...spot,
            reportCount: 1,
            reportSum: spot.seatAvailability,
            lastUpdatedAt: serverTimestamp(),
          });
        });

        await batch.commit();
      }
    }

    seedIfEmpty();

    const unsubscribe = onSnapshot(spotsRef, (snapshot) => {
      const liveSpots = snapshot.docs.map(
        (docSnap) => docSnap.data() as Spot
      );

      // After the first load, every new report shows up in the live feed.
      if (ready.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "modified") return;

          const data = change.doc.data() as Spot;
          const before = previous.current.get(data.id);
          if (!before || data.reportCount <= before.count) return;

          const reported = Math.round(
            (data.reportSum - before.sum) / (data.reportCount - before.count)
          );
          const mine = selfReports.current.delete(data.id);

          flash(data.id);
          setFeed((current) => ({
            id: current.id + 1,
            when: "Just now",
            text: `${mine ? "You" : "A student"} reported ${getReportText(
              reported
            )} at ${data.name}`,
          }));
        });
      }

      previous.current = new Map(
        liveSpots.map((spot) => [
          spot.id,
          { sum: spot.reportSum, count: spot.reportCount },
        ])
      );

      setRawSpots(liveSpots);

      if (liveSpots.length > 0) {
        ready.current = true;
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [flash]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Pop-up card after the visitor scrolls past most of the first screen.
  useEffect(() => {
    function onScroll() {
      if (promoShown.current || dismissed.current) return;

      if (window.scrollY > window.innerHeight * 0.7) {
        const best = [...listRef.current].sort(
          (a, b) => b.seatAvailability - a.seatAvailability
        )[0];

        if (best) {
          promoShown.current = true;
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

  const plentyCount = spotList.filter(
    (spot) => spot.seatAvailability >= 75
  ).length;

  const selectedSpot = spotList.find((spot) => spot.id === selectedId);

  /* ---------- actions ---------- */

  async function handleAvailabilityReport(availability: number) {
    if (!selectedId) return;

    const targetSpot = rawSpots.find((spot) => spot.id === selectedId);
    if (!targetSpot) return;

    const spotRef = doc(db, "spots", targetSpot.id);

    selfReports.current.add(targetSpot.id);
    setSelectedId(null);

    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(spotRef);
        if (!snapshot.exists()) return;

        const current = snapshot.data() as Spot;
        const newReportCount = current.reportCount + 1;
        const newReportSum = current.reportSum + availability;
        const newAverage = Math.round(newReportSum / newReportCount);

        transaction.update(spotRef, {
          reportCount: newReportCount,
          reportSum: newReportSum,
          seatAvailability: newAverage,
          availabilityText: getAvailabilityText(newAverage),
          lastUpdatedAt: serverTimestamp(),
        });
      });

      say(`Thanks — ${targetSpot.name} updated!`);
    } catch {
      selfReports.current.delete(targetSpot.id);
      say("Sorry, your report didn't go through. Please try again.");
    }
  }

  function toggleSave(spot: LiveSpot) {
    const alreadySaved = savedIds.has(spot.id);

    setSavedIds((current) => {
      const next = new Set(current);
      if (alreadySaved) next.delete(spot.id);
      else next.add(spot.id);
      return next;
    });

    if (!alreadySaved) say(`${spot.name} saved to your spots.`);
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
              {isLoading &&
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

              {!isLoading && visibleSpots.length === 0 && (
                <p className="empty">
                  No spots found. Try searching for another cafe or lounge.
                </p>
              )}

              {!isLoading &&
                visibleSpots.map((spot, index) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    index={index}
                    saved={savedIds.has(spot.id)}
                    flash={flashes[spot.id] ?? 0}
                    onReport={() => setSelectedId(spot.id)}
                    onSave={() => toggleSave(spot)}
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
        onSubmit={handleAvailabilityReport}
      />
    </>
  );
}