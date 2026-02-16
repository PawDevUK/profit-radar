# Fetching Data for Fast, Reliable React Access (Next.js App Router)

TL;DR:

- Keep the source of truth on the server. Use client-side storage only as an ephemeral cache to improve UX.
- Fetch in Server Components or Route Handlers, not directly in client components.
- Use layered caching: Next.js Data Cache (with `revalidate` and `tags`) + client cache (SWR/React Query) for interactive views.
- Hydrate the client cache with server-fetched data for instant first render; background-revalidate for freshness.
- Avoid persisting sensitive database data in client storage; apply short TTLs, versioning, and scope to non-sensitive slices if you must.

---

## Goals

- Fast initial render (minimize waterfalls and duplicate fetches)
- Reliable freshness (predictable revalidation after writes)
- Consistent access control (enforced on the server)
- Secure handling (no secrets in the browser)

## Core Principles

- Server is canonical: the database and server layer are the single source of truth.
- Server-first fetching: fetch in Server Components (`app/.../page.tsx`, `layout.tsx`) or in `app/api/.../route.ts` and pass results to client components as props.
- Layered caching: combine server-side caching and client-side cache to balance speed and interactivity.
- Revalidate-on-write: after mutations, trigger cache revalidation (tag-based) so readers become fresh quickly.

## Recommended Patterns (Next.js 13+ App Router)

### 1) Fetch in Server Components with the Next.js Data Cache

Use `fetch()` with `next: { revalidate, tags }` to enable caching, deduping, and tag-based revalidation.

```ts
// lib/platforms.ts (example helper)
export async function getAuctions() {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/auctions", {
    next: { revalidate: 60, tags: ["auctions"] },
  });
  if (!res.ok) throw new Error("Failed to load auctions");
  return res.json();
}
```

```tsx
// app/auctions/page.tsx (Server Component)
import { getAuctions } from "@/lib/platforms";

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  return (
    <section>
      <h1>Auctions</h1>
      {/* Pass to a client component if needed */}
      {/* <AuctionsClient initialData={auctions} /> */}
      {auctions.map((a: any) => (
        <div key={a.id}>{a.title}</div>
      ))}
    </section>
  );
}
```

- Hoist common data to `layout.tsx` when multiple child routes use it.
- `revalidate: 0` (dynamic) for always-fresh data; `revalidate: N` for periodic freshness.
- Use `tags` to group related cache entries.

### 2) Tag-Based Revalidation After Writes

When you mutate data (create/update/delete), revalidate tags so readers refresh.

```ts
// app/actions/auctionActions.ts (Server Action)
import { revalidateTag } from "next/cache";

export async function createAuction(input: any) {
  // ... write to DB
  revalidateTag("auctions");
}
```

This avoids stale reads without forcing global cache busts.

### 3) Route Handlers with Cache Headers

For read-heavy endpoints, set appropriate `Cache-Control` headers and/or `revalidate`.

```ts
// app/api/auctions/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // const data = await db.auctions.findMany();
  const data = [];
  const res = NextResponse.json(data);
  // Cache at CDN/edge for 60s; allow stale-while-revalidate for 5m
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return res;
}
```

- For personalized data, avoid shared caching; prefer per-user caching (or none) and fetch in Server Components.

### 4) Client-Side Caching for Interactivity (SWR or React Query)

Use a client cache when the view is highly interactive (filters, optimistic updates). Hydrate with server-fetched data to avoid a second network trip on first render.

```tsx
// app/auctions/AuctionsClient.tsx (Client Component)
"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function AuctionsClient({ initialData }: { initialData: any[] }) {
  const { data, isLoading, error } = useSWR("/api/auctions", fetcher, {
    fallbackData: initialData, // hydrated from server
    dedupingInterval: 10_000, // prevent refetch storms
    revalidateOnFocus: true,
  });

  if (error) return <div>Failed to load</div>;
  if (isLoading && !data) return <div>Loading…</div>;

  return (
    <ul>
      {(data ?? []).map((a: any) => (
        <li key={a.id}>{a.title}</li>
      ))}
    </ul>
  );
}
```

- React Query offers similar primitives: `staleTime`, `prefetchQuery`, `hydrate`.
- Keep TTLs short unless your data truly changes rarely.

### 5) Prefetching, Suspense, and Streaming

- Use `Link` prefetch and server prefetch to warm caches.
- Wrap subtrees in Suspense to stream UI while data loads.
- Share fetches by keeping them in parent Server Components to avoid waterfalls.

### 6) Real-Time Updates When Needed

- For near-real-time data (seconds), use WebSockets or SSE to push updates.
- Apply deltas to the client cache; for consistency, still revalidate tags on the server or periodically ensure alignment.

## Is It Good Practice to Store DB Data on the Client?

- Generally: store minimally and ephemerally. The client cache improves UX (fast interactions, offline hints), but the **authority remains on the server**.
- Do store: non-sensitive slices, short-lived caches, pagination pages, UI state.
- Avoid storing: sensitive/PII, high-churn authoritative records, anything requiring strict access control.
- If persisting (IndexedDB/localStorage): encrypt if appropriate, version entries, enforce TTLs, and invalidate on sign-out.

## Security & Access Control

- Enforce authentication/authorization on the server. Never rely on client-side checks.
- Ship only the minimal data needed for rendering and interaction.
- Do not include secrets or raw tokens in client-accessible payloads.

## How This Fits Your Repo

- Centralize reads in `lib/db/db.ts` and reuse helpers across `app/...` Server Components.
- In `app/api/.../route.ts` endpoints (e.g., `copart/scrape-sale-list/route.ts`, `auctions/route.ts`), add caching headers and consider `next: { revalidate, tags }` where compatible.
- Hydrate client views that require interactivity (e.g., filters on `dashboard/page.tsx`) with initial data fetched on the server.
- After mutations (creating/updating results or notifications), call `revalidateTag(...)` for the affected resources.

## Quick Checklist

- Fetch on the server; avoid client-only fetches for the first render.
- Use `revalidate` and `tags`; revalidate tags on writes.
- Hydrate client cache (SWR/React Query) with server data.
- Keep client persistence minimal, non-sensitive, and time-scoped.
- Set `Cache-Control` on read-heavy APIs; avoid shared caching for personalized data.

## Example Decision Guide

- Read-only lists (public or low-sensitivity): server fetch + `revalidate: 60` + tag; client cache optional.
- Personalized dashboards: server fetch per-user + minimal client cache; no shared CDN cache.
- Highly interactive views: server fetch for first paint + client cache (SWR/RQ) + optimistic updates.
- Real-time feeds: WebSocket/SSE + periodic server revalidation.

---

By following these patterns, your components get data quickly and reliably while keeping consistency, security, and performance aligned with Next.js best practices.
