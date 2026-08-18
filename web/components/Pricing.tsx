"use client";

import { Fragment } from "react";
import { motion, Variants } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";
import {
  HOVER_SPRING,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_EASE,
} from "./motion/transitions";
import { SchedulingButton } from "./booking/SchedulingButton";
import { PACKAGES, priceRows, type PackageCard } from "./booking/coaches";

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
      {card.featured && <span className="tier-flag">Most Popular</span>}
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
      {/* Both coaches are visible without a toggle. A coach whose price varies
          by format contributes one row per format, so this flattens. */}
      <div className="tier-prices">
        {card.coaches.flatMap((c) =>
          priceRows(c).map((row) => (
            <div className="price-row" key={row.label}>
              <span className="k">{row.label}</span>
              <span className="v">{row.value}</span>
            </div>
          )),
        )}
      </div>
      <SchedulingButton
        booking={card.booking}
        variant={card.featured ? "red" : "ghost"}
      >
        Book a Call
      </SchedulingButton>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section
      className="section pricing"
      id="pricing"
      data-screen-label="Pricing"
    >
      {/* Ambient red glow — fades from 0 to full the first time the booking
          section scrolls into view. */}
      <motion.div
        className="pricing-glow"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.0, ease: "easeOut" }}
      />
      <div className="wrap wrap-wide">
        <Reveal className="section-head">
          <h2>Book the review</h2>
          <p>
            The following coaching options are offered by both Coach Spilo and
            Coach Stephano
          </p>
        </Reveal>

        <Stagger className="tiers">
          {PACKAGES.map((card) => (
            <TierCard card={card} key={card.key} />
          ))}
        </Stagger>

        <div className="pricing-free">
          <span className="tag">FREE!</span>
          <p>
            Watch hundreds of Spilo&apos;s coaching calls on{" "}
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
