import { NextResponse } from 'next/server';
import scrapeCopartCalendar from '@/lib/scrapers/copart/calendar/calendarScraper';
import { updateCalendar } from '@/lib/db/db';

export async function GET(request: Request) {
	try {
		const scrapedCalendar = await scrapeCopartCalendar();
		const saveResponse = await updateCalendar(scrapedCalendar);
		return NextResponse.json({
			message: 'Calendar updated in database!',
			status: 200,
			headers: { 'content-type': 'application/json' },
			data: saveResponse,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
