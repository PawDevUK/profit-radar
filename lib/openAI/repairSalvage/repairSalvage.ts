import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI();
import prompt from './prompt';

const response = await openai.responses.create({
	model: 'gpt-4.1',
	input: [
		{
			role: 'user',
			content: [],
		},
	],
	tools: [{ type: 'image_generation' }],
});

const imageData = response.output.filter((output) => output.type === 'image_generation_call').map((output) => output.result);

if (imageData.length > 0) {
	const imageBase64 = imageData[0];
	const fs = await import('fs');
	fs.writeFileSync('gift-basket.png', Buffer.from(imageBase64, 'base64'));
} else {
	console.log(response.output.content);
}
function encodeImage(arg0: string) {
	throw new Error('Function not implemented.');
}

function createFile(arg0: string) {
	throw new Error('Function not implemented.');
}
