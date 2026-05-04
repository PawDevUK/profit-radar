# Database Documentation

## Overview

MongoDB is the primary data store. The application uses Mongoose for schema definition and connection management. The connection is cached to avoid re-connecting on every serverless invocation (`lib/db/db.ts`).

All data lives in a single collection: `CalendarSale`. Each document represents one scraped calendar month, containing nested auctions, each containing its scraped lot list.

---

## Schema Structure

```
CalendarSale (collection)
├── month: String               — e.g. "February"
├── year: Number                — e.g. 2026
├── scrapedAt: Date
├── totalAuctions: Number
└── auctions: SaleList[]
    ├── _id: ObjectId           — used to target nested updates
    ├── saleTime: String
    ├── saleName: String
    ├── saleType: String
    ├── currentSale: String     — ISO date string or "LIVE NOW"
    ├── currentSaleUrl: String
    ├── nextSale: String
    ├── nextSaleUrl: String
    ├── numOfLots: Number
    ├── scrapedAt: Date
    ├── buyItNow: Number
    └── lotList: LotDetails[]
        ├── title, year, make, model, trim, bodyStyle
        ├── vin, lotInv, laneItem, saleName, location
        ├── odometer, odometerUnit (mi | km), odometerStatus
        ├── primaryDamage, color, hasKey
        ├── runAndDrive, engineVerified, engineVerifiedNote, engineStatus
        ├── transmissionEngages, transmissionNote
        ├── titleCode, vehicleTitleType
        ├── cylinders, engineType, transmission, vehicleType, driveTrain, fuelType
        ├── saleDate, auctionName, auctionCountdown
        ├── currentBid: String
        ├── buyItNow: Number
        ├── highlights: String[]
        ├── notes, lastUpdated
        └── images: [{ copart: String[], AiRepaired: Buffer[] }]
```

Schema source: [lib/db/schema.ts](../lib/db/schema.ts)
Model: [lib/db/models.ts](../lib/db/models.ts)

---

## DB Functions (`lib/db/db.ts`)

| Function | Description |
|---|---|
| `connectDB()` | Connect to MongoDB (cached). Reads `MONGODB_URI` and `MONGODB_DB` from env. |
| `saveCalendar(data)` | Insert a new `CalendarSale` document (from calendar scrape). |
| `getAllSalesLists()` | Return all `CalendarSale` documents. |
| `saveSalesList(auctionId, lots)` | Update `lotList` and `numOfLots` on a specific nested auction by `_id`. |
| `getOneSalesList(id)` | Find and return a single nested auction by its `_id`. |

---

## Data Flow

```
1. Scrape calendar
        ↓
   saveCalendar()  →  CalendarSale document created in DB
        ↓
2. Scrape sale list (per auction URL)
        ↓
   saveSalesList(auctionId, lots)  →  lotList populated on nested auction
        ↓
3. Calendar page reads via getAllSalesLists()
   Inventory page reads via getOneSalesList(id)
```

---

## Environment Variables

```env
MONGODB_URI=mongodb+srv://user:pass@cluster/db
MONGODB_DB=profit_radar   # defaults to "profit_radar" if not set
```

---

## Notes

- `LotDetails` schema uses `{ _id: false }` — lots do not get their own ObjectId.
- `SaleList` schema uses `{ timestamps: true }` — Mongoose auto-adds `createdAt`/`updatedAt`.
- `images.AiRepaired` stores binary `Buffer` data for AI-reconstructed images; `images.copart` stores Copart CDN URL strings.
- `saveSalesList` finds the parent `CalendarSale` document by searching `auctions._id`, then uses `$set` with the positional `$` operator to update only the matched nested auction.
