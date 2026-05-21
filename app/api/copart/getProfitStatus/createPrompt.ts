export default function createPrompt(data: string) {
	const prompt = `You are an automotive export risk analyst.
Analyze the provided vehicle data and return a conservative profitability report for exporting from USA.
Target markets are ONLY: Poland, Ukraine, and Germany.

---- IMPORTANT ----
USE ONLY REAL RESALE FIGURES, NOT ESTIMATES.
IF VEHICLE RESALE VALUE IS LOWER THAN SHIPPING COST AND DUTIES, MARK IT.
IF YOU CANNOT VERIFY MARKET VALUE, CHECK LOCAL MARKET LISTINGS FOR EXACT MAKE, MODEL, YEAR.
DO NOT ASSUME RESALE VALUE.
GET REAL RESALE VALUE FROM EXTERNAL PAGES.
-------------------

Critical rules:
1. Return valid json only.
2. Do not include markdown, comments, or text outside json.
3. If data needed for accurate pricing is missing, mark confidence as low and set nonProfit to true unless the margin is clearly positive.
4. Prefer underestimating resale value and overestimating total cost.
5. Never output high confidence unless cost, repair risk, and resale assumptions are internally consistent.
6. Perform arithmetic consistency checks:
   - estimatedTotalCostUsd = estimatedPurchaseCostUsd + estimatedRepairCostUsd + estimatedShippingAndImportUsd
   - estimatedNetProfitUsd = estimatedResaleValueUsd - estimatedTotalCostUsd
   - estimatedRoiPercent = (estimatedNetProfitUsd / estimatedTotalCostUsd) * 100
7. If any formula cannot be satisfied, lower confidence and explain in reasoning.
8. Use image urls to assess the damage of the car.
9. Use external websites to make sure the resale value is correct.
  - For Poland use otomoto.pl
  - For Germany use mobile.de or autoscout24.de or mobile.de
  - For Ukraine use auto.ria.com
10. Add to each returned country object source of resale value.
11. Return exactly 3 countries in topCountries and they must be: Poland, Ukraine, Germany.

Vehicle data (json string):
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
      "rank": number,
      "country": "string",
      "distanceAuctionToPort": "number",
      "estimateInLandUsaTransport": "number",
      "estimateInLandUsaTransportCost": "number",
      "portOfOrigin": "string",
      "portOfDestination": "string",
      "daysOfSail": "number",
      "estimateSeaTransportCost": "number",
      "estimatedPurchaseCostUsd": "number",
      "estimatedRepairCostUsd": "number",
      "estimatedShippingAndImportUsd": "number",
      "estimatedTotalCostUsd": "number",
      "estimatedResaleValueUsd": "number",
      "estimatedNetProfitUsd": "number",
      "estimatedRoiPercent": "number",
      "timeToSellDays": "number",
      "confidence": "low|medium|high",
      "reasoning": "short string",
      "resaleValueSource": "string"
    }
  ],
  "bestChoice": {
    "country": "string",
    "whyBest": "string"
  }
}`;

	return prompt;
}
