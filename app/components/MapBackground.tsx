export default function MapBackground() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 hidden h-[420px] w-[62%] overflow-hidden opacity-70 lg:block">
      <div className="absolute inset-0 bg-gradient-to-l from-purple-950/40 via-black/10 to-transparent" />

      <div className="absolute left-10 top-24 h-1 w-[620px] rotate-12 rounded-full bg-purple-400/15 blur-[1px]" />
      <div className="absolute left-24 top-44 h-1 w-[720px] -rotate-12 rounded-full bg-violet-400/15 blur-[1px]" />
      <div className="absolute left-0 top-64 h-1 w-[760px] rotate-3 rounded-full bg-fuchsia-400/10 blur-[1px]" />
      <div className="absolute left-80 top-4 h-[380px] w-1 rotate-45 rounded-full bg-purple-400/10 blur-[1px]" />
      <div className="absolute left-[470px] top-0 h-[400px] w-1 -rotate-12 rounded-full bg-violet-400/10 blur-[1px]" />

      {[
        "left-72 top-24 h-5 w-5",
        "left-[470px] top-36 h-11 w-11",
        "left-64 top-60 h-6 w-6",
        "left-[690px] top-32 h-5 w-5",
      ].map((pin, index) => (
        <div
          key={index}
          className={`absolute ${pin} rounded-full bg-purple-300 shadow-[0_0_40px_#a855f7]`}
        />
      ))}
    </div>
  );
}