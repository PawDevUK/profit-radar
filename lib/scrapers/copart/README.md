# Copart Scrapers

This directory contains dedicated, independent scrapers for Copart auction data. Each scraper has a specific purpose and can be used independently.

## Architecture

### 1. Calendar Scraper (`calendarScraper.mjs`)

**Purpose**: Scrapes auction calendar to get list of upcoming auctions.

**Usage**:

```javascript
import { scrapeCopartCalendar } from './calendarScraper.mjs';

const auctions = await scrapeCopartCalendar('January', {
    headless: true,
    proxy: false
});
// Returns: [{ location, saleDate, saleTime, viewSalesLink, ... }]
```

**Test**: `node lib/scrapers/test/test-calendar-scraper.mjs`

### 2. Sale List Scraper (`saleListScraper.mjs`)

**Purpose**: Scrapes list of cars/vehicles for a specific auction.

**Usage**:

```javascript
import { scrapeCopartSaleList } from './saleListScraper.mjs';

const cars = await scrapeCopartSaleList('https://www.copart.com/saleListResult?yardNum=881', {
    headless: true,
    proxy: false,
    limit: 50
});
// Returns: [{ lotNumber, ymm, damage, detailsLink, ... }]
```

**Test**: `node lib/scrapers/test/test-sale-list-scraper.ts <auction_url> <auction_id>`

### 3. Lot Detail Scraper (`lotDetailScraper.mjs`)

**Purpose**: Scrapes detailed information for individual car lots (images, VIN, specs, etc.).

**Usage**:

```javascript
import { scrapeCopartLotDetails } from './lotDetailScraper.mjs';

const details = await scrapeCopartLotDetails('https://www.copart.com/lot/12345678/car-details', {
    headless: true,
    proxy: false
});
// Returns: { images, vin, transmission, bodyType, color, engine, odometer, highlights }
```

**Test**: `node lib/scrapers/test/test-lot-detail-scraper.ts <details_url> <lot_id>`

## Workflow

1. **Get Auctions**: Use Calendar Scraper to get list of auctions
2. **Get Cars**: For each auction URL, use Sale List Scraper to get cars
3. **Get Details**: For each car details URL, use Lot Detail Scraper to get full info

## Configuration

All scrapers support:

- `headless`: Run browser in headless mode (default: true)
- `timeout`: Navigation timeout in ms (default: 30000-60000)
- `proxy`: Proxy configuration (default: from proxy-config.mjs)
- `captchaWaitTime`: Time to wait for manual CAPTCHA solving

## Anti-Detection

All scrapers include:

- Randomized user agents
- Viewport randomization
- Human-like delays
- Anti-bot JavaScript injection
- Proxy support for IP rotation

## Legacy Scraper

The `scraper.ts` file contains the original monolithic scraper with all functionality combined. It's kept for backward compatibility but the dedicated scrapers are recommended for new development.
