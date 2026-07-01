"use client";

import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";

export function About() {
  return (
    <section className="section" id="about" data-screen-label="About">
      <div
        className="hero-grid"
        style={{
          gridTemplateColumns: "0.85fr 1.15fr",
          alignItems: "center",
        }}
      >
        <Reveal className="hero-media" axis="x" distance={-30}>
          <div className="media-frame">
            <ImagePlaceholder
              id="coach-about"
              shape="rect"
              placeholder="Drop coach photo"
              src="/coach-about.png"
              alt="Jacob &quot;Spilo&quot; Clifton"
            />
            <div className="media-tag">Jacob &quot;Spilo&quot; Clifton</div>
          </div>
        </Reveal>
        <Reveal axis="x" distance={30}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              textTransform: "uppercase",
              fontSize: "clamp(32px,5vw,58px)",
              lineHeight: 0.95,
              margin: "0 0 26px",
              letterSpacing: "0.01em",
            }}
          >
            Greetings, my name is Spilo.
          </h2>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "54ch",
            }}
          >
            I&apos;m a retired Mixed Martial Arts Instructor turned{" "}
            <b style={{ color: "var(--text)" }}>Pro Overwatch Coach</b>. I am
            the previous assistant coach for the{" "}
            <b style={{ color: "var(--text)" }}>London Spitfire</b> (Overwatch
            League) with an additional three years of experience Head Coaching
            in <b style={{ color: "var(--text)" }}>Overwatch Contenders</b>.
          </p>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "54ch",
              marginTop: "18px",
            }}
          >
            I&apos;m also a VOD review expert with over{" "}
            <b style={{ color: "var(--text)" }}>8,000 hours</b> in Live VOD
            review experience—all heroes, all ranks. Additionally, I have
            served as a{" "}
            <b style={{ color: "var(--text)" }}>playtester</b> for many of the
            new Overwatch heroes and systems, providing additional insight
            into the secrets of what makes Overwatch work.
          </p>
          <div style={{ marginTop: "34px" }}>
            <a href="#pricing" className="btn btn-red">
              Schedule a call <span className="arrow">→</span>
            </a>
          </div>
          <div className="about-mission">
            <p>
              Whether Bronze or Champion, my mission is to educate players on how to improve their game.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
