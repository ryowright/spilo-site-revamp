"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import { LIGHTBOX_DURATION, STAGGER_TIGHT } from "./motion/transitions";

const REVIEW_PLACEHOLDER = "Discord review · 3:2 (≈1200×800px)";

// A full-bleed "wall" of reviews whose outermost columns bleed off the screen
// edges (dimmed + mask-faded) to imply there are far more than fit. The column
// count is responsive (see .tcards in globals.css): 5 across on ultrawide
// (≥2200px), 4 across on 1920/1366. Which cards land in the bleeding columns is
// decided *positionally* in CSS (:nth-child), not here — so this array only
// fixes the source order and which cards are "extras" (hidden on mobile).
//
// The `edge` flag now means only "extra card, hidden below 940px"; on desktop
// every card is identical markup and the CSS dims whatever falls in the first/
// last column. The 16th card completes a clean 4×4 grid at 4-across and is
// hidden again at ≥2200px so the 5-across layout stays a clean 5-5-5.
const MAIN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const EDGE_LEFT = [10, 11, 12];
const EDGE_RIGHT = [13, 14, 15];

// How many reviews the phone list shows before the "Show more" toggle.
const INITIAL_MOBILE = 3;

// Source order tuned so the 5-across layout keeps reviews 1–9 in the center and
// 10–15 on the edges: [edgeL, main, main, main, edgeR] per row, then the 16th.
type Card = { n: number; edge: boolean };
const CARDS: Card[] = [
  ...[0, 1, 2].flatMap((r) => [
    { n: EDGE_LEFT[r], edge: true },
    { n: MAIN[r * 3], edge: false },
    { n: MAIN[r * 3 + 1], edge: false },
    { n: MAIN[r * 3 + 2], edge: false },
    { n: EDGE_RIGHT[r], edge: true },
  ]),
  { n: 16, edge: true },
];

type Active = { src: string; alt: string };

export function Testimonials() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Active | null>(null);
  // Phone-only: collapse to the first INITIAL_MOBILE reviews until "Show more".
  const [showAll, setShowAll] = useState(false);

  function open(src: string, alt: string) {
    setActive({ src, alt });
    dialogRef.current?.showModal();
  }

  // Soft close: clear active so AnimatePresence runs the exit animation;
  // the dialog itself is closed afterward by onExitComplete.
  function close() {
    setActive(null);
  }

  // A review card for the phone-only list. Uses a distinct image id (`-m`) so it
  // doesn't collide with the desktop wall's copy of the same review.
  const phoneCard = (n: number) => {
    const src = `/reviews/review-${n}.png`;
    const alt = `Player review ${n}`;
    return (
      <button
        key={n}
        type="button"
        className="tcard"
        onClick={() => open(src, alt)}
        aria-label={`Open ${alt} in full size`}
      >
        <ImagePlaceholder
          id={`review-${n}-m`}
          shape="rect"
          fit="cover"
          placeholder={REVIEW_PLACEHOLDER}
          src={src}
          alt={alt}
        />
      </button>
    );
  };

  return (
    <section
      className="section"
      id="testimonials"
      data-screen-label="Testimonials"
    >
      <div className="wrap wrap-wide">
        <Reveal className="section-head">
          <h2>REAL PLAYERS, REAL RESULTS.</h2>
        </Reveal>

        <Stagger className="tcards" gap={STAGGER_TIGHT}>
          {CARDS.map(({ n, edge }) => {
            const src = `/reviews/review-${n}.png`;
            const alt = `Player review ${n}`;
            return (
              <motion.button
                type="button"
                className={edge ? "tcard tcard-edge" : "tcard"}
                key={n}
                variants={staggerItem}
                onClick={() => open(src, alt)}
                aria-label={`Open ${alt} in full size`}
              >
                <ImagePlaceholder
                  id={`review-${n}`}
                  shape="rect"
                  fit="cover"
                  placeholder={REVIEW_PLACEHOLDER}
                  src={src}
                  alt={alt}
                />
              </motion.button>
            );
          })}
        </Stagger>

        {/* Phones (≤560) hide the wall above and show this compact list instead:
            the first few reviews, then reviews 4–9 in a panel that expands and
            collapses smoothly via the "Show more" toggle. */}
        <div className="tcards-phone">
          {MAIN.slice(0, INITIAL_MOBILE).map((n) => phoneCard(n))}
          <div
            id="reviews-more"
            className={`tcards-phone-more${showAll ? " is-open" : ""}`}
          >
            <div className="tcards-phone-more-inner">
              {MAIN.slice(INITIAL_MOBILE).map((n) => phoneCard(n))}
            </div>
          </div>
          <button
            type="button"
            className="tcards-more btn btn-ghost btn-sm"
            aria-expanded={showAll}
            aria-controls="reviews-more"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Show less" : "Show more reviews"}
            <span className="tcards-more-ico" aria-hidden>
              {showAll ? "↑" : "↓"}
            </span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onClose={() => setActive(null)}
      >
        <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
          {active && (
            <motion.div
              key="lightbox-inner"
              className="lightbox-inner"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: LIGHTBOX_DURATION, ease: "easeOut" }}
            >
              <img src={active.src} alt={active.alt} />
              <button
                type="button"
                className="lightbox-close"
                onClick={close}
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </section>
  );
}
