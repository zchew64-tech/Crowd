"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { getLabel, getTier } from "../lib/availability";
import type { LiveSpot as Spot } from "../types/liveSpot";
import { useReveal } from "./Reveal";

type SpotCardProps = {
  spot: Spot;
  index: number;
  saved: boolean;
  flash: number;
  onReport: () => void;
  onSave: () => void;
};

function useCountUp(value: number, active: boolean) {
  const [current, setCurrent] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    if (!active) return;

    if (
      played.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCurrent(value);
      played.current = true;
      return;
    }

    let frame = 0;
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min(1, (time - start) / 900);
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        played.current = true;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, active]);

  return current;
}

export default function SpotCard({
  spot,
  index,
  saved,
  flash,
  onReport,
  onSave,
}: SpotCardProps) {
  const [ref, shown] = useReveal<HTMLElement>();
  const [flashing, setFlashing] = useState(false);

  const percent = spot.seatAvailability;
  const displayed = useCountUp(percent, shown);
  const tier = getTier(percent);

  useEffect(() => {
    if (flash === 0) return;

    setFlashing(true);
    const timer = setTimeout(() => setFlashing(false), 1600);
    return () => clearTimeout(timer);
  }, [flash]);

  return (
    <article
      ref={ref}
      id={`spot-${spot.id}`}
      className={`row rv ${shown ? "in" : ""} ${flashing ? "fl" : ""}`}
      style={{ "--d": `${index * 70}ms` } as CSSProperties}
    >
      <div>
        <h3>{spot.name}</h3>
        <div className="meta">
          {spot.type} · {spot.distance} away
        </div>
      </div>

      <div style={spot.isStale ? { opacity: 0.5 } : undefined}>
        <div className="pct">
          <span>{displayed}</span>%<small>{getLabel(percent)}</small>
        </div>

        <div className="bar">
          <i
            className={tier}
            style={{ "--w": `${percent}%` } as CSSProperties}
          />
        </div>
      </div>

      <div className="chips">
        <span>
          <em>Noise</em>
          {spot.noise}
        </span>
        <span>
          <em>Wi-Fi</em>
          {spot.wifi}
        </span>
        <span>
          <em>Outlets</em>
          {spot.outlets}
        </span>
      </div>

      <div className="act">
        <span className="upd">
          Updated {spot.updated}
          {spot.isStale ? " · may be outdated" : ""}
        </span>

        <div className="ab">
          <button
            className="fav"
            aria-pressed={saved}
            aria-label={`Save ${spot.name}`}
            onClick={onSave}
          >
            {saved ? "♥" : "♡"}
          </button>

          <button className="pill sm" onClick={onReport}>
            Report
          </button>
        </div>
      </div>
    </article>
  );
}