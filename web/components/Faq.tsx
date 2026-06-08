"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import { STAGGER_TIGHT } from "./motion/transitions";

type FaqItem = { q: string; a: React.ReactNode; open?: boolean };

const ITEMS: FaqItem[] = [
  {
    q: "What's the difference between YouTube and private coaching?",
    a: (
      <p>
        No difference in quality or quantity of coaching whatsoever—the only
        difference is the YouTube coaching options are discounted as I will be
        recording the coaching for my public coaching compendium, whereas the
        private sessions (team and individual) are for your eyes only!
      </p>
    ),
    open: true,
  },
  {
    q: "What should I have ready before the session?",
    a: (
      <>
        <p>Two things:</p>
        <ol>
          <li>
            The ability to join a Discord voice call (use the tag you put in
            the form).
          </li>
          <li>
            1-2 replay codes/recorded videos of your play (a close game is
            best, or one where you were confused on your role).
          </li>
        </ol>
      </>
    ),
  },
  {
    q: "What's your rescheduling / cancellation policy?",
    a: (
      <>
        <p>
          All rescheduling/cancellation is done by a 48-hour policy—you will be
          unable to refund sessions canceled/unable to reschedule WITHIN 48
          HOURS OF YOUR SESSION (please message me directly if you have any
          unusual life circumstances).
        </p>
        <p>
          Outside of 48 hours, you will receive a refund for canceled sessions/
          be allowed to reschedule sessions through the Acuity scheduling
          website.
        </p>
      </>
    ),
  },
  {
    q: "What if no timeslot works — or I need coaching ASAP?",
    a: (
      <p>
        Generally my schedule flexibility is extremely limited. Unfortunately,
        if the soonest session available doesn&apos;t work for you, it&apos;s
        likely that you&apos;ll need to go elsewhere for coaching.
      </p>
    ),
  },
  {
    q: "When should I get a follow-up?",
    a: (
      <>
        <p>
          I generally recommend a waiting period of 4-5 weeks between sessions
          to give ample time to practice the concepts/habits we worked at.
          However, if you want to learn a new hero/encounter unexpected
          difficulties, booking sooner is not a problem.
        </p>
        <p>
          I also recommend LIVE coaching on repeat sessions (me coaching you
          live as you play), so please let me know if you have the capability
          to stream Overwatch through Discord on re-booking!
        </p>
      </>
    ),
  },
  {
    q: "Do you do live coaching?",
    a: (
      <>
        <p>
          Yes! I generally recommend live coaching on follow-up sessions (once
          we establish goals to practice), but exceptions can be made.
        </p>
        <p>
          If you are interested in a live coaching session, just book your
          session as a standard In-depth/Private session, and let me know you
          are interested once we start the review.
        </p>
        <p>
          Please make sure that you have the capability to stream Overwatch
          through Discord!
        </p>
      </>
    ),
  },
];

export function Faq() {
  return (
    <section
      className="section"
      id="faq"
      data-screen-label="FAQ"
      style={{ paddingTop: "clamp(40px,6vw,80px)" }}
    >
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Before you book</span>
          <h2 style={{ width: "760px" }}>FREQUENTLY ASKED QUESTIONS</h2>
        </Reveal>
        <Stagger className="faq-grid" gap={STAGGER_TIGHT}>
          {ITEMS.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.details
                key={i}
                className="faq-item"
                variants={staggerItem}
                {...(item.open ? { open: true } : {})}
              >
                <summary>
                  <div className="faq-q-wrap">
                    <span className="faq-num">{num}</span>
                    <span className="faq-q">{item.q}</span>
                  </div>
                  <span className="faq-ico"></span>
                </summary>
                <div className="faq-a">{item.a}</div>
              </motion.details>
            );
          })}
        </Stagger>
        <div className="faq-fallback">
          Still have questions?{" "}
          <a
            href="https://discord.gg/tv2SR9yPMJ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reach out on Discord <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
