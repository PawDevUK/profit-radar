# ProfitRadar Scraper Refresh Report (Feb 6, 2026)

## Overview

- Goal: Keep Copart data fresh with different update cadences for calendar, sale lists, and lots.
- Approach: Decouple scraping tasks by layer, use normalized storage, and apply incremental (idempotent) updates rather than bulk replacements.

## Data Model (Recommended)

- **auctions**: Calendar-level entries.
  - Key: `auctionId` (derive from `viewSalesLink` + `saleDate`), fields: location, saleDate, saleTime, `viewSalesLink`.
- **sales**: One sale list per auction/date.
  - Key: `saleId`, FK: `auctionId`, fields: `items[]` (car entries), `numberOnSale`, `updatedAt`.
- **lots**: Lot-level detail, linked to sale.
  - Key: `lotId` (prefer `lotNr` or VIN), FK: `saleId`, fields: `details` (specs), rolling fields (`currentBid`, `buyItNow`, `auctionCountdown`), `images[]`, `updatedAt`.

Store references (FKs) rather than embedding large lists into calendar docs. Keep calendar light and treat it as an index.

## Update Cadence

- **Calendar**: Once daily (09:00). If no change, skip write.
- **Sales**: Twice daily (09:00, 17:00), targeting today + upcoming auctions.
- **Lots**: Twice daily (09:00, 17:00), for lots in targeted sales.

## Incremental Update Strategy

- **Identifiers**: Use stable keys: `viewSalesLink` for auctions, `saleId` for sales, `lotNr`/VIN for lots.
- **Merge behavior**:
  - Append new records; never delete on scrape.
  - Fill missing fields only (top-level and `details`).
  - Update rolling fields whenever changed: `currentBid`, `buyItNow`, `auctionCountdown`, plus `images[]` (append new ones).
  - Stamp `updatedAt` and persist diffs to `results/debug/` (optional for auditing).

- Implemented example for sale lists: see [lib/db/db.ts](lib/db/db.ts#L146-L230) `incrementalAttachSaleListByLink`.
- CLI uses incremental sales merge: see [lib/cli.ts](lib/cli.ts).

## CLI Tasks & Scripts

- **Tasks** in [lib/cli.ts](lib/cli.ts):
  - `calendar`: scrapes month and stores via [lib/db/db.ts](lib/db/db.ts).
  - `sales`: scrapes sale lists for today’s auctions and merges incrementally.
  - `all`: calendar → sales.
- **Scripts** in [package.json](package.json#L6-L13):
  - `scrape:calendar`, `scrape:sales`, `scrape:all`.

## Scheduling (Windows)

- Create 09:00 and 17:00 tasks via PowerShell:

```powershell
# 09:00 daily: calendar + sales
schtasks /Create /SC DAILY /ST 09:00 /TN "ProfitRadar_Scrape_All_0900" /TR "powershell -NoProfile -ExecutionPolicy Bypass -Command \"cd 'C:\Users\Pawel\Desktop\Projects\ProfitRadar'; npm run scrape:all\"" /RL HIGHEST /F

# 17:00 daily: sales only
schtasks /Create /SC DAILY /ST 17:00 /TN "ProfitRadar_Scrape_Sales_1700" /TR "powershell -NoProfile -ExecutionPolicy Bypass -Command \"cd 'C:\Users\Pawel\Desktop\Projects\ProfitRadar'; npm run scrape:sales\"" /RL HIGHEST /F
```

- Verify:

```powershell
schtasks /Query /TN "ProfitRadar_Scrape_All_0900"
schtasks /Query /TN "ProfitRadar_Scrape_Sales_1700"
```

## Environment

- Set up `.env` (see [.env.example](.env.example)):
  - `MONGODB_URI`, `MONGODB_DB` (DB persistence)
  - `COPART_CALENDAR_URL` (calendar scrape target)
  - Optional proxy (`PROXY_*`) per [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md)

## Run Commands

- Dev server:

```bash
npm install
npm run dev
```

- Manual scrapes:

```bash
npm run scrape:calendar
npm run scrape:sales
npm run scrape:all
```

## Best Practices

- **Decouple layers**: calendar, sales, lots run separately; do not rewrite calendar for sales/lot changes.
- **Idempotent upserts**: all merges are safe to re-run; keys ensure consistent targets.
- **Scope scrapes**: limit sales/lots to today/upcoming; avoid hammering past data.
- **Diagnostics**: capture HTML/screenshot to `results/debug/` if empty results; leverage proxies per [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md).

## Lot Scraping: Browser Reuse Strategy

- **Reuse one browser/page**: Open a single Puppeteer browser and one page, loop through lot URLs with `page.goto()`, and parse. This keeps cookies/session intact, reduces CAPTCHA risk, and is much faster than reopening.
- **Pacing and jitter**: Add small, randomized delays between lots (e.g., 250–750 ms) and backoff/retry on transient load issues.
- **Light concurrency only**: If needed, use a tiny page pool (2–4 pages) within the same browser; higher concurrency increases detection risk.
- **Session stickiness**: If your proxy supports sessions, keep the same session for 5–10 minutes per auction batch, then rotate for the next batch.
- **Periodic refresh**: Every 50–100 lots (or after each sale), close and reopen the page to keep memory stable. Recreate the browser/context only after hard failures or to rotate proxy identity.
- **Failure handling**: On CAPTCHA/blocked responses, open a fresh page (or incognito context) and, if needed, rotate the proxy session before continuing.

## Next Extensions

- Add `taskLots` and `incrementalAttachLotDetailsById` for lot-level merges.
- Optional: diff logging per run; metrics aggregation in [lib/metrics.ts](lib/metrics.ts).

---
Reading tip: Start with Update Cadence → Incremental Update Strategy → Scheduling; the rest can be skimmed as needed.
