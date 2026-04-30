import callOpenAI from '@/lib/openAI/callOpenAI';
import prompt from './prompt';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

function isLotDetailsType(value: unknown): value is LotDetailsType {
	return typeof value === 'object' && value !== null;
	// Add stricter field checks here if possible
}

export const AILotScraper = async function (urls: string[]) {
	if (!urls || urls.length === 0) return [];

	const scrapedData: LotDetailsType[] = [];

	async function getLotData(url: string): Promise<LotDetailsType> {
		const raw = await callOpenAI(prompt(url)); // likely string

		let parsed: unknown = raw;
		if (typeof raw === 'string') {
			parsed = JSON.parse(raw);
		}

		if (!isLotDetailsType(parsed)) {
			throw new Error('Invalid lot details payload');
		}
		return parsed;
	}
	const numOfLots = urls.length;
	let numberScraped = 0;
	let leftToScrape = numOfLots - numberScraped;
	for (const url of urls) {
		const lotDetails = await getLotData(url);
		scrapedData.push(lotDetails);
		numberScraped += 1;
		leftToScrape = numOfLots - numberScraped;
		console.log('Number of lots to scrape:', numOfLots);
		console.log('Number of Scraped:', numberScraped);
		console.log('Left to Scrape:', leftToScrape);
	}

	console.log('Finished scraping and extracting with use of Open AI');
	console.log('Number of Scraped:', numberScraped);

	return scrapedData;
};
