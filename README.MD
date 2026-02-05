# ProfitRadar

Modern Next.js application and scraping toolkit for tracking Copart auctions, exploring sale calendars, and analyzing lot details with optional market enrichment.

## Overview

- Web app built with Next.js (App Router) for browsing auction calendars, sale lists, and lot details.
- Scrapers and helper tools under `lib/scrapers` for Copart (calendar, sale list, lot details) and Otomoto checks.
- Optional MongoDB persistence for scraped calendar and sale data.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app runs at <http://localhost:3000>.

## Environment Variables

Create a `.env` in the project root:

```env
# MongoDB (optional, used by lib/db)
MONGODB_URI=mongodb+srv://user:pass@cluster/db
MONGODB_DB=profit_radar
```

If `MONGODB_URI` is not set, database features will throw an error. See [lib/db/db.ts](lib/db/db.ts) for details.

## API Routes (Selected)

Server endpoints live under `app/api`:

- Copart
  - `app/api/copart/scrape-calendar/route.ts` – scrape monthly calendar
  - `app/api/copart/scrape-sale-list/route.ts` – scrape sale list for a yard/day
  - `app/api/copart/scrape-lot-details/route.ts` – scrape details for a lot
  - `app/api/copart/parse-title/route.ts` – AI title parsing helper
  - `app/api/copart/image-proxy/route.ts` – image proxying
- Otomoto
  - `app/api/otomoto/otomoto-checker/route.ts`
  - `app/api/otomoto/otomoto-listing-check/route.ts`
- Auctions
  - `app/api/auctions/route.ts`

Pages for browsing data:

- `app/calendar/page.tsx` – calendar view
- `app/saleListResults/[id]/page.tsx` – sale list
- `app/saleListResults/[id]/lot/[lotId]/page.tsx` – lot details

## Scrapers & Data Outputs

Primary Copart scrapers and helpers:

- Calendar: `lib/scrapers/copart/calendar/calendarScraper.mjs`
- Sale list: `lib/scrapers/copart/saleList/saleListScraper.mjs`
- Lot details: `lib/scrapers/copart/lot/lotScraper.ts`

Example outputs are under `results/`:

- `results/calendar_February.json`
- `results/calendar_March.json`

Diagnostics, tools, and tests:

- `lib/scrapers/tools/dom-snapshot.mjs`
- `lib/scrapers/test/` – helpers for verifying page structure and proxy behavior

For robust scraping against Copart, a residential proxy is strongly recommended. See [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md).

## Links to Detailed Docs

- Scraper docs index: [doc/README.md](doc/README.md)
- Copart scraper notes: [lib/scrapers/copart/README.md](lib/scrapers/copart/README.md)
- AI title parser: [lib/AI_PARSER_README.md](lib/AI_PARSER_README.md)
- Proxy setup: [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md)
- Business plan and reports: [doc/](doc)

## Scripts

Common scripts in `package.json`:

- `npm run dev` – start Next.js dev server
- `npm run build` – build application
- `npm run start` – run production server
- `npm run lint` – run ESLint
- `npm run scraper` – run CLI entry (uses `tsx lib/cli.ts`, if present)

## Troubleshooting

- Copart page shows empty tables (0 rows): likely proxy or bot detection. Use the diagnostics in `lib/scrapers/test/` and follow [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md).
- MongoDB connection errors: ensure `MONGODB_URI` and `MONGODB_DB` are set, or disable DB-backed features.

---

Last updated: February 5, 2026
