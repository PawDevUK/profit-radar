import { NextRequest, NextResponse } from 'next/server';
import { convertJsonSalesList } from '@/lib/csvToLotDetails/jsonToLotDetails';
import { convertCSVtoJSON } from '@/lib/csvToLotDetails/csvToJson';
import { v4 as uuidv4 } from 'uuid';
import output from '@/lib/csvToLotDetails/output.json';
import { saveLots } from '@/lib/db/db';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const id = searchParams.get('id'); // e.g. /api?id=123
	const csvSalePath = searchParams.get('csvSalePath');
	let converted;
	let dataSavedStatus;

	if (csvSalePath && id) {
		const output = await convertCSVtoJSON(csvSalePath);
		converted = await convertJsonSalesList(id, output);
	} else {
		console.log('There is some issue with conversion!');
		console.log('id          ----', id);
		console.log('csvSalePath ----', csvSalePath);
		return NextResponse.json({
			message: 'There is no path to the file or sale id!!',
		});
	}
	if (converted.length > 0) {
		// I need to get all lots from database with saleId
		// Check if database has all of the lots
		// If converted lots are the same save shouldn't be done.
		// If there is some lot missing in database, insert it.

		dataSavedStatus = await saveLots(converted);
	}
	console.log(converted.length);
	return NextResponse.json({
		data: converted,
		message: '',
		dataSavedStatus,
	});
}
