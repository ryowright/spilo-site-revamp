"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import { LIGHTBOX_DURATION, STAGGER_TIGHT } from "./motion/transitions";

const REVIEW_COUNT = 9;
const REVIEW_PLACEHOLDER = "Discord review · 3:2 (≈1200×800px)";

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
          <p>See what players are saying after working with Spilo.</p>
        </Reveal>

        <Stagger className="tcards" gap={STAGGER_TIGHT}>
          {Array.from({ length: REVIEW_COUNT }, (_, i) => {
            const n = i + 1;
            const src = `/reviews/review-${n}.png`;
            const alt = `Player review ${n}`;
            return (
              <motion.button
                type="button"
                className="tcard"
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
