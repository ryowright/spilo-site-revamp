"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import {
  HOVER_SPRING,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_EASE,
} from "./motion/transitions";
import { SchedulingButton } from "./booking/SchedulingButton";
import { COACHES, type Coach, type PackageCard } from "./booking/coaches";

// Featured tier rests at scale 1.02 so it visually leads.
const featuredItem: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE, scale: 1 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1.02,
    transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE },
  },
};

const hoverLift = { y: -6, scale: 1.012 };
// Same +0.012 lift, applied to the featured tier's resting 1.02 scale.
const hoverLiftFeatured = { y: -6, scale: 1.032 };

function TierCard({ card }: { card: PackageCard }) {
  return (
    <motion.div
      className={`tier${card.featured ? " featured" : ""}`}
      variants={card.featured ? featuredItem : staggerItem}
      whileHover={card.featured ? hoverLiftFeatured : hoverLift}
      transition={HOVER_SPRING}
    >
      {card.featured && <span className="tier-flag">Most popular</span>}
      <span className="tier-len">{card.len}</span>
      <h3>
        {card.title.split("\n").map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h3>
      <p className="tier-desc">{card.desc}</p>
      <ul className="tier-list">
        {card.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <div className="tier-prices">
        {card.prices.map((p, i) => (
          <div className="price-row" key={i}>
            <span className="k">{p.label}</span>
            <span className="v">${p.amount}</span>
          </div>
        ))}
      </div>
      <SchedulingButton
        booking={card.booking}
        variant={card.featured ? "red" : "ghost"}
      >
        Schedule a call
      </SchedulingButton>
      {card.sub && <div className="tier-sub">{card.sub}</div>}
    </motion.div>
  );
}

const COACH_IDS = Object.keys(COACHES) as Coach[];

export function Pricing() {
  const [coach, setCoach] = useState<Coach>("spilo");
  const active = COACHES[coach];

  // Measure Spilo's (taller) card height and pin Stephano's lighter cards to
  // match, so toggling coaches never shrinks the section. Spilo is the
  // reference and is never given a min-height. A ResizeObserver keeps it
  // accurate across viewport widths and font loads.
  const [cardMin, setCardMin] = useState<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const measureRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      // Only the Spilo set establishes the reference height.
      if (!node || coach !== "spilo") return;
      const measure = () => {
        let max = 0;
        node
          .querySelectorAll<HTMLElement>(".tier")
          .forEach((c) => (max = Math.max(max, c.offsetHeight)));
        if (max) setCardMin(max);
      };
      measure();
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(measure);
        ro.observe(node);
        observerRef.current = ro;
      }
    },
    [coach],
  );

  return (
    <section
      className="section pricing"
      id="pricing"
      data-screen-label="Pricing"
    >
      <div className="wrap wrap-wide">
        <Reveal className="section-head">
          <h2>Book the review.</h2>
          <p style={{ maxWidth: "none", whiteSpace: "nowrap" }}>
            Get actionable and targeted feedback on what you can do to improve.
          </p>
        </Reveal>

        <Reveal className="coach-switch">
          <div
            className="coach-toggle"
            role="radiogroup"
            aria-label="Choose your coach"
          >
            {COACH_IDS.map((c) => {
              const isActive = coach === c;
              const note = COACHES[c].note;
              const tipId = `coach-tip-${c}`;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={COACHES[c].label}
                  aria-describedby={note ? tipId : undefined}
                  className={`coach-toggle-btn${isActive ? " is-active" : ""}`}
                  onClick={() => setCoach(c)}
                >
                  {COACHES[c].label}
                  {note && (
                    <span id={tipId} role="tooltip" className="coach-tip">
                      {note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={coach}
            style={
              coach === "stephano" && cardMin
                ? ({ "--card-min": `${cardMin}px` } as React.CSSProperties)
                : undefined
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Measure the tier cards on a plain wrapper — not the motion.div
                itself: a ref on an AnimatePresence child trips framer-motion's
                React 18.3 `props.ref` access warning in PopChild. */}
            <div ref={measureRef}>
              <Stagger className={`tiers tiers-${active.cards.length}`}>
                {active.cards.map((card) => (
                  <TierCard card={card} key={card.key} />
                ))}
              </Stagger>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pricing-free">
          <span className="tag">FREE!</span>
          <p>
            Watch hundreds of my coaching calls on{" "}
            <a
              className="lk"
              href="https://www.youtube.com/@Spilo2"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>{" "}
            — every hero, across all ranks.
          </p>
        </div>
      </div>
    </section>
  );
}
