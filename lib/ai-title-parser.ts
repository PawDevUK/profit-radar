/**
 * AI-powered car title parser using OpenAI
 * Accurately extracts year, make, model, trim, and body type from car titles
 */

interface ParsedCarTitle {
	year: string;
	make: string;
	model: string;
	trim?: string;
	bodyType?: string;
	rawTitle: string;
}

/**
 * Parse car title using OpenAI API
 * Requires OPENAI_API_KEY environment variable
 */
export async function parseCarTitleWithAI(title: string): Promise<ParsedCarTitle> {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		console.warn('OPENAI_API_KEY not set, falling back to basic parsing');
		return fallbackParse(title);
	}

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `You are a car title parser. Extract structured information from car titles.
Return ONLY a JSON object with these fields:
- year: 4-digit year
- make: Car manufacturer (e.g., Ford, Kia, BMW)
- model: Car model WITHOUT trim (e.g., Transit, Telluride, 3 Series)
- trim: Trim level if present (e.g., EX, T-150, XLT, Limited)
- bodyType: Vehicle type if mentioned (e.g., Sedan, SUV, Van, Truck)

Examples:
"2017 ford transit t-150" → {"year":"2017","make":"Ford","model":"Transit","trim":"T-150","bodyType":"Van"}
"2020 kia telluride ex" → {"year":"2020","make":"Kia","model":"Telluride","trim":"EX","bodyType":"SUV"}
"2014 FORD E150 UTILITY / SERVICE VAN" → {"year":"2014","make":"Ford","model":"E-150","trim":null,"bodyType":"Van"}
"2019 CHEVROLET SILVERADO 1500 LT CREW CAB" → {"year":"2019","make":"Chevrolet","model":"Silverado 1500","trim":"LT","bodyType":"Truck"}`,
					},
					{
						role: 'user',
						content: title,
					},
				],
				temperature: 0.1,
				max_tokens: 150,
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const content = data.choices[0]?.message?.content;

		if (!content) {
			throw new Error('No response from OpenAI');
		}

		// Parse the JSON response
		const parsed = JSON.parse(content.trim());

		return {
			year: parsed.year || '',
			make: parsed.make || '',
			model: parsed.model || '',
			trim: parsed.trim || undefined,
			bodyType: parsed.bodyType || undefined,
			rawTitle: title,
		};
	} catch (error) {
		console.error('AI parsing failed, falling back to basic parsing:', error);
		return fallbackParse(title);
	}
}

/**
 * Fallback parser when AI is not available
 * Simple regex-based parsing
 */
function fallbackParse(title: string): ParsedCarTitle {
	if (!title || typeof title !== 'string') {
		return { year: '', make: '', model: '', rawTitle: title };
	}

	const parts = title.trim().split(/\s+/);

	const year = parts.length > 0 && /^\d{4}$/.test(parts[0]) ? parts[0] : '';
	const make = parts.length > 1 ? parts[1] : '';
	const model = parts.length > 2 ? parts[2] : '';

	// Common trim patterns
	const trimPatterns = /\b(EX|LX|LT|LS|SE|XL|XLT|LIMITED|SPORT|BASE|PREMIUM|S|SV|SR|SL|T-\d+)\b/i;
	const trimMatch = title.match(trimPatterns);
	const trim = trimMatch ? trimMatch[0] : undefined;

	// Common body type patterns
	const bodyTypePatterns = /\b(SEDAN|SUV|VAN|TRUCK|COUPE|HATCHBACK|WAGON|CONVERTIBLE|CROSSOVER)\b/i;
	const bodyTypeMatch = title.match(bodyTypePatterns);
	const bodyType = bodyTypeMatch ? bodyTypeMatch[0] : undefined;

	return {
		year,
		make,
		model: trim && model.includes(trim) ? model.replace(trim, '').trim() : model,
		trim,
		bodyType,
		rawTitle: title,
	};
}

/**
 * Batch parse multiple car titles
 * Uses rate limiting to avoid API throttling
 */
export async function batchParseCarTitles(titles: string[], delayMs: number = 100): Promise<ParsedCarTitle[]> {
	const results: ParsedCarTitle[] = [];

	for (let i = 0; i < titles.length; i++) {
		const parsed = await parseCarTitleWithAI(titles[i]);
		results.push(parsed);

		// Add delay between requests to avoid rate limiting
		if (i < titles.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}

		// Progress logging
		if ((i + 1) % 10 === 0) {
			console.log(`Parsed ${i + 1}/${titles.length} titles...`);
		}
	}

	return results;
}

/**
 * Update car data with AI-parsed title information
 */
export async function enhanceCarDataWithAIParsing(cars: any[]): Promise<any[]> {
	console.log(`Enhancing ${cars.length} cars with AI title parsing...`);

	const enhanced = await Promise.all(
		cars.map(async (car, index) => {
			if (!car.title) return car;

			const parsed = await parseCarTitleWithAI(car.title);

			// Add delay to avoid rate limiting (100ms between requests)
			if (index > 0 && index % 10 === 0) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}

			return {
				...car,
				year: parsed.year || car.year,
				make: parsed.make || car.make,
				model: parsed.model || car.model,
				trim: parsed.trim || car.trim,
				bodyType: parsed.bodyType || car.bodyType,
			};
		}),
	);

	console.log('AI title parsing complete!');
	return enhanced;
}
