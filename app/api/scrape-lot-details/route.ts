// This route has been deprecated.
// Lot details are now scraped during the auction scrape and stored in auctions.json.
export async function POST() {
	return new Response(JSON.stringify({ error: 'scrape-lot-details is deprecated' }), {
		status: 410,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function GET() {
	return new Response(JSON.stringify({ error: 'scrape-lot-details is deprecated' }), {
		status: 410,
		headers: { 'Content-Type': 'application/json' },
	});
}
