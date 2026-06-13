"use client";

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

export function Pricing() {
  return (
    <section
      className="section pricing"
      id="pricing"
      data-screen-label="Pricing"
    >
      <div className="wrap wrap-wide">
        <Reveal className="section-head">
          <span className="eyebrow">Coaching · All heroes, all ranks</span>
          <h2>Book the review.</h2>
          <p style={{ maxWidth: "none", whiteSpace: "nowrap" }}>
            Get actionable and targeted feedback on what you can do to improve.
          </p>
        </Reveal>

        <Stagger className="tiers">
          {/* 30-minute Gameplay Review — left, single format */}
          <motion.div
            className="tier"
            variants={staggerItem}
            whileHover={hoverLift}
            transition={HOVER_SPRING}
          >
            <span className="tier-len">30 min · Individual</span>
            <h3>30 MINUTE GAMEPLAY REVIEW</h3>
            <p className="tier-desc">
              A thorough gameplay review, recorded and sent to you. Request to
              be in-call if you&apos;d like — not required.
            </p>
            <ul className="tier-list">
              <li>A list of practice goals for your hero</li>
              <li>Answers to any &amp; all questions</li>
            </ul>
            <div className="tier-prices">
              <div className="price-row">
                <span className="k">30-minute review</span>
                <span className="v">$43</span>
              </div>
            </div>
            <SchedulingButton tier="thirtyMin" variant="ghost">
              Schedule a call
            </SchedulingButton>
            <div className="tier-sub">Discount for Patreon / Twitch subs</div>
          </motion.div>

          {/* In-Depth Coaching Call — center, featured, 2 formats */}
          <motion.div
            className="tier featured"
            variants={featuredItem}
            whileHover={hoverLiftFeatured}
            transition={HOVER_SPRING}
          >
            <span className="tier-flag">Most popular</span>
            <span className="tier-len">1 hour · Individual</span>
            <h3>
              In-Depth<br />Coaching Call
            </h3>
            <p className="tier-desc">
              Solve exactly what you need to succeed in Overwatch — inside and
              outside the game.
            </p>
            <ul className="tier-list">
              <li>Maximize your training efficiency</li>
              <li>Improve your gameplay mentality</li>
              <li>A list of practice goals for your hero</li>
              <li>Answers to any &amp; all questions</li>
            </ul>
            <div className="tier-prices">
              <div className="price-row">
                <span className="k">Posted to YouTube</span>
                <span className="v">$80</span>
              </div>
              <div className="price-row">
                <span className="k">Private</span>
                <span className="v">$90</span>
              </div>
            </div>
            <SchedulingButton tier="inDepth" variant="red">
              Schedule a call
            </SchedulingButton>
            <div className="tier-sub">Discount for Patreon / Twitch subs</div>
          </motion.div>

          {/* Complete Team Analysis Call — right, 2 formats */}
          <motion.div
            className="tier"
            variants={staggerItem}
            whileHover={hoverLift}
            transition={HOVER_SPRING}
          >
            <span className="tier-len">70 min · Team</span>
            <h3>COMPLETE TEAM ANALYSIS CALL</h3>
            <p className="tier-desc">
              Solve exactly what your team needs to succeed in Overwatch —
              inside and outside the game.
            </p>
            <ul className="tier-list">
              <li>Address your team&apos;s concerns &amp; weakpoints</li>
              <li>Improve your team&apos;s communication &amp; planning</li>
              <li>
                Grow your understanding and execution of compositional Macro
              </li>
              <li>A list of practice goals for your team</li>
              <li>Answers to any &amp; all questions</li>
            </ul>
            <div className="tier-prices">
              <div className="price-row">
                <span className="k">Posted to YouTube</span>
                <span className="v">$90</span>
              </div>
              <div className="price-row">
                <span className="k">Private</span>
                <span className="v">$100</span>
              </div>
            </div>
            <SchedulingButton tier="team" variant="ghost">
              Schedule a call
            </SchedulingButton>
            <div className="tier-sub">Sessions billed at the listed price</div>
          </motion.div>
        </Stagger>

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
