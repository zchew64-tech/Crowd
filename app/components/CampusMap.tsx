"use client";

import { useState } from "react";

import { getTier } from "../lib/availability";
import type { LiveSpot as Spot } from "../types/liveSpot";
import Reveal from "./Reveal";

const PIN_POSITIONS: Record<string, [number, number]> = {
  "ucr-student-lounge": [540, 175],
  "orbach-library": [610, 228],
  "coffee-bean-ucr": [715, 140],
  "7-leaves-riverside": [770, 275],
  "starbucks-university": [880, 195],
  "lift-coffee-riverside": [1050, 335],
};

type CampusMapProps = {
  spots: Spot[];
  visibleIds: Set<string>;
  highlightId: string | null;
  onPick: (id: string) => void;
};

export default function CampusMap({
  spots,
  visibleIds,
  highlightId,
  onPick,
}: CampusMapProps) {
  const [tipId, setTipId] = useState<string | null>(null);

  const tipSpot = spots.find((spot) => spot.id === tipId);
  const tipPosition = tipId ? PIN_POSITIONS[tipId] : undefined;

  return (
    <section className="block" id="map" aria-labelledby="map-heading">
      <Reveal tag="h2" id="map-heading">
        Around campus
      </Reveal>

      <Reveal className="map">
        <svg
          viewBox="0 0 1200 460"
          role="group"
          aria-label="Map of study spots near UCR"
        >
          <path className="rd" d="M-20 262 C300 250 600 285 1220 232" />
          <path className="rd" d="M960 -20 C930 150 990 300 940 480" />
          <path className="rd rd2" d="M-20 90 C250 120 420 60 700 80 S1000 60 1220 100" />
          <path className="rd rd2" d="M300 480 C340 360 380 300 420 -20" />
          <path className="rd rd2" d="M700 480 C720 380 690 330 730 -20" />

          <rect className="cam" x="430" y="110" width="290" height="185" rx="30" />
          <text className="ml" x="452" y="146">UC Riverside</text>
          <text className="ml" x="40" y="242">University Ave</text>
          <text className="ml" x="972" y="420">Chicago Ave</text>

          {spots.map((spot) => {
            const position = PIN_POSITIONS[spot.id];
            if (!position) return null;

            const off = !visibleIds.has(spot.id);
            const highlighted = highlightId === spot.id;

            return (
              <g
                key={spot.id}
                className={`pin ${getTier(spot.seatAvailability)} ${off ? "off" : ""} ${highlighted ? "hl" : ""}`}
                transform={`translate(${position[0]},${position[1]})`}
                tabIndex={0}
                role="button"
                aria-label={`${spot.name}, ${spot.seatAvailability}% of seats open`}
                onMouseEnter={() => setTipId(spot.id)}
                onMouseLeave={() => setTipId(null)}
                onFocus={() => setTipId(spot.id)}
                onBlur={() => setTipId(null)}
                onClick={() => onPick(spot.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPick(spot.id);
                  }
                }}
              >
                <circle className="ring" r="16" />
                <circle className="dotc" r="17" />
                <text textAnchor="middle" dy=".35em">
                  {spot.seatAvailability}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          className={`tip ${tipSpot && tipPosition ? "on" : ""}`}
          style={
            tipPosition
              ? {
                  left: `${tipPosition[0] / 12}%`,
                  top: `${tipPosition[1] / 4.6}%`,
                }
              : undefined
          }
        >
          {tipSpot && (
            <>
              {tipSpot.name} · <b>{tipSpot.seatAvailability}%</b> open
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}