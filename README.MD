# ProfitRadar

ProfitRadar is a Next.js App Router project focused on auction vehicle discovery, lot inspection, and market validation workflows (Copart + Otomoto), with TypeScript across the main application code.

## Project State

This README was refreshed from the current repository structure and route files.

- Framework: Next.js 16.1.4 + React 19
- Language: TypeScript-first app code (`.ts` and `.tsx`)
- Styling: Tailwind CSS v4 + custom CSS
- Data: JSON files under `app/results` and `results`, plus optional MongoDB persistence
- Scraping stack: Puppeteer/Playwright utilities under `lib/scrapers`
- API layer: Next.js route handlers under `app/api`

## Current Highlights

- Auction list read/write API in `app/api/auctions/route.ts`
- Copart calendar scrape endpoint in `app/api/copart/scrape-calendar/route.ts`
- Copart image proxy endpoint in `app/api/copart/image-proxy/route.ts`
- AI title parsing endpoint in `app/api/copart/parse-title/route.ts`
- Otomoto verification endpoints in:
  - `app/api/otomoto/otomoto-checker/route.ts`
  - `app/api/otomoto/otomoto-listing-check/route.ts`
- Lot details API route is explicitly deprecated:
  - `app/api/copart/scrape-lot-details/route.ts` returns `410`

## Important Notes

- Both `README.md` and `README.MD` resolve to the same file path on Windows.
- `.gitattributes` marks scraper HTML snapshots as generated for GitHub Linguist:
  - `lib/scrapers/copart/lot/AI_HTML_extract/*.html linguist-generated=true`

## Tech Stack

- Next.js 16.1.4
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- SWR + Zustand
- MongoDB + Mongoose
- OpenAI SDK
- Puppeteer + Playwright

## Quick Start

1. Install dependencies.

```bash
npm install
```

1. Configure environment variables.

Create `.env.local` based on `.env.example`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster/db
MONGODB_DB=profit_radar
COPART_CALENDAR_URL=https://www.copart.com/auctionDashboard

# Optional
# OPENAI_API_KEY=...
# PROXY_ENABLED=true
# PROXY_SERVER=http://...
# PROXY_USERNAME=...
# PROXY_PASSWORD=...
```

1. Run the app.

```bash
npm run dev
```

1. Open:

```text
http://localhost:3000
```

## NPM Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint

## API Endpoints

- `GET /api/auctions`
- `POST /api/auctions`
- `GET /api/copart/scrape-calendar?month=...&full=true|false&limit=...`
- `GET /api/copart/image-proxy?url=...`
- `POST /api/copart/parse-title`
- `GET|POST /api/otomoto/otomoto-listing-check`
- `GET /api/otomoto/otomoto-checker?action=check-all|verify-car`

Deprecated:

- `GET|POST /api/copart/scrape-lot-details` (returns 410)

## Repository Layout

```text
app/
  api/
  components/
  inventory/
  calendar/
  saleListResults/
  results/
doc/
img/
lib/
  db/
  openAI/
  scrapers/
  state/
  types/
public/
results/
scripts/
```

## Additional Documentation

- `doc/AI_PARSER_README.md`
- `doc/DataBase.md`
- `doc/fetchingData.md`
- `doc/Scraper-Refresh-Report.md`

## Next Cleanup Suggestions

- Remove or implement scripts that depend on `lib/cli.ts`
- Keep a single canonical README filename (`README.md`)
- Add tests for API routes and scraper helpers
