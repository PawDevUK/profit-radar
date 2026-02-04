import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAllCarsAndSaveToFile, verifyCarOnOtomoto, loadCopartCars } from '@/lib/scrapers/otomoto/otomoto-checker';

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}));
		const { make, model, lotNumber } = body;

		// If specific car provided, verify only that car
		if (make && model && lotNumber) {
			console.log(`Verifying single car: ${make} ${model} (Lot #${lotNumber})`);

			const verification = await verifyCarOnOtomoto(make, model);

			// Load existing results
			const filePath = path.join(process.cwd(), 'results', 'otomoto_listing_check.json');
			const resultsDir = path.dirname(filePath);

			// Ensure results directory exists
			if (!fs.existsSync(resultsDir)) {
				fs.mkdirSync(resultsDir, { recursive: true });
			}

			let allResults = [];

			if (fs.existsSync(filePath)) {
				const content = fs.readFileSync(filePath, 'utf-8');
				// Only parse if content is not empty
				if (content && content.trim()) {
					try {
						allResults = JSON.parse(content);
					} catch (e) {
						console.error('Error parsing existing JSON, starting with empty array');
						allResults = [];
					}
				}
			}

			// Find and update or add the car result
			const existingIndex = allResults.findIndex((r: any) => r.lotNumber === lotNumber);
			const timestamp = new Date().toISOString();

			const carResult = {
				make,
				model,
				year: body.year || 'N/A',
				odometer: body.odometer || 'N/A',
				listed_otomoto: verification.found,
				listing_count: verification.count,
				lotNumber,
				checkedAt: timestamp,
			};

			if (existingIndex >= 0) {
				allResults[existingIndex] = carResult;
			} else {
				allResults.push(carResult);
			}

			// Save updated results
			fs.writeFileSync(filePath, JSON.stringify(allResults, null, 2), 'utf-8');
			console.log(`Updated ${make} ${model} in results file`);

			return NextResponse.json({
				success: true,
				message: 'Single car verification completed and saved',
				result: carResult,
			});
		}

		// Otherwise, check all cars
		console.log('Starting Otomoto listing check for all cars...');
		const results = await checkAllCarsAndSaveToFile();

		const foundCount = results.filter((r) => r.listed_otomoto).length;

		return NextResponse.json({
			success: true,
			message: 'Otomoto listing check completed',
			totalCars: results.length,
			foundCount,
			notFoundCount: results.length - foundCount,
			results,
		});
	} catch (error) {
		console.error('Error running Otomoto check:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const action = searchParams.get('action');

		if (action === 'load') {
			// Load results from otomoto_listing_check.json
			const filePath = path.join(process.cwd(), 'results', 'otomoto_listing_check.json');

			if (!fs.existsSync(filePath)) {
				return NextResponse.json(
					{
						success: false,
						error: 'No listing check results found. Please run the check first.',
					},
					{ status: 404 },
				);
			}

			const content = fs.readFileSync(filePath, 'utf-8');
			const results = JSON.parse(content);

			const foundCount = results.filter((r: any) => r.listed_otomoto).length;

			return NextResponse.json({
				success: true,
				message: 'Loaded from otomoto_listing_check.json',
				totalCars: results.length,
				foundCount,
				notFoundCount: results.length - foundCount,
				results,
			});
		}

		if (action === 'status') {
			return NextResponse.json({
				success: true,
				message: 'Otomoto listing check API',
				endpoints: {
					POST: {
						description: 'Run Otomoto verification',
						body: 'Optional: { make, model, lotNumber, year?, odometer? } to check single car, or empty {} to check all cars',
						returns: 'Verification result(s) with listing counts',
					},
					GET: {
						description: 'Load existing results',
						parameters: {
							action: 'load - Load from otomoto_listing_check.json',
							'action=status': 'Show this help message',
						},
					},
				},
			});
		}

		return NextResponse.json({
			success: true,
			message: 'Otomoto listing check API',
			instructions: 'Use ?action=load to get existing results or ?action=status for help',
		});
	} catch (error) {
		console.error('Otomoto listing check error:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
