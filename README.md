# Covrly

[![CI](https://github.com/muhammadshayan124/covrly/actions/workflows/ci.yml/badge.svg)](https://github.com/muhammadshayan124/covrly/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)

When someone calls out, Covrly texts your staff in priority order — automatically — until
the shift is covered. No group chats, no manual follow-up.

## How it works

1. A manager marks a shift as needing coverage.
2. Covrly offers it to staff one at a time, in priority order, excluding whoever originally
   called out.
3. Staff respond via a personal link (no login) — accept fills the shift immediately and
   cancels every other pending offer; decline escalates to the next person.
4. If everyone declines, the shift is marked uncovered and the manager is notified.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · Auth.js (credentials)
· Zod · Vitest

## Bring your own SMS/billing credentials

Covrly ships fully functional without either:

- **SMS** — with no Twilio credentials set, texts are simulated by `MockProvider`: every
  "message" is logged to the database and shown in the dashboard activity feed and the
  staff portal, so the whole flow demos and works end-to-end with zero external cost. Set
  `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` to send real texts.
- **Billing** — with no Stripe credentials set, every organization is on an unlimited
  trial and the billing page shows a "not connected yet" state instead of a broken upgrade
  button. Set `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` / `STRIPE_WEBHOOK_SECRET` to enable
  real Stripe Checkout upgrades.

## Quickstart

```bash
npm install
cp .env.example .env.local   # fill in AUTH_SECRET at minimum (npx auth secret)
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3001](http://localhost:3001), start a free trial, add staff, create
a shift, and request coverage.

## Testing

```bash
npm run lint
npm run typecheck
npm test
```

The test suite includes an integration test that spins up a throwaway SQLite database and
drives the real coverage-escalation logic end to end — this caught a real bug during
development (the escalation query didn't exclude the original assignee, so someone who
called out could be re-offered their own shift once everyone else declined).

## Project layout

```
src/
  app/
    signup/, login/          auth pages + server actions
    dashboard/                manager UI: overview, staff, shifts, billing
    portal/[token]/           staff-facing page, no login required
    api/auth/, api/stripe/    Auth.js route handler, Stripe webhook
  lib/
    coverage.ts                escalation engine (the core business logic)
    notify/                    swappable SMS provider (mock now, Twilio ready)
    prisma.ts, stripe.ts        thin client wrappers
    validation.ts               all Zod schemas
prisma/
  schema.prisma                 multi-tenant data model
tests/                          unit tests + the coverage integration test
```

## Design notes

- Every tenant-owned table carries a denormalized `organizationId`, even where it's also
  reachable through a join — defense in depth against a forgotten `where` clause leaking
  data across organizations.
- The notification layer (`lib/notify/`) is a one-function interface
  (`generateText(prompt, apiKey)`-shaped, here `send(phone, body)`), the same swappable-
  provider pattern used for the LLM backends in this author's other two projects.
- Staff never get a password — a `portalToken` (unguessable ID) is the entire auth model
  for their side. Simpler than running two auth systems, and every response is still
  checked server-side against the offer's actual owner before being accepted.
- Server Actions handle all writes; there is no separate REST layer for the dashboard.

## Deployment

**Not yet deployable to Vercel as-is.** SQLite writes to a local file, and Vercel's
serverless functions have an ephemeral, non-shared filesystem — data wouldn't persist
between invocations. Before deploying:

1. Switch `prisma/schema.prisma`'s datasource `provider` from `sqlite` to `postgresql`.
2. Swap `@prisma/adapter-better-sqlite3` for `@prisma/adapter-pg` (or the adapter for
   whichever Postgres host you pick — Vercel Postgres/Neon/Supabase all work) in
   `src/lib/prisma.ts`.
3. Regenerate the client and run `prisma migrate deploy` against the new database.

That's a real, if small, migration — not just an env var swap. `AUTH_SECRET` is required
either way; Twilio and Stripe variables remain optional, as above.

## License

MIT — see [LICENSE](LICENSE).
