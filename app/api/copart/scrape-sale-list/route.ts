import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { attachSaleListToAuctionByLink } from '@/lib/db/db';
import type { SaleList } from '@/lib/types/saleList';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
	try {
		const { auctionUrl, auctionId, location } = await request.json();

		if (!auctionUrl || !auctionId) {
			return NextResponse.json({ error: 'Missing auctionUrl or auctionId' }, { status: 400 });
		}

		console.log(`Starting sale list scraper for auction: ${auctionId}`);
		console.log(`Location: ${location || 'N/A'}`);
		console.log(`Full URL: ${auctionUrl}`);

		// Run the scraper with the auction URL and ID using tsx
		const command = `npx tsx lib/scrapers/test/test-scraper-ts.ts "${auctionUrl}" "${auctionId}"`;

		console.log(`Executing command: ${command}`);

		const { stdout, stderr } = await execAsync(command, {
			cwd: process.cwd(),
			timeout: 180000, // 3 minute timeout for scraping
		});

		if (stderr && !stderr.includes('DeprecationWarning') && !stderr.includes('ExperimentalWarning')) {
			console.error('Scraper stderr:', stderr);
		}

		console.log('Scraper output:', stdout);

		// After scraping, read the result and persist to Mongo + keep consolidated file for debugging
		const resultFile = path.join(process.cwd(), 'results', `copart_sale_${auctionId}.json`);
		if (fs.existsSync(resultFile)) {
			const scrapedData = JSON.parse(fs.readFileSync(resultFile, 'utf-8'));

			// Map scrapedData into SaleList[] (best-effort mapping)
			const saleList: SaleList[] = Array.isArray(scrapedData)
				? scrapedData.map((car: any) => ({
						title: car.title || `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''}`.trim(),
						lotNr: String(car.lotNumber ?? ''),
						odometr: car.odometer ? String(car.odometer) : '',
						odometrStatus: car.odometerStatus || '',
						EstimateRetail: car.estimateRetail || '',
						condionTitle: car.conditionTitle || '',
						damage: car.damage || '',
						keys: typeof car.hasKey === 'boolean' ? (car.hasKey ? 'Yes' : 'No') : car.keys || '',
						location: car.location || location || '',
						yeardLocation: car.yeardLocation || '',
						item: car.laneItem || '',
						actionCountDown: car.auctionCountdown || '',
						currentBid: car.currentBid ? String(car.currentBid) : car.price ? String(car.price) : '',
						buyItNow: car.buyItNow ? String(car.buyItNow) : '',
						details: undefined as any, // filled when scraping lot details separately
					}))
				: [];

			if (saleList.length > 0) {
				try {
					const modified = await attachSaleListToAuctionByLink(auctionUrl, saleList);
					console.log(`Attached ${saleList.length} sale list items to auction in DB (modified=${modified}).`);
				} catch (dbErr: any) {
					console.warn('Failed to attach sale list to DB:', dbErr?.message || dbErr);
				}
			}

			// Save to consolidated auctions.json (debug/backup)
			if (scrapedData && scrapedData.length > 0) {
				const auctionsFile = path.join(process.cwd(), 'results', 'auctions.json');
				let allAuctions = {};

				if (fs.existsSync(auctionsFile)) {
					allAuctions = JSON.parse(fs.readFileSync(auctionsFile, 'utf-8'));
				}

				allAuctions[auctionId] = {
					location: location || 'Unknown',
					viewSalesLink: auctionUrl,
					scrapedAt: new Date().toISOString(),
					numberOnSale: scrapedData.length,
					cars: scrapedData,
				};

				fs.writeFileSync(auctionsFile, JSON.stringify(allAuctions, null, 2), 'utf-8');
				console.log(`Added auction ${auctionId} to auctions.json`);

				// Keep the individual result file for now (useful for cross-checking)
			}
		}

		return NextResponse.json({
			success: true,
			message: `Successfully scraped auction ${auctionId}`,
		});
	} catch (error: any) {
		console.error('Error running sale list scraper:', error);
		return NextResponse.json(
			{
				error: 'Failed to scrape sale list',
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
