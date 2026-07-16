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
          maxWidth: "1520px",
          gap: "clamp(40px, 5.5vw, 84px)",
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
          </div>
        </Reveal>
        <Reveal axis="x" distance={30}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              textTransform: "uppercase",
              fontSize: "clamp(40px,5.6vw,80px)",
              lineHeight: 0.95,
              margin: "0 0 30px",
              letterSpacing: "0.01em",
            }}
          >
            Greetings, my name is Spilo.
          </h2>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "20px",
              lineHeight: 1.6,
              maxWidth: "54ch",
            }}
          >
            I&apos;m a retired Mixed Martial Arts Instructor turned{" "}
            <b style={{ color: "var(--text)" }}>Pro Overwatch Coach</b>. I am
            the previous assistant coach for the{" "}
            London Spitfire (Overwatch
            League) with an additional <b style={{ color: "var(--text)" }}>three years of experience</b> Head Coaching
            in Overwatch Contenders.
          </p>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "20px",
              lineHeight: 1.6,
              maxWidth: "54ch",
              marginTop: "22px",
            }}
          >
            I&apos;m also a VOD review expert with{" "}
            <b style={{ color: "var(--text)" }}>over 8,000 hours in Live VOD
            review experience</b>—all heroes, all ranks. Additionally, I have
            served as a{" "}
            <b style={{ color: "var(--text)" }}></b>playtester for many of the
            new Overwatch heroes and systems, providing additional <b style={{ color: "var(--text)" }}>insight
            into the secrets of what makes Overwatch work.</b>
          </p>
          <div style={{ marginTop: "40px" }}>
            <a href="#pricing" className="btn btn-red">
              Schedule a call <span className="arrow-up">↑</span>
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
