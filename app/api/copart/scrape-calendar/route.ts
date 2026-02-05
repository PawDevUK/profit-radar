export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const month = searchParams.get('month') ?? 'February';
	const full = (searchParams.get('full') || '').toLowerCase() === 'true';
	const limitParam = searchParams.get('limit');
	const limit = full ? undefined : Math.max(0, Number(limitParam ?? 100)) || 100;

	try {
		const { scrapeCopartCalendar } = await import('@/lib/scrapers/copart/calendar/calendarScraper.mjs');
		const { saveCalendarMonth } = await import('@/lib/db/db');
		const auctions = await scrapeCopartCalendar(month);
		// Persist results to MongoDB (upsert by month+year)
		try {
			await saveCalendarMonth(month, auctions);
		} catch (persistErr) {
			console.warn('Failed to persist calendar in MongoDB:', (persistErr as Error).message);
		}

		const items = full ? auctions : auctions.slice(0, limit as number);
		return new Response(JSON.stringify({ month, total: auctions.length, saved: true, limit: full ? 'all' : (limit as number), items }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
