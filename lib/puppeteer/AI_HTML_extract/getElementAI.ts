import callOpenAI from '../../openAI/callOpenAI.js';
import prompt from './prompt.js';
// import stripHTML, { splitHtmlInTwo } from './stripHTML.js';
import { readFile } from 'node:fs/promises';
import parseAndSaveResponse from './parser.js';

const log = function (txt: string) {
	return console.log(`${txt}`);
};

export default async function getElementAI() {
	log(`Starting`);
	const inputPath = new URL('./striped.html', import.meta.url);
	const htmlSnippet = await readFile(inputPath, 'utf-8');

	log('Fetched, stripped html file and loading into prompt.');
	const fullPrompt = prompt(htmlSnippet);
	log(`Loaded full prompt and sending it to OpenAI!`);
	const openAIResponse = await callOpenAI(fullPrompt);
	log('Request success!!!');
	log('Parsing and saving!!!');
	await parseAndSaveResponse(openAIResponse);
	log('Saved on Finished!!!');
	return;
}
await getElementAI();
