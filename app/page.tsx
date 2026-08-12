"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "@/lib/firebase";
import type { Spot } from "./types/spot";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import MapBackground from "./components/MapBackground";
import Navbar from "./components/Navbar";
import ReportModal from "./components/ReportModal";
import SearchBar from "./components/SearchBar";
import SortMenu from "./components/SortMenu";
import SpotCard from "./components/SpotCard";
import SpotCardSkeleton from "./components/SpotCardSkeleton";
import StatsBar from "./components/StatsBar";
import Toast from "./components/Toast";
import { spots as initialSpots } from "./data/spots";

const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

type SortOption = "nearest" | "mostAvailable" | "leastAvailable";

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

function parseDistance(distance: string) {
  // "0.6 mi" -> 0.6
  return parseFloat(distance) || 0;
}

async function uploadReportPhoto(spotId: string, file: File) {
  const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
  const storagePath = `reports/${spotId}/${safeFileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const storageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "photos"), {
    spotId,
    storageUrl,
    storagePath,
    uploadedAt: serverTimestamp(),
  });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [spotList, setSpotList] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("nearest");

  const resultsRef = useRef<HTMLDivElement | null>(null);

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

      setSpotList(liveSpots);

      if (liveSpots.length > 0) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const filteredSpots = spotList.filter((spot) =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedSpots = useMemo(() => {
    const spotsCopy = [...filteredSpots];

    switch (sortBy) {
      case "mostAvailable":
        return spotsCopy.sort(
          (a, b) => b.seatAvailability - a.seatAvailability
        );
      case "leastAvailable":
        return spotsCopy.sort(
          (a, b) => a.seatAvailability - b.seatAvailability
        );
      case "nearest":
      default:
        return spotsCopy.sort(
          (a, b) => parseDistance(a.distance) - parseDistance(b.distance)
        );
    }
  }, [filteredSpots, sortBy]);

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleAvailabilityReport(
    availability: number,
    photo: File | null
  ) {
    if (!selectedSpot) return;

    const targetSpot = spotList.find((spot) => spot.name === selectedSpot);
    if (!targetSpot) return;

    const spotRef = doc(db, "spots", targetSpot.id);

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

    if (photo) {
      try {
        await uploadReportPhoto(targetSpot.id, photo);
      } catch (error) {
        console.error("Photo upload failed:", error);
        setToastMessage(
          `Thanks — ${targetSpot.name} updated! (Photo upload failed)`
        );
        setSelectedSpot(null);
        return;
      }
    }

    setToastMessage(`Thanks — ${targetSpot.name} updated!`);
    setSelectedSpot(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-8 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b0764_0%,#09090b_45%,#000_100%)]" />

      <MapBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <Navbar />

        <Hero onExplore={scrollToResults} />

        <StatsBar spots={spotList} />

        <SearchBar search={search} setSearch={setSearch} />

        <div ref={resultsRef} className="scroll-mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Open Seats Nearby
            </h2>

            <SortMenu sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <SpotCardSkeleton />
              <SpotCardSkeleton />
              <SpotCardSkeleton />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {sortedSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    {...spot}
                    updated={formatRelativeTime(spot.lastUpdatedAt, now)}
                    isStale={isSpotStale(spot.lastUpdatedAt, now)}
                    onReport={() => setSelectedSpot(spot.name)}
                  />
                ))}
              </div>

              {sortedSpots.length === 0 && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-zinc-300 backdrop-blur">
                  No spots found. Try searching for another cafe or lounge.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />

      <Toast message={toastMessage} />

      <ReportModal
        spotName={selectedSpot ?? ""}
        isOpen={selectedSpot !== null}
        onClose={() => setSelectedSpot(null)}
        onSubmit={handleAvailabilityReport}
      />
    </main>
  );
}