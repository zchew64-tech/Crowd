export default function StatsBar() {
  return (
    <section className="mb-10 grid gap-4 md:grid-cols-3">
      <StatCard label="Study spots tracked" value="12" detail="Cafes & lounges near UCR" />
      <StatCard label="Available now" value="7" detail="Low to moderate crowd levels" />
      <StatCard label="Last updated" value="30s" detail="Community-powered reports" />
    </section>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.08]">
      <p className="text-sm text-zinc-500">{label}</p>
      <h3 className="mt-2 text-4xl font-black tracking-tight text-white">
        {value}
      </h3>
      <p className="mt-2 text-sm text-zinc-400">{detail}</p>
    </div>
  );
}