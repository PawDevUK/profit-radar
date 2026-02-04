import { CopartSaleListScraper } from './lib/scrapers/copart/saleListScraper.mjs';

console.log('Creating scraper...');
const scraper = new CopartSaleListScraper({ proxy: false });
console.log('Initializing...');

scraper.initialize().then(() => {
  console.log('Initialized successfully');
  return scraper.close();
}).then(() => {
  console.log('Closed successfully');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});