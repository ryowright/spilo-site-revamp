"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import { LIGHTBOX_DURATION, STAGGER_TIGHT } from "./motion/transitions";

const REVIEW_PLACEHOLDER = "Discord review · 3:2 (≈1200×800px)";

// The 9 featured reviews fill the center 3 columns; 6 extra reviews bleed off
// the page edges (3 per side), deliberately cut off + dimmed to imply there are
// far more reviews than fit on the page. Edge cards are still clickable — they
// open the same full-size lightbox so the cut-off ones can be read.
const MAIN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const EDGE_LEFT = [10, 11, 12];
const EDGE_RIGHT = [13, 14, 15];

// Row-major order for the full-bleed 5-column grid — [edgeL, main, main, main,
// edgeR] per row — so the featured reviews land in the center columns and the
// extras in the bleeding edge columns.
type Card = { n: number; edge: boolean };
const CARDS: Card[] = [0, 1, 2].flatMap((r) => [
  { n: EDGE_LEFT[r], edge: true },
  { n: MAIN[r * 3], edge: false },
  { n: MAIN[r * 3 + 1], edge: false },
  { n: MAIN[r * 3 + 2], edge: false },
  { n: EDGE_RIGHT[r], edge: true },
]);

type Active = { src: string; alt: string };

export function Testimonials() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Active | null>(null);

  function open(src: string, alt: string) {
    setActive({ src, alt });
    dialogRef.current?.showModal();
  }

  // Soft close: clear active so AnimatePresence runs the exit animation;
  // the dialog itself is closed afterward by onExitComplete.
  function close() {
    setActive(null);
  }

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
