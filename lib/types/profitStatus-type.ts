export type ProfitRepairLevel = 'minor' | 'moderate' | 'major' | 'severe' | 'total_loss';
export type ProfitConfidence = 'low' | 'medium' | 'high';

export interface ProfitRepairLevelDefinition {
	minor: string;
	moderate: string;
	major: string;
	severe: string;
	total_loss: string;
}

export interface ProfitCountry {
	rank: number;
	country: string;
	distanceAuctionToPort: number;
	estimateInLandUsaTransport: number;
	estimateInLandUsaTransportCost: number;
	portOfOrigin: string;
	portOfDestination: string;
	daysOfSail: number;
	estimateSeaTransportCost: number;
	estimatedPurchaseCostUsd: number;
	estimatedRepairCostUsd: number;
	estimatedShippingAndImportUsd: number;
	estimatedTotalCostUsd: number;
	estimatedResaleValueUsd: number;
	estimatedNetProfitUsd: number;
	estimatedRoiPercent: number;
	confidence: ProfitConfidence;
	reasoning: string;
}

export interface ProfitBestChoice {
	country: string;
	whyBest: string;
}

export interface ProfitStatusDetailsType {
	lotId: string;
	condition: string;
	titleType: string | null;
	estimatedRepairLevel: ProfitRepairLevel;
	estimatedRepairLevelDefinition: ProfitRepairLevelDefinition;
	damage: string;
	nonProfit: boolean;
	topCountries: ProfitCountry[];
	bestChoice: ProfitBestChoice;
}
