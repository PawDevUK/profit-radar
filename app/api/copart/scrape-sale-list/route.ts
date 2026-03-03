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

			// Define the type for scraped car objects
			type ScrapedCar = {
				title?: string;
				year?: string | number;
				make?: string;
				model?: string;
				lotNumber?: string | number;
				odometer?: string | number;
				odometerStatus?: string;
				estimateRetail?: string;
				conditionTitle?: string;
				damage?: string;
				hasKey?: boolean;
				keys?: string;
				location?: string;
				yardLocation?: string;
				laneItem?: string;
				auctionCountdown?: string;
				currentBid?: string | number;
				price?: string | number;
				buyItNow?: string | number;
			};

			// Map scrapedData into SaleList[] (best-effort mapping)
			const saleList: SaleList[] = Array.isArray(scrapedData)
				? scrapedData.map((car: ScrapedCar) => ({
						title: car.title || `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''}`.trim(),
						year: car.year,
						make: car.make,
						model: car.model,
						vin: undefined,
						images: [],
						lotNumber: typeof car.lotNumber === 'string' ? parseInt(car.lotNumber, 10) : car.lotNumber || 0,
						odometer: typeof car.odometer === 'string' ? parseInt(car.odometer, 10) : car.odometer || 0,
						odometerStatus: car.odometerStatus || '',
						estimateRetail: car.estimateRetail || '',
						titleCode: car.conditionTitle || '',
						primaryDamage: car.damage || '',
						hasKey: typeof car.hasKey === 'boolean' ? car.hasKey : car.keys === 'Yes',
						location: car.location || location || '',
						saleName: car.yardLocation || '',
						laneItem: car.laneItem || '',
						auctionCountdown: car.auctionCountdown || '',
						currentBid: typeof car.currentBid === 'string' ? parseInt(car.currentBid, 10) : car.currentBid || car.price ? parseInt(String(car.price), 10) : 0,
						buyItNow: car.buyItNow ? parseInt(String(car.buyItNow), 10) : null,
						details: null,
					}))
				: [];

			if (saleList.length > 0) {
				try {
					const modified = await attachSaleListToAuctionByLink(auctionUrl, saleList);
					console.log(`Attached ${saleList.length} sale list items to auction in DB (modified=${modified}).`);
				} catch (dbErr: unknown) {
					if (dbErr && typeof dbErr === 'object' && 'message' in dbErr) {
						console.warn('Failed to attach sale list to DB:', (dbErr as { message?: string }).message);
					} else {
						console.warn('Failed to attach sale list to DB:', dbErr);
					}
				}
			}

			// Save to consolidated auctions.json (debug/backup)
			if (scrapedData && scrapedData.length > 0) {
				const auctionsFile = path.join(process.cwd(), 'results', 'auctions.json');
				let allAuctions: Record<
					string,
					{
						location: string;
						viewSalesLink: string;
						scrapedAt: string;
						numberOnSale: number;
						cars: SaleList[];
					}
				> = {};

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
