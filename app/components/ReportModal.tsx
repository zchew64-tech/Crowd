type ReportModalProps = {
  spotName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (availability: number) => void;
};

const options = [
  {
    label: "Plenty of seats",
    description: "Many tables or seats are open",
    value: 90,
  },
  {
    label: "Some seats",
    description: "A few seats are still available",
    value: 65,
  },
  {
    label: "Limited seating",
    description: "Only one or two seats appear open",
    value: 30,
  },
  {
    label: "No seats",
    description: "The location appears completely full",
    value: 5,
  },
];

export default function ReportModal({
  spotName,
  isOpen,
  onClose,
  onSubmit,
}: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950 p-7 shadow-2xl shadow-purple-950/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-purple-300">
              Report availability
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {spotName}
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              What does the seating situation look like right now?
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close report window"
          >
            ×
          </button>
        </div>

        <div className="mt-7 space-y-3">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => onSubmit(option.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-purple-500/10"
            >
              <p className="font-semibold text-white">{option.label}</p>
              <p className="mt-1 text-sm text-zinc-400">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}