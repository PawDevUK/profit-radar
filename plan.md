# ProfitRadar — Status and Plan (February 6, 2026)

## Summary
- Modern Next.js app (App Router) with pages for calendar, sale lists, and lot details.
- Copart/Otomoto scrapers implemented with proxy support and anti-bot techniques.
- Auctions API persists to filesystem JSON; MongoDB schemas exist but are centralized in `lib/db/db.ts`.
- Missing CLI harness and some env validation; data persistence paths are inconsistent.

## Current Assets
- UI Pages: 
  - Calendar: [app/calendar/page.tsx](app/calendar/page.tsx)
  - Sale list: [app/saleListResults/[id]/page.tsx](app/saleListResults/%5Bid%5D/page.tsx)
  - Lot details: [app/saleListResults/[id]/lot/[lotId]/page.tsx](app/saleListResults/%5Bid%5D/lot/%5BlotId%5D/page.tsx)
- API Routes:
  - Auctions JSON store: [app/api/auctions/route.ts](app/api/auctions/route.ts)
  - Copart helpers: 
    - Calendar scrape: [app/api/copart/scrape-calendar/route.ts](app/api/copart/scrape-calendar/route.ts)
    - Sale list scrape: [app/api/copart/scrape-sale-list/route.ts](app/api/copart/scrape-sale-list/route.ts)
    - Lot details scrape: [app/api/copart/scrape-lot-details/route.ts](app/api/copart/scrape-lot-details/route.ts)
    - Title parser: [app/api/copart/parse-title/route.ts](app/api/copart/parse-title/route.ts)
    - Image proxy: [app/api/copart/image-proxy/route.ts](app/api/copart/image-proxy/route.ts)
  - Otomoto: 
    - Checker: [app/api/otomoto/otomoto-checker/route.ts](app/api/otomoto/otomoto-checker/route.ts)
    - Listing check: [app/api/otomoto/otomoto-listing-check/route.ts](app/api/otomoto/otomoto-listing-check/route.ts)
- Scrapers:
  - Calendar: [lib/scrapers/copart/calendar/calendarScraper.mjs](lib/scrapers/copart/calendar/calendarScraper.mjs)
  - Sale list: [lib/scrapers/copart/saleList/saleListScraper.mjs](lib/scrapers/copart/saleList/saleListScraper.mjs)
  - Lot: [lib/scrapers/copart/lot/lotScraper.ts](lib/scrapers/copart/lot/lotScraper.ts)
- DB & Types:
  - DB connection + schemas: [lib/db/db.ts](lib/db/db.ts)
  - Calendar/Sale/Lot types: [lib/types](lib/types)
- Docs:
  - Project readme: [README.MD](README.MD)
  - Proxy setup: [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md)
  - AI parser notes: [lib/AI_PARSER_README.md](lib/AI_PARSER_README.md)

## Environment & Config
- Required (per README):
  - `MONGODB_URI`, `MONGODB_DB` for MongoDB features.
  - `COPART_CALENDAR_URL` for calendar scraping target.
- Next config: [next.config.ts](next.config.ts)
- Package scripts: [package.json](package.json)
  - `scraper` points to `tsx lib/cli.ts` (missing).

## Key Findings
- Auctions API ([app/api/auctions/route.ts](app/api/auctions/route.ts)) writes to `results/auctions.json`, while MongoDB persistence exists in [lib/db/db.ts](lib/db/db.ts). Data paths are not unified.
- `lib/cli.ts` referenced by `npm run scraper` is absent; no standard entry to run scrapers.
- `lib/db/schema.ts` and `lib/db/models.ts` are empty; schemas live inline inside `lib/db/db.ts`.
- Proxy strategy and diagnostics are documented and implemented; reliability depends on proxy configuration.
- Auth is demo-only (localStorage) via [lib/auth.ts](lib/auth.ts). Not suitable for production.

## Risks & Dependencies
- Copart anti-bot detection: requires residential proxies and possibly manual CAPTCHA handling.
- Missing CLI and env validation can lead to brittle runs.
- Inconsistent persistence (file vs DB) complicates API/page integration.

## Immediate Next Steps (Prioritized)
1. Create a CLI (`lib/cli.ts`) to run calendar and sale list scrapers, with unified persistence (choose file or MongoDB) and minimal logging to `results/debug/`.
2. Add `.env.example` and runtime validation for `MONGODB_URI`, `MONGODB_DB`, `COPART_CALENDAR_URL`; fail fast with clear messages.
3. Unify data layer: pick MongoDB (recommended) and update auctions API to read/write via [lib/db/db.ts](lib/db/db.ts) instead of filesystem JSON.
4. Wire API→UI: ensure pages consume stored calendar/sale list/lot data via APIs backed by the chosen persistence.
5. Add scraper retries/backoff and capture error snapshots to aid proxy troubleshooting.
6. Plan auth upgrade (NextAuth/JWT) if protected areas are needed; otherwise keep demo auth scoped.

## Today’s Plan (Checklist)
- [x] Review docs and scripts
- [ ] Scan API route health (partial)
- [x] Check data models/DB
- [ ] Prioritize next steps
- [ ] Create CLI entry for scrapers
- [ ] Add .env.example + validation
- [ ] Integrate calendar API with DB
- [ ] Proxy diagnostics + docs update
- [ ] Improve auth (beyond localStorage)

## Quick Commands
- Install and run dev server:
  - `npm install`
  - `npm run dev`
- Proxy diagnostics (after configuring proxy):
  - `npx tsx lib/scrapers/test/diagnose-blocking.ts "https://www.copart.com/todaysAuction"`

## Notes
- Use residential proxies; avoid free/datacenter proxies for Copart.
- Keep credentials out of VCS; prefer env vars. See [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md).
