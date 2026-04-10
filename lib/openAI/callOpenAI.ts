import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const systemPrompt = function (html: string) {
	return ``;
};

export async function callOpenAI(systemPrompt: string, html: string) {
	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: getUserPrompt(article) },
		],
		max_tokens: 800,
		temperature: 0.2,
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
	return content;
	console.log(`Received OpenAI response, parsing JSON...`);
}
