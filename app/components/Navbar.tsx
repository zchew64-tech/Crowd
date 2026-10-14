"use client";

import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const progress = useRef<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let ticking = false;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;

      if (progress.current) {
        progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }

      setStuck(y > 10);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  }

  return (
    <>
      <div ref={progress} className="prog" aria-hidden="true" />

      <div className="wrap util">
        <a href="#spots">Find a spot</a>
        <a href="#how">Support</a>
        <a href="#top">For business ↗</a>
      </div>

      <div className={`navbar ${stuck ? "s" : ""}`}>
        <div className="wrap">
          <nav aria-label="Main">
            <a className="logo" href="#top">
              CROWD
            </a>

            <div className="links">
              <a href="#spots">All spots</a>
              <a href="#cat">Cafés</a>
              <a href="#cat">Lounges</a>
              <a href="#cat">Libraries</a>
              <a href="#how">How it works</a>
            </div>

            <div className="icons">
              <button
                className="tg"
                onClick={toggleTheme}
                aria-label="Switch between light and dark theme"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
                </svg>
              </button>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5" />
              </svg>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}