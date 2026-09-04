import { NextResponse } from 'next/server';
import scrapeCopartCalendar from '@/lib/scrapers/copart/calendar/calendarScraper';
import { updateCalendar } from '@/lib/db/db';

export async function GET(request: Request) {
	try {
		const signal = request.signal;
		const scrapedCalendar = await scrapeCopartCalendar(signal);
		if (!signal.aborted) {
			const saveResponse = await updateCalendar(scrapedCalendar);
			return NextResponse.json({
				status: 200,
				headers: { 'content-type': 'application/json' },
				...saveResponse,
			});
		}
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
