"use client";

import { motion, Variants } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { staggerItem } from "./motion/Stagger";
import { STAGGER } from "./motion/transitions";
import { YouTubeFacade } from "./YouTubeFacade";

// ─────────────────────────────────────────────────────────────────────
// Swap these for the real values. VIDEO_ID is the YouTube video id (the
// part after `v=` or `youtu.be/`). PLAYLISTS_URL is the Spilo Coaching
// playlists page.
const VIDEO_ID = "D6dMkreFLyM";
const PLAYLISTS_URL = "https://www.youtube.com/@Spilo2/playlists";
// ─────────────────────────────────────────────────────────────────────

const OUTLINE = [
  {
    title: "Introduction",
    desc: "We start by getting to know a bit about you and what you want out of the session.",
  },
  {
    title: "Student Q&As",
    desc: "We discuss any additional thoughts or questions you may have prior to the VOD review.",
  },
  {
    title: "VOD Review",
    desc: "We break down your replay(s) together, spotting the habits and decisions holding you back.",
  },
  {
    title: "Closing / Questions",
    desc: "You leave with concrete practice goals and time for any final questions.",
  },
];

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
};

export function SessionSection() {
  return (
    <section
      className="section session-section"
      id="session"
      data-screen-label="Session"
    >
      <div className="wrap wrap-wide">
        <Reveal className="section-head">
          <h2>WHAT A SESSION LOOKS LIKE</h2>
          <p>
            Take a look inside a real coaching call so you know exactly what to
            expect before you book
          </p>
        </Reveal>

        <div className="session-grid">
          <Reveal className="session-video" distance={12}>
            <YouTubeFacade videoId={VIDEO_ID} title="Example coaching session" />
          </Reveal>

          <div className="session-aside">
            <motion.ol
              className="session-outline"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              variants={listContainer}
            >
              {OUTLINE.map((item) => (
                <motion.li key={item.title} variants={staggerItem}>
                  <span className="session-outline-title">{item.title}</span>
                  <span className="session-outline-desc">{item.desc}</span>
                </motion.li>
              ))}
            </motion.ol>

            <Reveal delay={0.1}>
              <a href="#pricing" className="btn btn-red session-cta">
                Schedule a Call <span className="arrow-down">↓</span>
              </a>
            </Reveal>
          </div>

          {/* Sits in the video's column, directly beneath it — the aside spans
              both rows so this fills the space under the shorter video rather
              than being pushed below the taller outline. */}
          <div className="session-plug">
            <p>
              Want to see more coaching VODs like this one? Check out the full set of playlists
              on{" "}
              <a
                className="lk"
                href={PLAYLISTS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Spilo Coaching
              </a>{" "}
              — one for every hero!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
