# Database Architecture Notes (ProfitRadar)

Date: 2026-05-03

## Decision Summary

We are moving away from nested month documents that contain full sale and lot payloads.

Recommended model:

1. Sales collection
2. Lots collection

Key relation:

- `Lots.saleId` references `Sales.saleId`

This allows direct lot lookup and efficient sale-level queries without loading large embedded documents.

## Why This Is Better

1. Fast single-lot query by `lotInv`
2. Fast fetch of all lots in a sale by `saleId`
3. Smaller documents and cleaner updates
4. Better scaling and less risk of oversized MongoDB documents
5. Better scraper write flow (independent lot upserts)

## Collection Design

### Sales

Suggested fields:

- `saleId` (string, unique)
- `saleName` (string)
- `saleType` (string)
- `location` (string)
- `saleTime` (Date)
- `scrapedAt` (Date)
- optional: `status`, `source`

Optional field:

- `lotInvs: string[]` only if a precomputed ordered list is needed

Note:

- If lot volume is high, skip storing `lotInvs` in Sales and query Lots by `saleId`.

### Lots

Suggested fields:

- `lotInv` (string, unique)
- `saleId` (string, indexed)
- `vin` (string)
- `make` (string)
- `model` (string)
- `year` (number)
- `odometer` (number)
- `odometerUnit` (`mi` or `km`)
- `currentBid` (number)
- `buyItNow` (number)
- `saleDate` (Date)
- `lastUpdated` (Date)
- `images.copart` (string[])
- `images.aiRepaired` (string[] URLs)
- audit fields: `createdAt`, `updatedAt` (timestamps)

## Indexing Standards

Create at least these indexes:

1. `Lots.lotInv` unique
2. `Lots.saleId` non-unique
3. optional compound: `Lots.saleId + lotInv`
4. `Sales.saleId` unique

Optional useful indexes:

1. `Lots.vin` if VIN lookup is common
2. `Lots.lastUpdated` for freshness and maintenance jobs

## Data Type Standards

Use strict, query-friendly types:

1. Dates as `Date`, not strings
2. Numeric values as `Number`, not strings
3. Keep arrays consistent (`highlights` should always be `string[]`)
4. Avoid mixed unions for persisted fields unless required

## Scraping Write Strategy

Recommended ingestion flow:

1. Upsert sale once per scrape run (by `saleId`)
2. Upsert each lot independently (by `lotInv`)
3. Use `bulkWrite` for lots in batches
4. Use partial updates (`$set`) to avoid wiping existing good data
5. Track freshness metadata (`scrapedAt`, `lastSeenAt`, `scrapeRunId`)

Benefits:

1. Atomic per-lot updates
2. Easy retries and partial failure recovery
3. Better performance and lower write contention

## Image Storage Guidance

Do not store large binary image buffers in MongoDB for this project.

Preferred:

1. Store image files in object storage (Vercel Blob, Cloudflare R2, Supabase Storage)
2. Store only image URLs/paths in MongoDB

Vercel note:

- Vercel server runtime filesystem is ephemeral
- Persistent image storage should use Vercel Blob or another object store

## Notes About `_id` in Embedded Docs

You removed `_id: false` from embedded lots.

What this means:

1. Embedded lot subdocuments now get Mongo-generated `_id`
2. This is more standard and can help with targeted subdocument operations
3. It slightly increases storage per embedded item

Given the new flat model direction, default `_id` behavior is acceptable.

## Fresh Start Plan (No Legacy Data)

Because all existing database data will be dropped, there is no need for migration, dual-write, fallback reads, or legacy compatibility layers.

Execution steps:

1. Create normalized `Sales` and `Lots` schemas and models.
2. Add required indexes before first production scrape.
3. Update scraper to write only to `Sales` and `Lots`.
4. Update read APIs to query only normalized collections.
5. Run first full scrape to populate clean baseline data.
6. Validate counts and query behavior, then lock schema contracts.

## API Query Patterns

1. Get one lot: `findOne({ lotInv })`
2. Get lots by sale: `find({ saleId }).sort(...)`
3. Get sales by date range: `find({ saleTime: { $gte, $lt } })`
4. Get lots by freshness: `find({ lastUpdated: { $lt: cutoff } })`

## Final Recommendation

Use a normalized two-collection model (`Sales`, `Lots`) with `saleId` as relation key, `lotInv` as unique lot identity, typed date/number fields, and URL-based image storage.

This gives the best balance of query speed, scraper reliability, and long-term maintainability for ProfitRadar.

## Action Plan

### Phase 1: Build Core Models

Goal:

- Implement normalized `Sales` and `Lots` as the only supported storage model.

Tasks:

1. Add new Mongoose schemas for `Sale` and `Lot`.
2. Enable timestamps on both schemas.
3. Add indexes:

- `Lot.lotInv` unique
- `Lot.saleId` index
- `Sale.saleId` unique

1. Remove or stop using legacy month-nested model exports.

Exit criteria:

1. App boots with no schema/model errors.
2. New collections are created in MongoDB with expected indexes.

### Phase 2: Update Scraper Writes

Goal:

- Write only to normalized collections during scraping.

Tasks:

1. Upsert sale by `saleId` once per sale batch.
2. Upsert lots by `lotInv` using `bulkWrite`.
3. Use partial updates (`$set`) only for known scraped fields.
4. Add `scrapedAt`, `lastSeenAt`, and optional `scrapeRunId` metadata.
5. Log write stats: inserted, modified, matched, failed.

Exit criteria:

1. Every new scrape writes valid documents to `Sales` and `Lots`.
2. Retrying the same scrape does not create duplicates.

### Phase 3: Populate Fresh Dataset

Goal:

- Fill the new database from scraper runs only.

Tasks:

1. Run full scrape cycle for selected date window and locations.
2. Verify ingest completeness after each sale batch.
3. Re-run failed batches until error budget is met.
4. Save scrape summary metrics for baseline reference.

Validation checks:

1. Total distinct `lotInv` count matches expected scrape output.
2. Every lot has a `saleId`.
3. No duplicate `lotInv` documents exist.

Exit criteria:

1. Fresh dataset coverage reaches 100% for required fields in target scrape scope.
2. Validation report shows no blocking mismatches.

### Phase 4: Switch Read APIs

Goal:

- Ensure all API reads use normalized collections only.

Tasks:

1. Update "get lot by lotInv" API to read from `Lots`.
2. Update "get lots by saleId" API to read from `Lots`.
3. Add query projection to return only required fields.
4. Remove references to month-nested document traversal.

Exit criteria:

1. Core read endpoints are served from normalized collections.
2. Response shape remains backward-compatible for frontend.

### Phase 5: Observe and Stabilize

Goal:

- Confirm correctness and performance before removing legacy logic.

Tasks:

1. Monitor read latency, write latency, and error rates.
2. Track scraper throughput and duplicate-key errors.
3. Validate endpoint outputs against expected contract and sample lots.
4. Fix data normalization edge cases (dates, number parsing, null handling).

Exit criteria:

1. No critical regressions for at least one scrape cycle window.
2. API performance and data quality meet baseline targets.

### Phase 6: Harden and Enforce Standards

Goal:

- Finalize production rules on the normalized model.

Tasks:

1. Enforce schema validators for required fields.
2. Add alerting for scraper failures and duplicate-key spikes.
3. Add operational runbook for re-scrape and retry flow.
4. Freeze API contract for lot and sale endpoints.

Exit criteria:

1. Production stability and data quality targets are met.
2. Team has documented procedures for ingestion and incident response.

## Rollback Strategy

1. If first scrape run quality is poor, drop only affected collections and rerun scraper.
2. Keep scrape runs idempotent so reruns are safe.
3. Use scrapeRunId and logs to isolate and reprocess failed batches.

## Suggested Timeline

1. Week 1: Phase 1 and Phase 2
2. Week 2: Phase 3 and Phase 4
3. Week 3: Phase 5 and Phase 6

## Definition of Done

1. `Lots` is the source of truth for lot-level reads and updates.
2. `Sales` is the source of truth for sale-level metadata.
3. Scraper performs idempotent upserts with monitoring.
4. No migration, fallback, or legacy compatibility path remains.
