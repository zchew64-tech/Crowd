"use client";

import { useEffect, useRef } from "react";

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
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    if (isOpen && !el.open) el.showModal();
    if (!isOpen && el.open) el.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="report-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dlg-in">
        <h3 id="report-title">{spotName || "Report availability"}</h3>
        <p>What does the seating situation look like right now?</p>

        {options.map((option) => (
          <button
            key={option.label}
            className="o"
            onClick={() => onSubmit(option.value)}
          >
            <b>{option.label}</b>
            <span>{option.description}</span>
          </button>
        ))}

        <button className="pill x" onClick={onClose}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}