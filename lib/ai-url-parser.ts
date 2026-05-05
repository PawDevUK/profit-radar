interface ParsedCarTitle {
	year: string;
	make: string;
	model: string;
	trim?: string;
	title: string;
}

export async function parseCarUrlWithAI(url: string): Promise<ParsedCarTitle> {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		console.warn('OPENAI_API_KEY not set, falling back to basic parsing');
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
						content: `You are a url parser. Extract structured information from url. It is a link to the detailed page of a lot. In this url are year, make, mode, trim, title. 
Return ONLY a JSON object with these fields:
- year: 4-digit year
- make: Car manufacturer (e.g., Ford, Kia, BMW)
- model: Car model WITHOUT trim (e.g., Transit, Telluride, 3 Series)
- trim: Trim level if present (e.g., EX, T-150, XLT, Limited)
- title: This is combine year, make, model

Examples:
"https://www.copart.com/lot/99835775/salvage-2023-honda-civic-sport-ct-hartford" → {"year":"2023","make":"honda","model":"civic","trim":"sport","title":"2023 Honda Civic"}
"https://www.copart.com/lot/98765432/salvage-2022-toyota-camry-le-ny-albany" → {"year":"2022","make":"toyota","model":"camry","trim":"le","title":"2022 Toyota Camry"}
"https://www.copart.com/lot/97654321/salvage-2021-ford-f-150-xlt-tx-houston" → {"year":"2021","make":"ford","model":"f-150","trim":"xlt","title":"2021 Ford F-150"}
"https://www.copart.com/lot/96543210/salvage-2023-chevrolet-silverado-1500-lt-ca-los-angeles" → {"year":"2023","make":"chevrolet","model":"silverado-1500","trim":"lt","title":"2023 Chevrolet Silverado 1500"}
"https://www.copart.com/lot/95432109/salvage-2020-kia-telluride-ex-fl-miami" → {"year":"2020","make":"kia","model":"telluride","trim":"ex","title":"2020 Kia Telluride"}
`,
					},
					{
						role: 'user',
						content: url,
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
			year: parsed.year || null,
			make: parsed.make || null,
			model: parsed.model || null,
			trim: parsed.trim || undefined,
			title: parsed.title || null,
		};
	} catch (error) {
		console.error('AI parsing failed, falling back to basic parsing:', error);
		return {
			year: '',
			make: '',
			model: '',
			trim: undefined,
			title: '',
		};
	}
}
