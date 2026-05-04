export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import scrapeCopartCalendar from '@/lib/scrapers/copart/calendar/calendarScraper';
import { saveCalendar } from '@/lib/db/db';

export async function GET(request: Request) {
	try {
		try {
			const response = await scrapeCopartCalendar();
			await saveCalendar(response);
			return new Response('Calendar saved!!', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		} catch (persistErr) {
			console.warn('Failed to persist calendar in MongoDB:', (persistErr as Error).message);
		}
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
