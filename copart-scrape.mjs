#!/usr/bin/env node
// @ts-nocheck
/**
 * Copart Auction Scraper with "Buy It Now" Price Extraction
 * Scrapes specified auction URL and extracts buyItNowPrice field
 * 
 * Usage: 
 *   node copart-scrape.mjs <url> [limit]
 *   Or reads from .env saleListResults variable
 */

import WebScraper from './lib/scraper.ts';
import { CopartAdapter } from './lib/scrapers/copart/copart_adapter.ts';
import fs from 'fs';

// Get URL from command line args or .env
let auctionUrl = process.argv[2];
const limit = parseInt(process.argv[3]) || 10;

if (!auctionUrl) {
    // Try to read from .env
    const envContent = fs.readFileSync('.env', 'utf-8');
    const urlMatch = envContent.match(/saleListResults\s*=\s*(.+)/);
    auctionUrl = urlMatch ? urlMatch[1].trim() : null;
}

if (!auctionUrl) {
    console.error('❌ Error: Auction URL required');
    console.error('Usage: node copart-scrape.mjs <url> [limit]');
    console.error('Or set saleListResults in .env file');
    process.exit(1);
}

async function main() {
    const adapter = new CopartAdapter();
    const scraper = new WebScraper(adapter, { headless: 'new' });

    try {
        console.log('\n🔍 Initializing browser...');
        await scraper.initialize();

        console.log(`Scraping ${limit} cars with "Buy It Now" price extraction...\n`);
        const cars = await adapter.scrapeAuctionCarsWithLimit(scraper.page, auctionUrl, limit, scraper.timeout);

        console.log('\n' + '='.repeat(100));
        console.log('RESULTS');
        console.log('='.repeat(100) + '\n');

        // Display results
        cars.forEach((car, i) => {
            const title = car.title || `${car.year} ${car.make} ${car.model}`.trim();
            const hasPrice = car.buyItNowPrice && car.buyItNowPrice.trim();

            console.log(`[${i + 1}] ${title}`);
            console.log(`    Lot #: ${car.lotNumber || 'N/A'}`);
            console.log(`    Current Bid: ${car.price || 'N/A'}`);
            console.log(`    Buy It Now Price: ${car.buyItNowPrice || 'Not available'} ${hasPrice ? '✓' : ''}`);
            console.log(`    Damage: ${car.damage || 'N/A'}`);
            console.log('');
        });

        // Summary
        const withPrice = cars.filter(c => c.buyItNowPrice && c.buyItNowPrice.trim()).length;
        console.log('='.repeat(100));
        console.log(`📊 Summary:`);
        console.log(`  Total scraped: ${cars.length}`);
        console.log(`  With "Buy It Now" price: ${withPrice}`);
        console.log('='.repeat(100));

        // Save results
        const resultsDir = './results';
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }

        // Save as simple array to the specific file
        const outputPath = './results/copart_first_page_detailed_2026-01-28.json';
        fs.writeFileSync(outputPath, JSON.stringify(cars, null, 2));
        console.log(`\n✅ Results saved to ${outputPath}\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        try {
            await scraper.close();
        } catch (e) {
            // Ignore close errors
        }
    }
}

main();
