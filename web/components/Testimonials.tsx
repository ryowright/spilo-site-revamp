"use client";

import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";
import { LIGHTBOX_DURATION } from "./motion/transitions";

const REVIEW_PLACEHOLDER = "Discord review · 3:2 (≈1200×800px)";

// A calm, non-overwhelming social-proof display: three rows of small review
// screenshots that continuously scroll left→right. Reviews 1–15, split 5 per row.
const ROWS = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
];
// Cards are sized (CSS) so the 5-review block spans more than the viewport — so a
// review never shows twice on screen — which means ONE duplicate block is enough
// for a seamless loop. The CSS animates by one block = 100/COPIES %; keep in sync
// with the -50% in the tmarquee-scroll keyframe.
const LOOP_COPIES = 2;
// Slightly different speeds per row so they don't move in lockstep (seconds).
const ROW_DURATION = [38, 46, 42];

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

  // One review card. Only the first copy of each review (copy 0) is exposed to
  // assistive tech / the tab order; the looped copies are visual clones
  // (aria-hidden, not focusable) but still mouse-clickable so any card opens the
  // lightbox. No `id` on the image slot — the loop would duplicate it otherwise.
  const reviewCard = (n: number, ri: number, copy: number) => {
    const src = `/reviews/review-${n}.png`;
    const alt = `Player review ${n}`;
    const primary = copy === 0;
    return (
      <button
        key={`${ri}-${copy}-${n}`}
        type="button"
        className="tcard"
        onClick={() => open(src, alt)}
        aria-label={primary ? `Open ${alt} in full size` : undefined}
        aria-hidden={primary ? undefined : true}
        tabIndex={primary ? undefined : -1}
      >
        <ImagePlaceholder
          shape="rect"
          fit="cover"
          placeholder={REVIEW_PLACEHOLDER}
          src={src}
          alt={primary ? alt : ""}
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
          <h2>REAL PLAYERS, REAL RESULTS</h2>
        </Reveal>
      </div>

      {/* Three rows scrolling left→right continuously (see .tmarquee in
          globals.css). Cards open the review in a lightbox on click. */}
      <div className="tmarquee" aria-label="Player reviews">
        {ROWS.map((row, ri) => (
          <div className="marquee-row" key={ri}>
            <div
              className="marquee-track"
              style={{ "--marq-dur": `${ROW_DURATION[ri]}s` } as CSSProperties}
            >
              {Array.from({ length: LOOP_COPIES }).flatMap((_, copy) =>
                row.map((n) => reviewCard(n, ri, copy)),
              )}
            </div>
          </div>
        ))}
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
