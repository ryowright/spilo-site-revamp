import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { anton, hanken } from "./fonts";
import "./globals.css";

const SITE_TITLE = "Spilo — Overwatch Coaching";
const SITE_DESCRIPTION =
  "Professional-grade Overwatch coaching, for players serious about improving.";

// Resolves to (in priority order):
//   - NEXT_PUBLIC_SITE_URL — manual override; set once a custom domain is live
//   - VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable project alias (e.g.
//     spilo-site-revamp.vercel.app), present on production deploys
//   - VERCEL_URL — the immutable per-deploy URL (hash subdomain), present on
//     every Vercel deploy; used as a fallback for preview branches
//   - localhost in dev
// metadataBase lets Next.js turn relative image paths into absolute URLs in
// the rendered og:image / twitter:image meta tags — required by most social
// platforms for previews to actually render.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Coach Spilo",
    locale: "en_US",
    type: "website",
    // og:image is added automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@Coach_Spilo",
    // twitter:image inherits from og:image via Twitter's summary_large_image fallback
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const fontVars = [anton.variable, hanken.variable].join(" ");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-hero="split"
      data-cards="framed"
      className={fontVars}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
