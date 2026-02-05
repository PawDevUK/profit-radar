import { CopartScraper } from '../copart/scraper.ts';
import { proxyConfig } from '../proxy/proxy-config.ts';
import fs from 'fs';
import path from 'path';

async function testScraperTs() {
	const auctionUrl =
		process.argv[2] || 'https://www.copart.com/saleListResult/33/2026-01-30?location=FL%20-%20Miami%20North&saleDate=1769785200000&liveAuction=false&from=&yardNum=33';
	const auctionId = process.argv[3] || 'test_auction';

	console.log('Starting Copart Scraper.ts Test');
	console.log('Auction URL:', auctionUrl);
	console.log('Auction ID:', auctionId);
	if (proxyConfig.enabled) {
		console.log('Proxy: ENABLED -', proxyConfig.server);
	} else {
		console.log('Proxy: DISABLED (may be blocked by Copart)');
	}
	console.log('-----------------------------------\n');

	const scraper = new CopartScraper({
		headless: false, // Set to false to see the scraping process
		timeout: 90000,
		fastStart: true,
		proxy: proxyConfig.enabled ? proxyConfig : undefined,
	});

	try {
		console.log('Initializing scraper...');
		await scraper.initialize();

		console.log('Scraping auction cars with full details (limit 5)...');
		const cars = await scraper.scrapeAuctionCarsWithDetails(auctionUrl, 20, 5, true); // 20 per page, limit to 5 total, fetch details

		if (cars && cars.length > 0) {
			console.log('\n✅ Scraping completed successfully!');
			console.log(`Found ${cars.length} cars`);

			// Display sample results
			console.log('\n📋 Sample results (first 3):');
			cars.slice(0, 3).forEach((car, i) => {
				console.log(`\n${i + 1}. Lot ${car.lotNumber}: ${car.title || car.year + ' ' + car.make + ' ' + car.model}`);
				console.log(`   Damage: ${car.damage}`);
				console.log(`   Price: ${car.price}`);
				console.log(`   Images: ${car.images?.length || 0}`);
				console.log(`   Details: ${car.detailsLink}`);
			});

			// Save results to JSON file
			const resultsDir = path.join(process.cwd(), 'results');
			if (!fs.existsSync(resultsDir)) {
				fs.mkdirSync(resultsDir, { recursive: true });
			}

			const resultFile = path.join(resultsDir, `copart_sale_${auctionId}.json`);
			fs.writeFileSync(resultFile, JSON.stringify(cars, null, 2), 'utf-8');

			console.log(`\n💾 Results saved to: ${resultFile}`);
		} else {
			console.log('\n❌ No cars found!');
		}
	} catch (error) {
		console.error('\n❌ Error during scraping:', error.message);
		console.error(error.stack);
		process.exit(1);
	} finally {
		try {
			await scraper.close();
		} catch (closeError) {
			console.error('Error closing browser:', (closeError as Error).message);
		}
	}
}

testScraperTs();
