import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUCTIONS_FILE = path.join(process.cwd(), 'results', 'auctions.json');

// Ensure auctions.json exists
function ensureAuctionsFile() {
	if (!fs.existsSync(AUCTIONS_FILE)) {
		fs.writeFileSync(AUCTIONS_FILE, '{}', 'utf-8');
	}
}

export async function GET(request: NextRequest) {
	try {
		ensureAuctionsFile();
		const searchParams = request.nextUrl.searchParams;
		const auctionId = searchParams.get('auctionId');

		const auctionsData = JSON.parse(fs.readFileSync(AUCTIONS_FILE, 'utf-8'));

		if (auctionId) {
			// Return specific auction
			const auction = auctionsData[auctionId];
			if (auction) {
				const res = NextResponse.json(auction);
				res.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
				return res;
			} else {
				return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
			}
		} else {
			// Return all auctions
			const res = NextResponse.json(auctionsData);
			res.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
			return res;
		}
	} catch (error: unknown) {
		console.error('Error reading auctions:', error);
		return NextResponse.json({ error: 'Failed to read auctions', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		ensureAuctionsFile();
		const { auctionId, data } = await request.json();

		if (!auctionId || !data) {
			return NextResponse.json({ error: 'Missing auctionId or data' }, { status: 400 });
		}

		// Read existing auctions
		const auctionsData = JSON.parse(fs.readFileSync(AUCTIONS_FILE, 'utf-8'));

		// Add or update the auction
		auctionsData[auctionId] = {
			...data,
			scrapedAt: new Date().toISOString(),
		};

		// Write back to file
		fs.writeFileSync(AUCTIONS_FILE, JSON.stringify(auctionsData, null, 2), 'utf-8');

		return NextResponse.json({ success: true, message: 'Auction data saved' });
	} catch (error: unknown) {
		console.error('Error saving auction:', error);
		return NextResponse.json({ error: 'Failed to save auction', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
	}
}
