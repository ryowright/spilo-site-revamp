# syntax=docker/dockerfile:1
#
# Container build for the Coach Spilo site. The site is hosted on Vercel; this
# exists so that moving to Google Cloud — or anywhere else that runs a container
# — stays a day of work rather than a rebuild.
#
#   docker build -t spilo-site \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://coachspilo.com \
#     --build-arg NEXT_PUBLIC_ACUITY_OWNER=... \
#     web/
#
#   docker run -p 8080:8080 -e SESSION_SECRET="$(openssl rand -base64 48)" spilo-site
#
# The thing to know before you start: every NEXT_PUBLIC_* value is compiled into
# the bundle, so each has to arrive as --build-arg — passing one to `docker run`
# does nothing — and an image therefore belongs to exactly one environment.
# Staging and production are different artifacts, and changing any of those
# values means a rebuild. Runtime secrets (SESSION_SECRET, the Twitch and
# Patreon credentials) are read per request and pass through the environment as
# normal.
#
# Debian slim rather than Alpine on purpose: sharp is a native module and its
# musl builds are where it historically breaks. A few extra megabytes buys an
# image that works unattended for someone who didn't write it.

# ---------------------------------------------------------------------------
# deps — dependency install on its own layer so it caches independently of src
# ---------------------------------------------------------------------------
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


# ---------------------------------------------------------------------------
# builder — compile the app
#
# Everything NEXT_PUBLIC_* is inlined into the bundle by the compiler, so these
# have to arrive as build args. Passing them at `docker run` time does nothing:
# by then the values are already baked into the JavaScript. One consequence
# worth knowing before you build: an image is specific to one environment, and
# changing any of these means rebuilding.
# ---------------------------------------------------------------------------
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public origin. REQUIRED — see the guard below.
ARG NEXT_PUBLIC_SITE_URL

# Acuity Scheduling identifiers. Optional; see the guard below for why.
ARG NEXT_PUBLIC_ACUITY_OWNER
ARG NEXT_PUBLIC_ACUITY_30MIN_FULL
ARG NEXT_PUBLIC_ACUITY_30MIN_DISCOUNT
ARG NEXT_PUBLIC_ACUITY_INDEPTH_YT_FULL
ARG NEXT_PUBLIC_ACUITY_INDEPTH_YT_DISCOUNT
ARG NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_FULL
ARG NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_DISCOUNT
ARG NEXT_PUBLIC_ACUITY_TEAM_YT_FULL
ARG NEXT_PUBLIC_ACUITY_TEAM_PRIV_FULL

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ACUITY_OWNER=$NEXT_PUBLIC_ACUITY_OWNER \
    NEXT_PUBLIC_ACUITY_30MIN_FULL=$NEXT_PUBLIC_ACUITY_30MIN_FULL \
    NEXT_PUBLIC_ACUITY_30MIN_DISCOUNT=$NEXT_PUBLIC_ACUITY_30MIN_DISCOUNT \
    NEXT_PUBLIC_ACUITY_INDEPTH_YT_FULL=$NEXT_PUBLIC_ACUITY_INDEPTH_YT_FULL \
    NEXT_PUBLIC_ACUITY_INDEPTH_YT_DISCOUNT=$NEXT_PUBLIC_ACUITY_INDEPTH_YT_DISCOUNT \
    NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_FULL=$NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_FULL \
    NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_DISCOUNT=$NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_DISCOUNT \
    NEXT_PUBLIC_ACUITY_TEAM_YT_FULL=$NEXT_PUBLIC_ACUITY_TEAM_YT_FULL \
    NEXT_PUBLIC_ACUITY_TEAM_PRIV_FULL=$NEXT_PUBLIC_ACUITY_TEAM_PRIV_FULL

# NEXT_PUBLIC_SITE_URL is a hard failure because its absence is invisible.
# lib/site-url.ts falls back through Vercel's env vars to http://localhost:3000,
# so off Vercel the site builds and renders perfectly while every OAuth redirect
# points at localhost — it looks healthy right up until someone clicks "Sign in
# to Twitch". Better to lose the build than ship that.
#
# The Acuity values only warn: unset means resolveAcuityUrl returns null and the
# booking step shows its "message Spilo directly" fallback. That degradation is
# deliberate (see components/booking/SchedulingEvents.ts), so a container built
# without them is a valid preview of everything except checkout.
RUN if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then \
      echo "" >&2; \
      echo "ERROR: NEXT_PUBLIC_SITE_URL build arg is required." >&2; \
      echo "  Without it every OAuth redirect resolves to http://localhost:3000" >&2; \
      echo "  and discount sign-in breaks silently in production." >&2; \
      echo "  Pass it with: --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain" >&2; \
      echo "" >&2; \
      exit 1; \
    fi; \
    if [ -z "$NEXT_PUBLIC_ACUITY_OWNER" ]; then \
      echo "WARNING: NEXT_PUBLIC_ACUITY_* not set — booking will show its" >&2; \
      echo "         fallback message instead of the scheduler. Fine for a" >&2; \
      echo "         preview build, not for production." >&2; \
    fi

ENV DOCKER_BUILD=1 NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ---------------------------------------------------------------------------
# runner — just the compiled output and what it needs at runtime
# ---------------------------------------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

# sharp powers next/image optimization when self-hosting — Vercel supplies its
# own, so it is deliberately absent from package.json to keep the lockfile that
# Vercel installs from unchanged. Installed here instead.
#
# This MUST stay above the COPY steps below. The standalone output ships a
# verbatim copy of the original package.json (devDependencies included), so any
# npm command run after that file lands would reconcile against it and prune the
# traced node_modules out from under the server. Installing first and letting
# COPY merge the traced tree in alongside sharp avoids that entirely.
RUN npm install --no-save --omit=dev sharp@0.33.5 \
    && npm cache clean --force

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
# standalone already contains the traced node_modules and a generated server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

# The generated server reads PORT and HOSTNAME from the environment, which is
# exactly what App Engine and Cloud Run inject (both use 8080).
CMD ["node", "server.js"]
