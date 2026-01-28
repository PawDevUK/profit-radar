import { checkAllCarsAndSaveToFile } from '../lib/otomoto-checker.ts';

async function main() {
	try {
		console.log('='.repeat(60));
		console.log('OTOMOTO LISTING CHECK');
		console.log('='.repeat(60));
		console.log('');

		const results = await checkAllCarsAndSaveToFile();

		console.log('');
		console.log('='.repeat(60));
		console.log('DETAILED RESULTS:');
		console.log('='.repeat(60));

		results.forEach((car, index) => {
			console.log(`\n${index + 1}. ${car.make} ${car.model} (${car.year})`);
			console.log(`   Lot #: ${car.lotNumber}`);
			console.log(`   Odometer: ${car.odometer} km`);
			console.log(`   Listed on Otomoto: ${car.listed_otomoto ? '✓ YES' : '✗ NO'}`);
			if (car.listing_count && car.listing_count > 0) {
				console.log(`   Listings found: ${car.listing_count}`);
			}
		});

		console.log('');
		console.log('='.repeat(60));
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

main();
