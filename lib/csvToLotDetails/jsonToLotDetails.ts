import { createLotObject, LotDetailsType } from '../types/lotDetails-type';
import { camelCase } from 'lodash';

export async function convertJsonSalesList(saleId: string, json) {
	const lotDetailsArray: LotDetailsType[] = [];
	const trimOdometer = (odo: string) => {
		return odo.replace(/[^0-9,]/g, '');
	};
	if (json.length > 0) {
		json.forEach((lot) => {
			let lotDetails: LotDetailsType = createLotObject();

			Object.keys(lot).forEach((property) => {
				if (property === 'Odometer') {
					lotDetails = {
						...lotDetails,
						odometer: trimOdometer(lot[property]),
					};
				} else {
					lotDetails = {
						...lotDetails,
						saleId,
						[camelCase(property)]: (lot as Record<string, any>)[property],
					};
				}
			});
			lotDetailsArray.push(lotDetails);
		});
		return lotDetailsArray;
	} else {
		throw console.error('Json object is empty!');
	}

	// keys need to be converted into camelcase.
	// Json needs to be converted into lotDetails
}
