import { ImageResponse } from "next/og";

// File-based Open Graph image. Next.js auto-adds the og:image meta tag
// pointing to this route, and Twitter cards inherit it via twitter:card
// fallback. No request-time data, so it's statically generated at build time
// and served as a cached build asset (no runtime = "edge" → no cold starts).

export const alt = "Spilo Overwatch Coaching";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette — sRGB equivalents of the OKLch tokens used on the site,
// because @vercel/og's renderer doesn't support OKLch in CSS values.
const BG = "#1A1F26";
const TEXT = "#F2F2F4";
const TEXT_DIM = "#B4B8BD";
const TEXT_FAINT = "#7A7E85";
const RED = "#DC3545";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "56px 80px",
          background: BG,
          color: TEXT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Brand mark — wordmark with the red underline accent (mirrors the
            nav's .mark::after). alignSelf: stretch makes the bar span the
            wordmark's width. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            SPILO
          </span>
          <div
            style={{
              height: 6,
              marginTop: 8,
              background: RED,
              alignSelf: "stretch",
            }}
          />
        </div>

        {/* Main message — mirrors the hero headline and lead. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "0.005em",
              textTransform: "uppercase",
            }}
          >
            <span>Improving</span>
            <span>{"shouldn't be"}</span>
            <span style={{ color: TEXT_FAINT }}>guesswork.</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              borderLeft: `3px solid ${RED}`,
              paddingLeft: 18,
              maxWidth: 820,
              fontSize: 24,
              lineHeight: 1.35,
              color: TEXT_DIM,
            }}
          >
            Professional-grade Overwatch coaching, for players serious about
            improving.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
