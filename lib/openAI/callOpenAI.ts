import 'dotenv/config';
import OpenAI from 'openai';

export default async function callOpenAI(Prompt: string) {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		throw new Error('OPENAI_API_KEY environment variable is not defined');
	}

	const openai = new OpenAI({ apiKey });

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [{ role: 'user', content: Prompt }],
		response_format: { type: 'json_object' },
		max_tokens: 4000,
		temperature: 0,
	});

	if (!completion || !completion.choices || completion.choices.length === 0) {
		console.error('Invalid OpenAI API response structure:', completion);
		throw new Error('Invalid response from OpenAI API');
	}

	const content = completion.choices[0]?.message?.content;
	if (!content || typeof content !== 'string') {
		console.error('No content in OpenAI response:', completion.choices[0]);
		throw new Error('No content received from OpenAI API');
	}
	console.log(`Received OpenAI response, parsing JSON...`);
	return content;
}
