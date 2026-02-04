import { NextResponse } from 'next/server';
import { checkAllCarsOnOtomoto, verifyCarOnOtomoto } from '@/lib/scrapers/otomoto/otomoto-checker';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const action = searchParams.get('action');
		const make = searchParams.get('make');
		const model = searchParams.get('model');

		if (action === 'check-all') {
			// Check all cars from Copart against Otomoto
			const results = await checkAllCarsOnOtomoto();
			return NextResponse.json({
				success: true,
				totalCars: results.length,
				results,
			});
		}

		if (action === 'verify-car' && make && model) {
			// Verify a single car on Otomoto
			const result = await verifyCarOnOtomoto(make, model);
			return NextResponse.json({
				success: true,
				make,
				model,
				found: result.found,
				count: result.count,
			});
		}

		// Return available actions
		return NextResponse.json({
			success: true,
			message: 'Otomoto checker API',
			availableActions: [
				{
					action: 'check-all',
					description: 'Check all Copart cars against Otomoto listings',
					url: '/api/otomoto-checker?action=check-all',
				},
				{
					action: 'verify-car',
					description: 'Verify if a specific car exists on Otomoto',
					url: '/api/otomoto-checker?action=verify-car&make=FORD&model=E150',
					params: ['make', 'model'],
				},
			],
		});
	} catch (error) {
		console.error('Otomoto checker error:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
