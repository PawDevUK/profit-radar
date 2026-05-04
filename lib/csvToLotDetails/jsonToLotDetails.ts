import { createLotObject, LotDetailsType } from '../types/lotDetails-type';
import { camelCase } from 'lodash';
import output from './output.json';

export async function convertJsonSalesList(saleId: string) {
	const lotDetailsArray: LotDetailsType[] = [];

	output.forEach((lot) => {
		let lotDetails: LotDetailsType = createLotObject();

		Object.keys(lot).forEach((property) => {
			lotDetails = {
				...lotDetails,
				saleId,
				[camelCase(property)]: (lot as Record<string, any>)[property],
			};
		});
		lotDetailsArray.push(lotDetails);
	});
	console.log(lotDetailsArray);
	return lotDetailsArray;

	// keys need to be converted into camelcase.
	// Json needs to be converted into lotDetails
}
