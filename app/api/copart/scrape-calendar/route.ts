export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import scrapeCopartCalendar from '@/lib/scrapers/copart/calendar/calendarScraper';
import { saveMonthSale } from '@/lib/db/db';

export async function GET(request: Request) {
	try {
		try {
			const response = await scrapeCopartCalendar();
			await saveMonthSale(response);
		} catch (persistErr) {
			console.warn('Failed to persist calendar in MongoDB:', (persistErr as Error).message);
		}

		return new Response('All good', {
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
