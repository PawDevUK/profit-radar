# ProfitRadar

ProfitRadar is a Next.js App Router application for discovering profitable vehicles at Copart auctions. It scrapes auction calendars and sale lists, stores data in MongoDB, and cross-references lots against international resale markets to surface high-margin opportunities.

## Tech Stack

- **Framework:** Next.js 16.1.4 + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand + SWR
- **Database:** MongoDB + Mongoose
- **Scraping:** Puppeteer (with proxy and stealth support)
- **AI:** OpenAI SDK + xAI Grok (title parsing, image analysis)

## Features

### Auction Data Pipeline

- **Calendar scraper** — scrapes Copart's auction dashboard, extracts upcoming sale events, and persists them to MongoDB
- **Sale list scraper** — iterates over calendar auctions and scrapes lot inventory from each sale URL
- **CSV export via login** — logs into Copart with Puppeteer, navigates to a sale list page, and triggers a CSV download of lot data
- **Lot details** — individual lot pages display VIN, condition, damage, odometer, pricing, and images

### Inventory & Search (`/inventory`)

- Filterable and sortable sale list results
- Chip-based filter UI (make, model, damage, condition, etc.)
- Side panel search with Zustand-driven filter state

### Calendar (`/calendar`)

- Monthly view of upcoming Copart auctions loaded from MongoDB
- Shows today's events and lets users navigate to individual sale lists

### Market Comparison

- International market integration (currently Otomoto) scrapes resale listings to estimate market value
- Per-lot profit section compares Copart buy price + import cost against target market price
- Batch and single-car market verification via API

### AI Features

- **Title parser** — sends raw Copart lot titles to OpenAI/Grok and extracts structured fields (make, model, year, trim, body type)
- **AI image analysis** — processes lot images locally and saves AI-annotated versions under `public/lot-images/copart/<lotId>/`

### Proxy Support

- All Puppeteer scrapers route through a configurable proxy (`PROXY_SERVER`, `PROXY_USERNAME`, `PROXY_PASSWORD`)
- Stealth plugin applied to avoid bot detection

## Pages

| Route | Description |
|---|---|
| `/howItWorks` | Landing / explainer page (default redirect from `/`) |
| `/inventory` | Main lot browser with filters and sale list results |
| `/inventory/lot/[lotId]` | Individual lot detail view with profit section |
| `/calendar` | Auction calendar loaded from MongoDB |
| `/auctions` | Auctions management view |
| `/dashboard` | Stats dashboard |
| `/locations` | Copart yard map |
| `/otomoto-checker` | Manual international market verification tool (currently Otomoto) |
| `/signin` / `/signup` | Auth pages |

## API Endpoints

### Copart — Database

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/copart/db/getAllSaleLists` | Fetch all calendar months with auctions from MongoDB |
| `GET` | `/api/copart/db/getSaleListById` | Fetch a specific sale list by ID |
| `PUT` | `/api/copart/db/scrape-save-list` | Scrape all upcoming auctions and save lot lists to MongoDB |
| `POST` | `/api/copart/db/saveSaleList` | Save a scraped lot list into an existing auction document |

### Copart — Scraping & Utilities

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/copart/scrape-calendar` | Scrape Copart calendar and persist to MongoDB |
| `GET` | `/api/copart/login` | Log in to Copart via Puppeteer and trigger a sale list page load |
| `GET` | `/api/copart/login_CsvSaleList` | Log in to Copart and download a CSV export of a sale list |
| `GET` | `/api/copart/image-proxy?url=...` | Proxy Copart image URLs to bypass CORS/hotlink restrictions |
| `GET` | `/api/copart/local-ai-images?lotId=...` | List AI-processed images stored locally for a lot |
| `POST` | `/api/copart/parse-title` | Parse a raw lot title with AI (single, batch, or full car objects) |

### Otomoto

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/otomoto/otomoto-checker?action=check-all` | Cross-check all Copart lots against Otomoto listings |
| `GET` | `/api/otomoto/otomoto-checker?action=verify-car&make=...&model=...` | Verify a specific make/model exists on Otomoto |
| `GET\|POST` | `/api/otomoto/otomoto-listing-check` | Check a single Otomoto listing URL |

### Auctions (filesystem-backed)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auctions` | Read auctions from `results/auctions.json` |
| `POST` | `/api/auctions` | Append an auction entry to `results/auctions.json` |

> **Deprecated:** `GET /api/copart/scrape-lot-details` returns `410 Gone`. Lot data is now sourced from the sale list scraper.

## Data Model

MongoDB stores a `CalendarSale` document per scraped calendar month:

```
CalendarSale
├── month: string
├── auctions: Auction[]
│   ├── _id
│   ├── currentSale: string (date or "LIVE NOW")
│   ├── currentSaleUrl: string
│   ├── numOfLots: number
│   └── lotList: LotDetails[]
│       ├── lotId, VIN, year, make, model
│       ├── damage, condition, odometer
│       ├── buyNowPrice, estimatedRetailValue
│       └── images[]
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

1. Configure environment variables — create `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster/db
MONGODB_DB=profit_radar
COPART_CALENDAR_URL=https://www.copart.com/auctionDashboard
COPART_LOGIN=your@email.com
COPART_PASS=yourpassword

# AI
OPENAI_API_KEY=...

# Proxy (optional)
PROXY_ENABLED=true
PROXY_SERVER=http://host:port
PROXY_USERNAME=...
PROXY_PASSWORD=...
```

1. Run the development server:

```bash
npm run dev
```

1. Open `http://localhost:3000` — redirects to `/howItWorks`.

## NPM Scripts

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint

## Known Limitations

- Auth is demo-only (localStorage-based via `lib/auth.ts`) — not production-ready
- Copart scraping requires residential proxies and may encounter CAPTCHA challenges
- `lib/cli.ts` (referenced as `npm run scraper`) does not exist yet — scrapers are triggered via API routes

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
