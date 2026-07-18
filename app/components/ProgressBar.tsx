type ProgressBarProps = {
  crowd: number;
};

function getCrowdColor(crowd: number) {
  if (crowd < 50) return "from-green-400 to-emerald-500";
  if (crowd < 75) return "from-yellow-300 to-orange-400";
  return "from-rose-400 to-red-500";
}

export default function ProgressBar({ crowd }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getCrowdColor(
            crowd
          )} shadow-lg transition-all duration-700`}
          style={{ width: `${crowd}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>Open</span>
        <span>Busy</span>
        <span>Full</span>
      </div>
    </div>
  );
}