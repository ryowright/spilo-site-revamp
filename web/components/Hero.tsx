"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Stagger, staggerItem } from "./motion/Stagger";
import { REVEAL_EASE } from "./motion/transitions";

type Stat = {
  target: number;
  unit: string; // static letters right after the number, e.g. "K"
  tail: string; // static text after the red "+", e.g. " YRS"
  label: [string, string];
};

const STATS: Stat[] = [
  { target: 8000, unit: "", tail: "", label: ["Hours live", "VOD review"] },
  { target: 1000, unit: "", tail: "", label: ["Players", "coached"] },
  { target: 3, unit: "", tail: " YRS", label: ["Contenders", "head coach"] },
  { target: 120, unit: "K", tail: "", label: ["Followers across", "YouTube & Twitch"] },
];

// Counts up from 0 to `target` once when scrolled into view. `delay` lets the
// count start a beat after trigger so the strip sequences after the hero on
// load. Reduced-motion users get the final value immediately.
function StatCount({ target, delay = 0 }: { target: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduce, target, delay]);

  return (
    <span ref={ref}>{Math.round(value).toLocaleString("en-US")}</span>
  );
}

// Beat the stats wait after trigger so on load they follow the hero rather
// than firing simultaneously with it.
const STATS_DELAY = 0.6;

export function Hero() {
  return (
    <section className="hero" data-screen-label="Hero">
      <div className="hero-stage">
        {/* Coach cutout — decorative; bleeds off the right and fades into the
            page via the .hero-stage scrim. Positioned via `right` in CSS. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/coach-hero-cutout.png"
          alt=""
          aria-hidden="true"
          className="hero-figure"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: REVEAL_EASE, delay: 0.15 }}
        />
        <div className="hero-stage-inner">
          <Stagger className="hero-copy">
            <motion.h1 variants={staggerItem}>
              Improving<br />shouldn&apos;t be<br /><em>guesswork</em>
            </motion.h1>
            <motion.p className="hero-lead" variants={staggerItem}>
              Overwatch coaching that <b>provides clarity</b> for players{" "}
              serious about improving
            </motion.p>
            <motion.div className="hero-cta" variants={staggerItem}>
              <a href="#pricing" className="btn btn-red">
                Schedule a call <span className="arrow-down">↓</span>
              </a>
            </motion.div>
          </Stagger>
        </div>
      </div>

      <div className="stats" id="stats">
        <div className="stats-inner">
          <Stagger className="stats-grid" delayChildren={STATS_DELAY}>
            {STATS.map((s, i) => (
              <motion.div className="stat" variants={staggerItem} key={i}>
                <div className="num">
                  <StatCount target={s.target} delay={STATS_DELAY} />
                  {s.unit}
                  <span className="num-plus">+</span>
                  {s.tail}
                </div>
                <div className="lbl">
                  {s.label[0]}
                  <br />
                  {s.label[1]}
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
