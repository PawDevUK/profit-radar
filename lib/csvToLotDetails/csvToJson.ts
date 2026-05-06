import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function convertCSVtoJSON(file: string): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const results: any[] = [];
		fs.createReadStream(file)
			.pipe(csv())
			.on('data', (data) => results.push(data))
			.on('end', () => resolve(results))
			.on('error', reject);
	});
}

export async function convertCSVtoJSON_save(file: string) {
	const results: string[] = [];
	fs.createReadStream(file)
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', () => {
			fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
			console.log('Conversion complete');
		});
	return results;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvFile = path.join(__dirname, './LotSearchresults__2026_April_21.csv');
// const convertedJson = convertCSVtoJSON_save(csvFile);
