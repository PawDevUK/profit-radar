export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const month = searchParams.get('month') ?? 'January';

	try {
		const { CopartCalendarScraper } = await import('@/lib/scrapers/copart/calendar/calendarScraper.mjs');

		// if (!save) {
		// 	const auctions = await scrapeCopartCalendar(month, {
		// 		headless,
		// 		timeout: 15000,
		// 		captchaWaitTime: 60000,
		// 	});
		// 	return new Response(JSON.stringify({ month, total: auctions.length, auctions }), {
		// 		status: 200,
		// 		headers: { 'content-type': 'application/json' },
		// 	});
		// }

		// Save variant (uses class to call saveResults)
		const scraper = new CopartCalendarScraper();
		await scraper.initialize();
		const auctions = await scraper.scrapeCalendar(month);
		await scraper.saveResults(auctions, `calendar_${month}.json`);
		await scraper.close();

		return new Response(JSON.stringify({ month, total: auctions.length, saved: true }), {
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
