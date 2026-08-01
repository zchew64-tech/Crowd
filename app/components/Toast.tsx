type ToastProps = {
  message: string | null;
};

export default function Toast({ message }: ToastProps) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-purple-400/30 bg-zinc-950/95 px-6 py-4 text-sm font-medium text-white shadow-2xl shadow-purple-950/50 backdrop-blur-xl transition-all duration-300 ${
        message
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          ✓
        </span>
        {message ?? ""}
      </div>
    </div>
  );
}