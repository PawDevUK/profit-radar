import { writeFile } from 'node:fs/promises';

function extractJsonPayload(rawResponse: string): string {
	const trimmedResponse = rawResponse.trim();
	const fencedMatch = trimmedResponse.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
	if (fencedMatch?.[1]) {
		return fencedMatch[1].trim();
	}

	const firstBraceIndex = trimmedResponse.indexOf('{');
	const lastBraceIndex = trimmedResponse.lastIndexOf('}');
	if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
		return trimmedResponse.slice(firstBraceIndex, lastBraceIndex + 1);
	}

	return trimmedResponse;
}

export default async function parseAndSaveResponse(rawResponse: string): Promise<void> {
	const outputPath = new URL('./response.json', import.meta.url);
	const rawOutputPath = new URL('./response.raw.txt', import.meta.url);
	const normalizedResponse = extractJsonPayload(rawResponse);

	let parsedResponse: unknown;
	try {
		parsedResponse = JSON.parse(normalizedResponse);
	} catch (error) {
		await writeFile(rawOutputPath, rawResponse, 'utf-8');
		const errorMessage = error instanceof Error ? error.message : 'Unknown JSON parsing error';
		throw new Error(`Failed to parse OpenAI response as JSON. Raw response saved to ${rawOutputPath.pathname}. ${errorMessage}`);
	}

	console.log('Parsed----- > ');
	await writeFile(outputPath, JSON.stringify(parsedResponse, null, 2), 'utf-8');
	console.log('Parsed result saved to file.', outputPath);
	return;
}
