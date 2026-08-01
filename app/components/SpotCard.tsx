import type { ReactNode } from "react";

import {
  ClockIcon,
  NoiseIcon,
  OutletIcon,
  WifiIcon,
} from "./Icons";

type SpotCardProps = {
  name: string;
  type: string;
  distance: string;
  seatAvailability: number;
  availabilityText: string;
  noise: string;
  wifi: string;
  outlets: string;
  updated: string;
  reportCount: number;
  isStale: boolean;
  onReport: () => void;
};

function getAvailabilityColor(seatAvailability: number) {
  if (seatAvailability >= 75) {
    return {
      text: "text-emerald-400",
      bar: "from-emerald-400 to-green-500",
      glow: "shadow-emerald-500/20",
    };
  }

  if (seatAvailability >= 45) {
    return {
      text: "text-amber-300",
      bar: "from-amber-300 to-orange-400",
      glow: "shadow-amber-500/20",
    };
  }

  return {
    text: "text-rose-400",
    bar: "from-rose-400 to-red-500",
    glow: "shadow-rose-500/20",
  };
}

export default function SpotCard({
  name,
  type,
  distance,
  seatAvailability,
  availabilityText,
  noise,
  wifi,
  outlets,
  updated,
  reportCount,
  isStale,
  onReport,
}: SpotCardProps) {
  const availabilityColor = getAvailabilityColor(seatAvailability);

  return (
    <article className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/35 hover:bg-white/[0.075] hover:shadow-purple-950/40">
      <div className="grid gap-7 lg:grid-cols-[1.1fr_1.25fr_1.2fr_.75fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
              {type}
            </span>

            <span className="text-sm text-zinc-500">{distance} away</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white">
            {name}
          </h3>

          <p className="mt-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Open now
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Seat availability</p>

          {isStale ? (
            <div className="mt-2">
              <p className="text-2xl font-bold text-zinc-500">
                No recent reports
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Last known: {seatAvailability}% ({availabilityText})
              </p>
            </div>
          ) : (
            <>
              <div className="mt-2 flex items-end gap-3">
                <p
                  className={`text-5xl font-black tracking-tight ${availabilityColor.text}`}
                >
                  {seatAvailability}%
                </p>

                <p className="pb-2 text-sm text-zinc-300">
                  {availabilityText}
                </p>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${availabilityColor.bar} shadow-lg ${availabilityColor.glow} transition-all duration-700`}
                  style={{ width: `${seatAvailability}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>Limited</span>
                <span>Some seats</span>
                <span>Plenty</span>
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Based on {reportCount} {reportCount === 1 ? "report" : "reports"}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="Noise"
            value={noise}
            icon={<NoiseIcon />}
          />

          <MetricCard
            label="Wi-Fi"
            value={wifi}
            icon={<WifiIcon />}
          />

          <MetricCard
            label="Outlets"
            value={outlets}
            icon={<OutletIcon />}
          />
        </div>

        <div className="flex flex-col items-start justify-between lg:items-end">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <ClockIcon className="h-4 w-4" />
            <span>Updated {updated}</span>
          </div>

          <button
            onClick={onReport}
            className="mt-6 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-700 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-purple-950/40 transition duration-300 hover:scale-105 hover:shadow-purple-800/40"
          >
            Report availability
          </button>
        </div>
      </div>
    </article>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center transition duration-300 group-hover:border-purple-400/20 group-hover:bg-white/[0.07]">
      <div className="text-zinc-300">{icon}</div>
      <p className="mt-3 text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}