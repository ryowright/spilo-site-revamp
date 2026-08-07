"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

const thumbUrl = (videoId: string, quality: "hqdefault" | "maxresdefault") =>
  `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;

/**
 * Click-to-load YouTube embed. Shows the video's thumbnail + a play button
 * and only injects the (heavy, cookie-setting) YouTube iframe once the visitor
 * clicks. Keeps the page fast for the majority of visitors who never press
 * play. Uses youtube-nocookie.com for privacy-enhanced mode.
 */
export function YouTubeFacade({ videoId, title }: Props) {
  const [active, setActive] = useState(false);
  // Start with hqdefault (always exists, ~17KB — instant paint), then upgrade
  // to the sharper maxresdefault (1280×720) once we've confirmed it exists for
  // this video. Not every video has a maxres, so we verify before swapping.
  const [thumb, setThumb] = useState(() => thumbUrl(videoId, "hqdefault"));
  const facadeRef = useRef<HTMLButtonElement>(null);

  // Defer the maxres upgrade until the facade nears the viewport, so its ~80KB
  // fetch never competes with above-the-fold content on first load (the video
  // sits well below the fold). hqdefault stays visible until the swap.
  useEffect(() => {
    const el = facadeRef.current;
    if (!el) return;
    let img: HTMLImageElement | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const maxres = thumbUrl(videoId, "maxresdefault");
        img = new Image();
        img.onload = () => {
          // i.ytimg 404s when maxres is absent (onload won't fire). Guard on
          // width too, in case a small grey placeholder is served with a 200.
          if (img && img.naturalWidth > 320) setThumb(maxres);
        };
        img.src = maxres;
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (img) img.onload = null;
    };
  }, [videoId]);

  if (active) {
    return (
      <div className="yt-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      ref={facadeRef}
      type="button"
      className="yt-facade"
      style={{ backgroundImage: `url(${thumb})` }}
      onClick={() => setActive(true)}
      aria-label={`Play video: ${title}`}
    >
      <span className="yt-play" aria-hidden />
    </button>
  );
}
