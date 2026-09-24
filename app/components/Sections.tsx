"use client";

import Reveal from "./Reveal";
import type { Filter } from "./SearchBar";
import type { Spot } from "../types/spot";

/* ---------- live activity strip ---------- */

export type FeedItem = {
  id: number;
  when: string;
  text: string;
};

export function LiveTicker({ feed }: { feed: FeedItem }) {
  return (
    <div className="tick">
      <div className="wrap">
        <span className="dot" />
        <b>Live</b>
        <span id="tk">
          <span key={feed.id} className="sw">
            {feed.when && <b>{feed.when}</b>}
            {feed.text}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ---------- browse by space ---------- */

export function Categories({
  spots,
  onPick,
}: {
  spots: Spot[];
  onPick: (filter: Filter) => void;
}) {
  const count = (type: string) => spots.filter((s) => s.type === type).length;

  const tiles: {
    filter: Filter;
    title: string;
    text: string;
    count: number;
  }[] = [
    {
      filter: "Cafe",
      title: "Cafés",
      text: "Coffee, tea, and a table for a few hours",
      count: count("Cafe"),
    },
    {
      filter: "Lounge",
      title: "Lounges",
      text: "Quiet seating with plenty of outlets",
      count: count("Lounge"),
    },
    {
      filter: "Library",
      title: "Libraries",
      text: "Silent floors and fast Wi-Fi on campus",
      count: count("Library"),
    },
  ];

  return (
    <section className="block" id="cat" aria-labelledby="browse-heading">
      <Reveal tag="h2" id="browse-heading">
        Browse by space
      </Reveal>

      <div className="tiles">
        {tiles.map((tile, index) => (
          <Reveal
            key={tile.filter}
            tag="a"
            href="#spots"
            className="tile"
            delay={index * 120}
            onClick={() => onPick(tile.filter)}
          >
            <div>
              <h3>{tile.title}</h3>
              <p>{tile.text}</p>
            </div>
            <div className="big">{tile.count}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- how it works ---------- */

export function HowItWorks() {
  const steps = [
    {
      title: "Check before you go",
      text: "See how full each café, lounge, and library is right now.",
    },
    {
      title: "Pick your spot",
      text: "Compare noise, Wi-Fi, and outlets, then sort by distance or open seats.",
    },
    {
      title: "Report what you see",
      text: "Tap one option when you arrive so the next student knows.",
    },
  ];

  return (
    <section className="block" id="how" aria-labelledby="how-heading">
      <Reveal tag="h2" id="how-heading">
        How Crowd works
      </Reveal>

      <div className="steps">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 140}>
            <hr />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- closing call to action ---------- */

export function CtaBand({ onReport }: { onReport: () => void }) {
  return (
    <section className="band">
      <Reveal className="wrap">
        <h2>Help your campus find a seat</h2>
        <p>One tap after you sit down keeps every number fresh.</p>
        <button className="pill" onClick={onReport}>
          Report availability
        </button>
      </Reveal>
    </section>
  );
}

/* ---------- footer ---------- */

export function Footer() {
  return (
    <footer className="wrap">
      <div className="f">
        <span>© 2026 Crowd. Made by UCR students.</span>
        <nav aria-label="Footer">
          <a href="#top">About</a>
          <a href="#top">Privacy</a>
          <a href="#top">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

/* ---------- pop-up card ---------- */

export function Toast({
  message,
  open,
  showLink,
  onClose,
}: {
  message: string;
  open: boolean;
  showLink: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`toast ${open ? "on" : ""}`}
      role="status"
      aria-live="polite"
    >
      <p>{message}</p>

      {showLink && (
        <a href="#spots" onClick={onClose}>
          View spots
        </a>
      )}

      <button onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    </aside>
  );
}