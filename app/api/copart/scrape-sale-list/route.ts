import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { LotDetails } from '@/lib/types/lotDetails-type';
import { scrapeCopartSaleList, LotDetails as ScrapedLot } from '@/lib/scrapers/copart/saleList/saleListScraper';

const toNumber = (value: string | number | undefined): number => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
	if (typeof value === 'string') {
		const parsed = parseInt(value.replace(/[^\d.-]/g, ''), 10);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
};

const toStringValue = (value: string | number | undefined): string => {
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return '';
};

const extractMakeModelFromTitle = (title: string): { make: string; model: string } => {
	const parts = title.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return { make: '', model: '' };
	return { make: parts[0], model: parts.slice(1).join(' ') };
};

const parseAuctionIdFromUrl = (auctionUrl: string): string => {
	try {
		const url = new URL(auctionUrl);
		const pathMatch = url.pathname.match(/\/saleListResult\/(\d+)\//i);
		if (pathMatch?.[1]) return pathMatch[1];
		const yardNum = url.searchParams.get('yardNum');
		if (yardNum) return yardNum;
	} catch {
		// no-op, fallback below
	}
	return 'unknown_auction';
};

const mapScrapedCarsToLotDetails = (scrapedData: ScrapedLot[], auctionId: string, location: string): LotDetails[] => {
	return scrapedData.map((car) => {
		const parsedFromTitle = extractMakeModelFromTitle(car.title || '');
		const make = car.make?.trim() || parsedFromTitle.make;
		const model = car.model?.trim() || parsedFromTitle.model;

		return {
			title: car.title || `${car.year ?? ''} ${make} ${model}`.trim(),
			year: toNumber(car.year),
			make,
			model,
			trim: '',
			bodyStyle: car.bodyType || '',
			runAndDrive: false,
			vin: car.vin || '',
			lotNumber: toStringValue(car.lotNumber),
			laneItem: '',
			saleName: location || '',
			location: location || '',
			engineVerified: car.engineStarts === 'Yes',
			engineVerifiedNote: '',
			engineStatus: car.engineStarts || '',
			transmissionEngages: car.transmissionEngages === 'Yes',
			transmissionNote: '',
			titleCode: car.titleCode || '',
			vehicleTitleType: '',
			odometer: toNumber(car.odometer),
			odometerUnit: 'mi',
			odometerStatus: '',
			primaryDamage: car.damage || '',
			cylinders: '',
			color: car.color || '',
			hasKey: car.hasKey === 'Yes',
			engineType: '',
			transmission: car.transmission || '',
			vehicleType: '',
			driveTrain: '',
			fuelType: '',
			saleDate: [car.saleDate, car.saleTime].filter(Boolean).join(' ').trim(),
			highlights: car.highlights || [],
			notes: car.notes || '',
			lastUpdated: new Date().toISOString(),
			currentBid: toNumber(car.price),
			buyItNow: car.buyItNowPrice ? toNumber(car.buyItNowPrice) : null,
			auctionName: auctionId,
			auctionCountdown: '',
			images: car.imageUrls?.length ? car.imageUrls : car.imageUrl ? [car.imageUrl] : [],
			copartLink: car.detailsLink || '',
		};
	});
};

const persistScrapeResults = (auctionId: string, auctionUrl: string, location: string, lotDetails: LotDetails[]) => {
	const resultsDir = path.join(process.cwd(), 'results');
	fs.mkdirSync(resultsDir, { recursive: true });

	const individualResultFile = path.join(resultsDir, `copart_sale_${auctionId}.json`);
	fs.writeFileSync(individualResultFile, JSON.stringify(lotDetails, null, 2), 'utf-8');

	const auctionsFile = path.join(resultsDir, 'auctions.json');
	let allAuctions: Record<
		string,
		{
			location: string;
			viewSalesLink: string;
			scrapedAt: string;
			numberOnSale: number;
			cars: LotDetails[];
		}
	> = {};

	if (fs.existsSync(auctionsFile)) {
		allAuctions = JSON.parse(fs.readFileSync(auctionsFile, 'utf-8'));
	}

	allAuctions[auctionId] = {
		location: location || 'Unknown',
		viewSalesLink: auctionUrl,
		scrapedAt: new Date().toISOString(),
		numberOnSale: lotDetails.length,
		cars: lotDetails,
	};

	fs.writeFileSync(auctionsFile, JSON.stringify(allAuctions, null, 2), 'utf-8');

	const appSaleListFile = path.join(process.cwd(), 'app', 'results', 'saleList.json');
	fs.mkdirSync(path.dirname(appSaleListFile), { recursive: true });
	fs.writeFileSync(appSaleListFile, JSON.stringify(lotDetails, null, 2), 'utf-8');
};

async function runSaleListScrape({
	auctionUrl,
	auctionId,
	location,
	headless,
	limit,
}: {
	auctionUrl: string;
	auctionId?: string;
	location?: string;
	headless?: boolean;
	limit?: number;
}) {
	if (!auctionUrl) {
		return NextResponse.json({ error: 'Missing auctionUrl' }, { status: 400 });
	}

	const resolvedAuctionId = auctionId || parseAuctionIdFromUrl(auctionUrl);
	const resolvedLocation = location || '';

	console.log(`Starting sale list scraper for auction: ${resolvedAuctionId}`);
	console.log(`Location: ${resolvedLocation || 'N/A'}`);
	console.log(`Full URL: ${auctionUrl}`);

	const scrapedData = await scrapeCopartSaleList(auctionUrl, {
		headless: typeof headless === 'boolean' ? headless : false,
		timeout: 180000,
		limit: typeof limit === 'number' && limit > 0 ? limit : undefined,
		scrapeLotDetails: true,
		interLotDelayMs: 700,
	});

	const lotDetails = mapScrapedCarsToLotDetails(scrapedData, resolvedAuctionId, resolvedLocation);
	persistScrapeResults(resolvedAuctionId, auctionUrl, resolvedLocation, lotDetails);

	return NextResponse.json({
		success: true,
		message: `Successfully scraped auction ${resolvedAuctionId}`,
		auctionId: resolvedAuctionId,
		count: lotDetails.length,
	});
}

export async function POST(request: NextRequest) {
	try {
		const { auctionUrl, auctionId, location, headless, limit } = await request.json();
		return await runSaleListScrape({ auctionUrl, auctionId, location, headless, limit });
	} catch (error: unknown) {
		console.error('Error running sale list scraper:', error);
		return NextResponse.json(
			{
				error: 'Failed to scrape sale list',
				details: error && typeof error === 'object' && 'message' in error ? (error as { message?: string }).message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const auctionUrl = searchParams.get('auctionUrl') || searchParams.get('url') || '';
		const auctionId = searchParams.get('auctionId') || undefined;
		const location = searchParams.get('location') || undefined;
		const headlessParam = searchParams.get('headless');
		const limitParam = searchParams.get('limit');
		const headless = headlessParam === null ? undefined : headlessParam !== 'false';
		const limit = limitParam ? parseInt(limitParam, 10) : undefined;

		return await runSaleListScrape({ auctionUrl, auctionId, location, headless, limit });
	} catch (error: unknown) {
		console.error('Error running sale list scraper:', error);
		return NextResponse.json(
			{
				error: 'Failed to scrape sale list',
				details: error && typeof error === 'object' && 'message' in error ? (error as { message?: string }).message : String(error),
			},
			{ status: 500 },
		);
	}
}
