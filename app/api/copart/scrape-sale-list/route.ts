import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { LotDetails } from '@/lib/types/lotDetails-type';

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

			// Map scrapedData into LotDetails[] (best-effort mapping)
			const lotDetails: LotDetails[] = Array.isArray(scrapedData)
				? scrapedData.map((car: ScrapedCar) => ({
						title: car.title || `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''}`.trim(),
						year: toNumber(car.year),
						make: car.make || '',
						model: car.model || '',
						trim: '',
						bodyStyle: '',
						runAndDrive: false,
						vin: '',
						lotNumber: toStringValue(car.lotNumber),
						laneItem: car.laneItem || '',
						saleName: car.yardLocation || '',
						location: car.location || location || '',
						engineVerified: false,
						engineVerifiedNote: '',
						engineStatus: '',
						transmissionEngages: false,
						transmissionNote: '',
						titleCode: car.conditionTitle || '',
						vehicleTitleType: '',
						odometer: toNumber(car.odometer),
						odometerUnit: 'mi',
						odometerStatus: car.odometerStatus || '',
						primaryDamage: car.damage || '',
						cylinders: '',
						color: '',
						hasKey: typeof car.hasKey === 'boolean' ? car.hasKey : car.keys === 'Yes',
						engineType: '',
						transmission: '',
						vehicleType: '',
						driveTrain: '',
						fuelType: '',
						saleDate: '',
						highlights: [],
						notes: '',
						lastUpdated: new Date().toISOString(),
						currentBid: toNumber(car.currentBid) || toNumber(car.price),
						buyItNow: typeof car.buyItNow === 'undefined' ? null : toNumber(car.buyItNow),
						auctionName: auctionId,
						auctionCountdown: car.auctionCountdown || '',
						images: [],
						copartLink: '',
					}))
				: [];

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
