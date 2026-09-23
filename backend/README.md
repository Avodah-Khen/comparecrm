# CRM handoff

This is your own standalone repo for building the CRM app. It's a starting
scaffold, not a finished design — everything below is either already
working and verified on the main site's side, or scaffolded here and
waiting for you to fill in.

**You don't have access to the main website's codebase, and you don't need
it.** Everything you need to build against — the data model, the property
endpoints you'll call, the scaffold — is described below or already in this
repo. This repo has its own minimal `server.js` and its own `package.json`;
it does not run inside the main site's server, and it has no Mongo or
Firebase dependency at all.

## Scope, up front

This CRM is for one thing right now: **leads coming in from the website,
and classifying/managing them.** Not bookings, not payments, not anything
beyond leads + their activity/site-visit history + the sales team managing
them. Keep that in mind if you're tempted to build ahead of what's actually
needed yet — see the "two open questions" section below for the two things
that are explicitly *not* decided yet.

## What already exists and is verified — yours to build against, not modify

Three models are live, migrated, and already being populated by real
traffic from the website:

- **`Lead`** (`prisma/schema.prisma`, in this repo) — every lead submitted
  through the website's contact/enquiry forms lands here, via the main
  site's own ingestion pipeline (its own backend, which you don't have
  access to). Your job starts after a `Lead` row already exists — you're
  never creating leads, only reading/managing the ones that appear.
- **`CrmUser`** — your sales team / auth model. Independent of the site's
  Mongo-based `User`/admin/developer auth — you're not reusing or
  depending on that system at all. Build your own auth against this model
  from scratch.
- **`LeadActivity`** — audit trail / notes / status-change history per lead.
- **`SiteVisit`** — scheduling and tracking property visits between a
  `CrmUser` and a `Lead`.

One thing already built in that saves you a future migration: **the
`LeadType` enum already includes `broker` and `builder`**, not just
`customer`/`developer`. When those lead sources launch on the website side,
no schema change is needed — rows with those types will just start
appearing in the same `Lead` table.

## What's scaffolded and waiting for you

- `routes/crmRoutes.js` — mounted in this repo's own `server.js` at
  `/api/crm`, already wired in and runnable.
- `routes/crm/{auth,leads,activities,siteVisits,salesTeam}Routes.js`
  — empty routers, one per sub-domain, each commented with its intended
  purpose and which Prisma model it maps to.
- `controllers/crm/*.js` — matching empty controller files, same naming,
  ready for you to fill in.

**You own all of this — zero dependency on the site's auth or anything else
in the main app.** Once your work is ready, the finished route/controller
files get copied into the main site's backend by Oriel — see "how this
gets integrated" at the bottom.

## Property data — read it, never duplicate it

Projects/inventory/listings live in MongoDB, not Postgres, and there's no
plan to duplicate them here. Call these existing endpoints directly instead
of creating your own copy of property data:

| Route | Auth |
|---|---|
| `GET /api/properties/filters` | public |
| `GET /api/properties/localities-by-type` | public |
| `GET /api/properties/location-options` | public |
| `GET /api/properties/featured` | public |
| `GET /api/properties/recent` | public |
| `GET /api/properties/search` | public |
| `GET /api/properties/my-properties` | requires site auth (`protect` + `isDeveloper`) |
| `GET /api/properties/` | public — paginated/filtered approved listings |
| `GET /api/properties/localities/:city` | public |
| `GET /api/properties/related/:id` | public |
| `GET /api/properties/:id` | public |

Note `/my-properties` is the one exception — it requires the site's
Mongo-based JWT auth to call. If your CRM ever needs a developer's own
(not-yet-approved) listings specifically, that's the endpoint, and it's the
one place your work would touch the site's auth system, even if only as a
caller.

## Two things that are explicitly NOT decided — raise them directly, don't guess

1. **`LeadStage` values aren't finalized.** Current enum: `new`, `contacted`,
   `qualified`, `converted`, `rejected`. Don't assume this is final or add
   to it yourself — check with Oriel before building anything that hardcodes
   assumptions about the full set of stages.
2. **Whether a `Booking` table is ever needed hasn't been decided.** Don't
   build toward one, don't add speculative fields anticipating it. If your
   work starts running into a real need for one, flag it — don't build it
   preemptively.

## Getting your own dev database

The current Neon plan supports branching (up to 10 branches per project),
so you should get your own isolated branch rather than sharing credentials
with the main dev work:

1. Ask Oriel to create a Neon branch for you (e.g. `kancha-crm-dev`),
   branched off the current dev branch — this gives you the same schema
   (including `Lead`/`CrmUser`/`LeadActivity`/`SiteVisit`) as a starting
   point.
2. You'll get two connection strings from that branch: a pooled one and a
   direct one.
3. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (pooled) and
   `DIRECT_URL` (direct) from that branch. Never commit `.env` — it's
   already gitignored.
4. `npm install`, `npx prisma generate`, `npm start`. That's it — no Mongo,
   no Firebase, no site credentials needed anywhere in this repo.

## How this gets integrated into the live site

This is a separate repo on purpose — you don't have access to the main
website's codebase. When a piece of your work is ready, Oriel will copy
the finished files from your `routes/crm/` and `controllers/crm/` into the
main site's backend (same folder names, same structure, so it's a direct
copy, not a rewrite). That's a manual step on Oriel's side, not something
you need to coordinate via git merges — just let them know what's ready.
