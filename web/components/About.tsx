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
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: "18px" }}
          >
            Who you&apos;re working with
          </span>
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
            HI, MY NAME IS SPILO.
          </h2>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "54ch",
            }}
          >
            I have over <b style={{ color: "var(--text)" }}>6,000 hours</b> of
            live VOD review experience—all heroes, all ranks. That&apos;s how
            I&apos;m able to pinpoint exactly what&apos;s holding a player
            back, and what they need to work on.
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
            I spent three years as a head coach in{" "}
            <b style={{ color: "var(--text)" }}>Overwatch Contenders</b>, and I
            was the assistant coach for the{" "}
            <b style={{ color: "var(--text)" }}>London Spitfire</b> in the
            Overwatch League. Before all that, I was an MMA instructor.
          </p>
          <div style={{ marginTop: "34px" }}>
            <a href="#pricing" className="btn btn-red">
              Schedule a call <span className="arrow">→</span>
            </a>
          </div>
          <div className="about-mission">
            <span className="eyebrow">The Mission</span>
            <p>
              Whether you&apos;re Bronze or T500, every player can improve. My
              job is to show you how.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
