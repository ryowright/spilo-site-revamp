# Coach Spilo

The marketing and booking site for Overwatch coach [Spilo](https://www.youtube.com/@SpiloCoaching) —
a single page that sells coaching sessions and books them through Acuity Scheduling (Calendly for Stephano).

Next.js 14 (App Router) · TypeScript · React 18 · deployed on Vercel.

## Repo layout

The application is **not** at the repository root:

| Path | |
|---|---|
| `web/` | The Next.js app. Every path and command below is relative to this directory. |
| `Coach Spilo Site Revamp/` | The original design export the site was ported from. Gitignored, kept locally as a design reference — nothing builds from it. |

## Getting started

```bash
cd web
npm install
cp .env.local.example .env.local
npm run dev
```

Then open <http://localhost:3000>.

The site runs fine with an empty `.env.local` — booking and discounts degrade to safe fallbacks
(see [Gotchas](#gotchas)) rather than breaking. Fill it in when you need those paths working.

| Script | |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve a production build locally |
| `npm run lint` | ESLint via `next lint` |

No Node version is pinned in `package.json`. Next 14.2 requires **Node 18.17 or newer**; 20 LTS is a
safe choice.

## Environment variables

Every name is documented in [`.env.local.example`](.env.local.example), including how to obtain the
values. What that file doesn't explain is the distinction that actually matters:

**`NEXT_PUBLIC_*` — compiled in at build time.** Ten of these: the site URL and nine Acuity
appointment identifiers. Next.js inlines them into the JavaScript bundle during `next build`, so
changing one requires a **rebuild**, not a restart. On Vercel that means a redeploy. In a container
build they must be passed as `--build-arg`; setting them at run time does nothing.

**Everything else — read per request.** `SESSION_SECRET`, `TWITCH_*`, `PATREON_*`. These can change
with a restart and never need a rebuild. They are also the only real secrets here; the
`NEXT_PUBLIC_*` values ship to the browser by design.

## How it fits together

**One page.** [`app/page.tsx`](app/page.tsx) composes the whole site: nav, hero, then testimonials →
about → pricing → session → FAQ, wrapped in `.page-reveal` — a block that scrolls up over the pinned
hero. `BookingRoot` wraps everything to provide the booking modal's context.

**One stylesheet.** [`app/globals.css`](app/globals.css), ~1,530 hand-written lines. No Tailwind, no
CSS modules, no component-scoped styles.

> **Cascade trap, worth knowing before you edit it:** media queries add no specificity. An
> equal-specificity base rule appearing *later* in the file silently defeats an earlier
> `@media` rule. Section-specific responsive rules must therefore sit **after** the base rules they
> override, not in the shared breakpoint blocks higher up. This has caused real bugs.

**Fonts** load through `next/font/google` in [`app/fonts.ts`](app/fonts.ts): Anton for display,
Hanken Grotesk for body. They're exposed as `--font-anton` and `--font-hanken`, then consumed
throughout the CSS as `--font-display` and `--font-body`.

**Booking** is the only substantial subsystem, under [`components/booking/`](components/booking/):

- [`coaches.ts`](components/booking/coaches.ts) — the packages, copy, and prices. Keyed by tier, with
  a price row per coach, so both coaches appear on every card. **Start here to change a price or edit
  card copy.**
- [`SchedulingEvents.ts`](components/booking/SchedulingEvents.ts) — maps tier × format × discount to
  Acuity appointment URLs, read from environment variables.
- `BookingModal` runs three steps: **coach → discount → schedule**. Choosing Spilo continues into the
  modal; choosing Stephano opens his Calendly in a new tab.
- Discount verification signs the visitor into Twitch or Patreon via the routes under
  [`app/api/auth/`](app/api/auth/), checks for an active sub or paying pledge, and stores the result
  in an encrypted `iron-session` cookie. Server-side helpers live in [`lib/oauth/`](lib/oauth/).

**`<image-slot>`** is a custom element, not a typo — it wraps `next/image` and is typed in
[`global.d.ts`](global.d.ts).

## Gotchas

Four things that look like bugs and aren't.

**1. Booking says "message Spilo directly" until the Acuity variables are set.** With
`NEXT_PUBLIC_ACUITY_*` unset, `resolveAcuityUrl` returns `null` and the schedule step shows a
fallback. This is deliberate: a misconfigured deploy disables booking rather than sending someone to
a wrong or broken checkout.

**2. Discount sign-in auto-succeeds in local development.** With no `TWITCH_CLIENT_ID` or
`PATREON_CLIENT_ID`, the OAuth flow runs a mock that verifies instantly without contacting the
provider, so the booking path is testable without credentials. `resolveMockMode` in
[`lib/oauth/flow.ts`](lib/oauth/flow.ts) gates this on `NODE_ENV`, so production never mocks — a
production deploy missing a credential fails closed and logs an error instead.

**3. Vercel's Root Directory must be `web`.** The repo root is not the app.

**4. There is a `Dockerfile`, but it is not the deploy path.** Vercel hosts the site. The container
setup exists so that moving elsewhere stays a day of work rather than a rebuild.
`output: "standalone"` is gated behind a `DOCKER_BUILD` environment variable specifically so Vercel's
build is unaffected by its presence. See the comments at the top of the
[`Dockerfile`](Dockerfile) for how to build and run it.

## Deploying

Push to the deploy branch — Vercel builds and deploys automatically. Every branch also gets its own
preview URL, so changes can be reviewed live before they reach production.

Environment variables live in the Vercel project's settings. Remember that changing any
`NEXT_PUBLIC_*` value requires a redeploy to take effect, since those are compiled into the bundle.

Any previous deployment can be restored instantly from the Vercel dashboard.
