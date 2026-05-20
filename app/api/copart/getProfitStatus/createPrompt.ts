import { LotDetailsType } from '@/lib/types/lotDetails-type';

export default function createPrompt(data: string) {
	const prompt = `You are an expert automotive export market analyst.
		Analyze the provided vehicle data and identify the 3 best destination countries for export from the USA to maximize resale profit.
		
		---- IMPORTANT ----
			USE ONLY REAL RESALE FIGURES, NOT ESTIMATES.
			IF VEHICLE RESALE VALUE IS LOWER THAN SHIPPING COST AND DUTIES, MARK IT.
			IF YOU CANNOT VERIFY MARKET VALUE, CHECK LOCAL MARKET LISTINGS FOR EXACT MAKE, MODEL, YEAR.
			DO NOT ASSUME RESALE VALUE.
			GET REAL RESALE VALUE.
		-------------------

		Requirements:
		1. Return valid json only.
		2. Do not include markdown, comments, or text outside json.
		3. Use realistic assumptions for import duty, taxes, shipping/logistics, repair complexity, local demand, and resale liquidity.
		4. Rank countries from highest to lowest estimated net profit.
		5. If export is not economically viable, set nonProfit to true and still provide 3 fallback countries with low confidence.
		6. To mark estimatedR

		Vehicle data:
		${data}

		Return this exact json structure:
		{
		    "estimatedRepairLevel": "minor|moderate|major|severe|total_loss",
		    "estimatedRepairLevelDefinition": {
		      "minor": "cosmetic only, drivable",
		      "moderate": "limited parts repair, no frame damage",
		      "major": "structural or multiple systems affected",
		      "severe": "heavy structural/flood/fire damage",
		      "total_loss": "uneconomical to repair"
		    },
		    "damage": "string",
		    "nonProfit": "boolean",
		    "topCountries": [
		      {
		        "rank": 1,
		        "country": "string",
				"distanceAuctionToPort":"number",
				"estimateInLandUsaTransport":"number",
				"estimateInLandUsaTransportCost":"number",
				"portOfOrigin":"string",
				"portOfDestination":"string",
				"daysOfSail":"number",
				"estimateSeaTransportCost":"number",
				"estimatedPurchaseCostUsd": "number",
				"estimatedRepairCostUsd": "number",
				"estimatedShippingAndImportUsd": "number",
				"estimatedTotalCostUsd": "number",
				"estimatedResaleValueUsd": "number",
				"estimatedNetProfitUsd": "number",
				"estimatedRoiPercent": "number",
				"timeToSellDays": "number",
				"confidence": "low|medium|high",
				"reasoning": "short string"
		      },
		      {
		        "rank": 2,
		        "country": "string",
				"distanceAuctionToPort":"number",
				"estimateInLandUsaTransport":"number",
				"estimateInLandUsaTransportCost":"number",
				"portOfOrigin":"string",
				"portOfDestination":"string",
				"daysOfSail":"number",
				"estimateSeaTransportCost":"number",
				"estimatedPurchaseCostUsd": "number",
				"estimatedRepairCostUsd": "number",
				"estimatedShippingAndImportUsd": "number",
				"estimatedTotalCostUsd": "number",
				"estimatedResaleValueUsd": "number",
				"estimatedNetProfitUsd": "number",
				"estimatedRoiPercent": "number",
				"timeToSellDays": "number",
				"confidence": "low|medium|high",
				"reasoning": "short string"
		      },
		      {
		        "rank": 3,
		        "country": "string",
				"distanceAuctionToPort":"number",
				"estimateInLandUsaTransport":"number",
				"estimateInLandUsaTransportCost":"number",
				"portOfOrigin":"string",
				"portOfDestination":"string",
				"daysOfSail":"number",
				"estimateSeaTransportCost":"number",
				"estimatedPurchaseCostUsd": "number",
				"estimatedRepairCostUsd": "number",
				"estimatedShippingAndImportUsd": "number",
				"estimatedTotalCostUsd": "number",
				"estimatedResaleValueUsd": "number",
				"estimatedNetProfitUsd": "number",
				"estimatedRoiPercent": "number",
				"timeToSellDays": "number",
				"confidence": "low|medium|high",
				"reasoning": "short string"
		      }
		    ],
		    "bestChoice": {
		      "country": "string",
		      "whyBest": "string"
		    }
		 
		}
	`;

	return prompt;
}
