"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";
import { Stagger, staggerItem } from "./motion/Stagger";

export function Hero() {
  return (
    <section className="hero" data-screen-label="Hero">
      <div className="hero-grid">
        <Stagger className="hero-copy">
          <motion.div className="badge" variants={staggerItem}>
            <span className="pip"></span>
            <span>EX-OVERWATCH LEAGUE | LONDON SPITFIRE</span>
          </motion.div>
          <motion.h1 variants={staggerItem}>
            Improving<br />shouldn&apos;t be<br /><em>guesswork.</em>
          </motion.h1>
          <motion.p className="hero-lead" variants={staggerItem}>
            <b>Professional-grade</b> Overwatch coaching, for players{" "}
            <b>serious about improving.</b>
          </motion.p>
          <motion.div className="hero-cta" variants={staggerItem}>
            <a href="#pricing" className="btn btn-red">
              Schedule a call <span className="arrow">→</span>
            </a>
          </motion.div>
        </Stagger>
        <Reveal className="hero-media" delay={0.12} distance={12}>
          <div className="media-frame">
            <ImagePlaceholder
              id="coach-hero"
              shape="rect"
              fit="cover"
              placeholder="Drop coach photo"
              src="/coach-hero.png"
              alt="Coach Spilo"
            />
            <div className="media-tag">Coach Spilo</div>
          </div>
        </Reveal>
      </div>

      <Reveal className="stats" id="stats">
        <div className="stats-grid">
          <div className="stat">
            <div className="num">6,000+</div>
            <div className="lbl">
              Hours live<br />VOD review
            </div>
          </div>
          <div className="stat">
            <div className="num">1,000+</div>
            <div className="lbl">
              Players<br />coached
            </div>
          </div>
          <div className="stat">
            <div className="num">3+ YRS</div>
            <div className="lbl">
              Contenders<br />head coach
            </div>
          </div>
          <div className="stat">
            <div className="num">120K+</div>
            <div className="lbl">
              Followers across<br />YouTube &amp; Twitch
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
