"use client";

import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./motion/Reveal";

export function About() {
  return (
    <section className="section" id="about" data-screen-label="About">
      <div className="about-wrap">
        <Reveal className="section-head about-head">
          <h2>Meet the Coaches</h2>
        </Reveal>

        {/* Spilo — image left, copy right */}
        <div className="coach-block">
          <Reveal className="coach-media" axis="x" distance={-30}>
            <div className="media-frame">
              <ImagePlaceholder
                id="coach-about"
                shape="rect"
                placeholder="Drop coach photo"
                src="/coach-spilo-about.jpg"
                alt="Jacob &quot;Spilo&quot; Clifton"
                sizes="(max-width: 940px) 90vw, 900px"
              />
            </div>
          </Reveal>
          <Reveal className="coach-copy" axis="x" distance={30}>
            <h2 className="coach-name">Greetings, my name is Spilo.</h2>
            <p className="coach-bio">
              I&apos;m a retired Mixed Martial Arts Instructor turned Pro
              Overwatch Coach. I am the previous assistant coach for the London
              Spitfire (Overwatch League) with an additional three years of
              experience Head Coaching in Overwatch Contenders.
            </p>
            <p className="coach-bio">
              I&apos;m also a VOD review expert with over 8,000 hours in Live
              VOD review experience—all heroes, all ranks. Additionally, I have
              served as a playtester for many of the new Overwatch heroes and
              systems, providing additional insight into the secrets of what
              makes Overwatch work.
            </p>
            <div className="coach-cta">
              <a href="#pricing" className="btn btn-red">
                Schedule a Call <span className="arrow-down">↓</span>
              </a>
            </div>
            <div className="about-mission">
              <p>
                Whether Bronze or Champion, my mission is to educate players on
                how to improve their game.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Stephano — copy left, image right (mirrored) */}
        <div className="coach-block coach-block-rev">
          <Reveal className="coach-copy" axis="x" distance={-30}>
            <h2 className="coach-name">Hey, I&apos;m Coach Stephano.</h2>
            <p className="coach-bio">
              I&apos;ve been coaching players from Bronze to Champion for over 4
              years, helping them improve at the game. I have worked as head
              coach for several high-division US teams.
            </p>
            <p className="coach-bio">
              As of this year, Spilo has endorsed my coaching and partnered with
              me, providing the community with a high-quality and more
              affordable alternative.
            </p>
            <p className="coach-bio">
              Reaching Grandmaster on many DPS and Support heroes, combined with
              my expertise as a psychotherapist and a Master&apos;s degree in
              Counseling Psychology, qualifies me to create personalized and
              creative methods to help players improve fast.
            </p>
            <div className="coach-cta">
              <a href="#pricing" className="btn btn-red">
                Schedule a Call <span className="arrow-down">↓</span>
              </a>
            </div>
          </Reveal>
          <Reveal className="coach-media" axis="x" distance={30}>
            <div className="media-frame">
              <ImagePlaceholder
                id="coach-stephano"
                shape="rect"
                placeholder="Drop coach photo"
                src="/coach-stephano-about.jpg"
                alt="Coach Stephano"
                sizes="(max-width: 940px) 90vw, 900px"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
