# ProfitRadar Scraper Refresh Report

## Overview

- Goal: Keep Copart data fresh with different update cadences for calendar, sale lists, and lots.
- Approach: Decouple scraping tasks by layer, use MongoDB for normalized storage, and apply incremental updates rather than bulk replacements.
- Market comparison targets international resale platforms (currently Otomoto); additional markets are planned.

## Implemented Data Model

Data is stored in a single `MonthSale` MongoDB collection with nested documents:

- **MonthSale**: Top-level document per scraped calendar month. Fields: `month`, `year`, `scrapedAt`, `totalAuctions`, `auctions[]`.
- **SaleList** (nested in `auctions[]`): One entry per auction event. Fields: `saleTime`, `saleName`, `currentSale`, `currentSaleUrl`, `nextSale`, `nextSaleUrl`, `numOfLots`, `lotList[]`.
- **LotDetails** (nested in `lotList[]`): Full lot spec. Fields: `vin`, `lotNumber`, `make`, `model`, `year`, `trim`, `primaryDamage`, `odometer`, `currentBid`, `buyItNow`, `images`, and more.

See [DataBase.md](DataBase.md) for the full schema reference.

## How Scraping Is Triggered

Scrapers are invoked via Next.js API route handlers — there is no standalone CLI at this time.

| Trigger | API Route | What It Does |
|---|---|---|
| Calendar scrape | `GET /api/copart/scrape-calendar` | Runs `calendarScraper`, calls `saveCalendar()` |
| Sale list scrape | `PUT /api/copart/db/scrape-save-list` | Iterates upcoming auctions, runs `saleListScraper` per URL, calls `saveSalesList()` |
| CSV export | `GET /api/copart/login_CsvSaleList` | Logs into Copart via Puppeteer and downloads a CSV sale list |

## Update Cadence (Recommended)

- **Calendar**: Once daily (09:00). If no change, skip write.
- **Sales**: Twice daily (09:00, 17:00), targeting today + upcoming auctions only.
- **Lots**: Updated as part of the sale list scrape — lot data is embedded in `lotList[]`.

## Scheduling (Windows Task Scheduler)

Since scrapers are HTTP-triggered, schedule with `curl` or PowerShell hitting the local or deployed app:

```powershell
# 09:00 daily: calendar
schtasks /Create /SC DAILY /ST 09:00 /TN "ProfitRadar_Calendar_0900" /TR "powershell -NoProfile -Command \"Invoke-WebRequest -Uri 'http://localhost:3000/api/copart/scrape-calendar'\"" /RL HIGHEST /F

# 09:00 daily: sale lists
schtasks /Create /SC DAILY /ST 09:15 /TN "ProfitRadar_SaleList_0915" /TR "powershell -NoProfile -Command \"Invoke-WebRequest -Method PUT -Uri 'http://localhost:3000/api/copart/db/scrape-save-list'\"" /RL HIGHEST /F

# 17:00 daily: sale lists refresh
schtasks /Create /SC DAILY /ST 17:00 /TN "ProfitRadar_SaleList_1700" /TR "powershell -NoProfile -Command \"Invoke-WebRequest -Method PUT -Uri 'http://localhost:3000/api/copart/db/scrape-save-list'\"" /RL HIGHEST /F
```

Verify:

```powershell
schtasks /Query /TN "ProfitRadar_Calendar_0900"
schtasks /Query /TN "ProfitRadar_SaleList_0915"
```

## Incremental Update Strategy

- `saveSalesList(auctionId, lots)` uses MongoDB's `$set` with the positional `$` operator to update only the matched nested auction — existing `MonthSale` documents are not replaced.
- `scrape-save-list` filters to only upcoming auctions (`!isPast(currentSale)`) before scraping, avoiding unnecessary requests to past events.
- Re-running either scraper is safe — calendar creates new documents per month; sale list overwrites `lotList` on the same auction.

## Proxy Support

All Puppeteer scrapers read proxy config from env:

```env
PROXY_ENABLED=true
PROXY_SERVER=http://host:port
PROXY_USERNAME=...
PROXY_PASSWORD=...
```

The `createContext()` utility in `lib/scrapers/proxy/createContext.ts` applies `puppeteer-extra-plugin-stealth` and authenticates with the proxy automatically.

## Lot Scraping: Browser Reuse Strategy

- **Reuse one browser/page**: Open a single Puppeteer browser, loop through lot URLs with `page.goto()`. Keeps cookies/session intact and reduces CAPTCHA risk.
- **Pacing and jitter**: Add small randomized delays (250–750 ms) between lots; backoff on transient failures.
- **Session stickiness**: Keep the same proxy session for a batch; rotate between batches.
- **Periodic refresh**: Every 50–100 lots, close and reopen the page to keep memory stable.
- **Failure handling**: On CAPTCHA/block, open a fresh page or incognito context and rotate proxy session.

## Environment

```env
MONGODB_URI=mongodb+srv://user:pass@cluster/db
MONGODB_DB=profit_radar
COPART_CALENDAR_URL=https://www.copart.com/auctionDashboard
COPART_LOGIN=your@email.com
COPART_PASS=yourpassword
```

## Known Gaps

- No standalone CLI (`lib/cli.ts` does not exist) — all scraping is HTTP-triggered.
- No `scrape:calendar` / `scrape:sales` npm scripts — use API routes directly.
- No lot-level incremental merge function yet — `lotList` is fully replaced on each sale list scrape.
- No debug snapshot output to `results/debug/` implemented yet.

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
