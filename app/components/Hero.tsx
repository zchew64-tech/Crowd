"use client";

import { useEffect, useRef } from "react";

import Reveal from "./Reveal";

export default function Hero() {
  const hero = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function update() {
      const el = hero.current;
      if (el && window.scrollY < el.offsetHeight) {
        el.style.setProperty("--py", `${window.scrollY * 0.12}px`);
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={hero} className="hero" aria-label="Featured">
      <div className="stage" aria-hidden="true">
        <div className="phone a">
          <div className="screen">
            <div className="s-top">CROWD</div>

            <div className="s-card">
              <small>Lounge · 0.3 mi</small>
              <b>UCR Student Lounge</b>
              <div className="s-num">94%</div>
              <div className="s-bar"><i style={{ width: "94%" }} /></div>
            </div>

            <div className="s-card">
              <small>Library · 0.4 mi</small>
              <b>Orbach Science Library</b>
              <div className="s-num">76%</div>
              <div className="s-bar"><i style={{ width: "76%" }} /></div>
            </div>

            <div className="s-card">
              <small>Cafe · 0.9 mi</small>
              <b>Starbucks University Ave</b>
              <div className="s-num" style={{ color: "#777" }}>47%</div>
              <div className="s-bar">
                <i style={{ width: "47%", background: "#777" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="phone b">
          <div className="screen">
            <div className="s-top">Report availability</div>
            <div className="s-h">7 Leaves Cafe</div>
            <small style={{ color: "#777", fontSize: 12 }}>
              What does seating look like right now?
            </small>

            <div className="opt">
              Plenty of seats<small>Many tables are open</small>
            </div>
            <div className="opt on">
              Some seats<small>A few seats are still available</small>
            </div>
            <div className="opt">
              Limited seating<small>One or two seats appear open</small>
            </div>
            <div className="opt">
              No seats<small>The location appears full</small>
            </div>
          </div>
        </div>
      </div>

      <div className="copy">
        <Reveal className="live">Live now near UCR</Reveal>

        <Reveal tag="p" className="line" delay={120}>
          <span>Cafés</span>
          <span>Lounges</span>
          <span>Libraries</span>
        </Reveal>

        <Reveal tag="p" className="sub" delay={240}>
          See open seats before you go
        </Reveal>

        <Reveal className="cta" delay={340}>
          <a className="link" href="#how">
            How it works
          </a>
          <a className="pill" href="#spots">
            Explore spots
          </a>
        </Reveal>
      </div>

      <div className="dots" aria-hidden="true">
        <i className="on" />
        <i />
        <i />
      </div>
    </section>
  );
}