import { useEffect, useState } from "react";

type ReportModalProps = {
  spotName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (availability: number, photo: File | null) => void;
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ReportModal({
  spotName,
  isOpen,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [selectedAvailability, setSelectedAvailability] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAvailability(null);
      setPhoto(null);
      setPhotoPreview(null);
      setFileError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    if (isSubmitting) return;
    onClose();
  }

  function handleSelectAvailability(value: number) {
    setSelectedAvailability(value);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("Image must be under 5MB.");
      return;
    }

    setFileError(null);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleRemovePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setFileError(null);
  }

  async function handleFinalSubmit() {
    if (selectedAvailability === null || isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit(selectedAvailability, photo);
    // Don't reset here — the parent closes the modal once done,
    // which triggers the useEffect above to reset state.
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950 p-7 shadow-2xl shadow-purple-950/50"
        onClick={(event) => event.stopPropagation()}
      >
        {selectedAvailability === null ? (
          <>
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
                onClick={handleClose}
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
                  onClick={() => handleSelectAvailability(option.value)}
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
              onClick={handleClose}
              className="mt-6 w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-purple-300">
                  Add a photo (optional)
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {spotName}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Photos help others see the space right now. They're
                  automatically removed after 1 hour.
                </p>
              </div>

              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                aria-label="Close report window"
              >
                ×
              </button>
            </div>

            <div className="mt-7">
              {photoPreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={photoPreview}
                    alt="Selected preview"
                    className="max-h-64 w-full object-cover"
                  />

                  {!isSubmitting && (
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm text-white backdrop-blur transition hover:bg-black/90"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-10 text-center transition hover:border-purple-400/40 hover:bg-purple-500/5">
                  <span className="text-3xl text-zinc-500">+</span>
                  <span className="text-sm font-medium text-zinc-300">
                    Tap to upload a photo
                  </span>
                  <span className="text-xs text-zinc-500">
                    JPG or PNG, up to 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              )}

              {fileError && (
                <p className="mt-3 text-sm text-rose-400">{fileError}</p>
              )}
            </div>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setSelectedAvailability(null)}
                disabled={isSubmitting}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                Back
              </button>

              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-700 py-3 text-sm font-bold text-white shadow-xl shadow-purple-950/40 transition duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmitting
                  ? "Submitting…"
                  : photo
                  ? "Submit with photo"
                  : "Submit without photo"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}