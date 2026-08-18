"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import { REVEAL_EASE, STAGGER_TIGHT } from "./motion/transitions";

type FaqItem = { q: string; a: React.ReactNode; open?: boolean };

// Ordered by decision journey:
//   Booking basics (1–4) → About Spilo & his coaches (5–6) → After-session (7–8)
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
            The ability to join a Discord voice call (use the account you put in
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
          website, linked in the confirmation email you receive after booking.
        </p>
      </>
    ),
  },
  {
    q: "What if no timeslot works — or I need coaching ASAP?",
    a: (
      <p>
        Generally my schedule flexibility is extremely limited. If the soonest
        session available doesn&apos;t work for you, check out Coach Stephano
        — his slots are often sooner. If neither of us has an opening that
        works, it&apos;s likely you&apos;ll need to go elsewhere for coaching.
      </p>
    ),
  },
  {
    q: "Who is Coach Stephano?",
    a: (
      <p>
        Coach Stephano is a Spilo-approved Overwatch coach. A therapist turned game-strategist, with hundreds of hours of team and solo coaching experience. He&apos;s a great option for someone looking for a more affordable (and often sooner available) session!
      </p>
    ),
  },
  {
    q: "Do you coach Coaches?",
    a: (
      <p>
        Yes! If you&apos;re looking to improve your Overwatch analysis/communication game, I&apos;ve spent hundreds of hours teaching others how to analyze and teach the game better. Book a session by selecting the standard coaching session, and ignore/adjust any questions in the form that may or may not have relevance.
      </p>
    ),
  },
  {
    q: "When should I get a follow-up session?",
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

function FaqRow({
  item,
  num,
  index,
}: {
  item: FaqItem;
  num: string;
  index: number;
}) {
  const [open, setOpen] = useState(!!item.open);
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <motion.div
      className={`faq-item${open ? " is-open" : ""}`}
      variants={staggerItem}
    >
      <button
        type="button"
        className="faq-summary"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="faq-q-wrap">
          <span className="faq-num">{num}</span>
          <span className="faq-q">{item.q}</span>
        </div>
        <span className="faq-ico" aria-hidden />
      </button>
      {/* Panel stays mounted (all answers in the HTML → crawlable for SEO)
          and animates its height between 0 and auto. initial={false} sets the
          starting height with no mount animation; only user toggles animate.
          aria-hidden keeps collapsed answers out of the a11y tree — safe here
          because the answers contain no focusable elements. */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        className="faq-a-wrap"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: REVEAL_EASE }}
      >
        <div className="faq-a">{item.a}</div>
      </motion.div>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section
      className="section"
      id="faq"
      data-screen-label="FAQ"
    >
      <div className="wrap">
        <Reveal className="section-head">
          <h2>FREQUENTLY ASKED QUESTIONS</h2>
        </Reveal>
        <Stagger className="faq-grid" gap={STAGGER_TIGHT}>
          {ITEMS.map((item, i) => (
            <FaqRow
              key={i}
              item={item}
              num={String(i + 1).padStart(2, "0")}
              index={i}
            />
          ))}
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
