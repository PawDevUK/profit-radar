import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

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

		// After scraping, read the result and add it to auctions.json
		const resultFile = path.join(process.cwd(), 'results', `copart_sale_${auctionId}.json`);
		if (fs.existsSync(resultFile)) {
			const scrapedData = JSON.parse(fs.readFileSync(resultFile, 'utf-8'));

			// Save to consolidated auctions.json only
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

				// Delete the individual result file after saving to auctions.json
				fs.unlinkSync(resultFile);
				console.log(`Deleted temporary file: ${resultFile}`);
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
