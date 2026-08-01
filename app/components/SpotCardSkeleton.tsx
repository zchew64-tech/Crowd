export default function SpotCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
      <div className="grid gap-7 lg:grid-cols-[1.1fr_1.25fr_1.2fr_.75fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-6 w-16 rounded-full bg-white/10" />
            <div className="h-4 w-20 rounded bg-white/5" />
          </div>
          <div className="h-7 w-40 rounded bg-white/10" />
          <div className="mt-3 h-6 w-20 rounded-full bg-white/5" />
        </div>

        <div>
          <div className="h-4 w-28 rounded bg-white/5" />
          <div className="mt-3 h-10 w-24 rounded bg-white/10" />
          <div className="mt-5 h-3 w-full rounded-full bg-white/5" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="h-28 rounded-2xl bg-white/5" />
          <div className="h-28 rounded-2xl bg-white/5" />
          <div className="h-28 rounded-2xl bg-white/5" />
        </div>

        <div className="flex flex-col items-start justify-between lg:items-end">
          <div className="h-4 w-24 rounded bg-white/5" />
          <div className="mt-6 h-11 w-40 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}