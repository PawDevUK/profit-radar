import { xai } from '@ai-sdk/xai';
import { generateImage } from 'ai';
import fs from 'fs';

// Load image and encode as base64
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import prompt from '../../openAI/repairSalvage/prompt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

if (!process.env.XAI_API_KEY) {
	throw new Error('Missing XAI_API_KEY in project .env file');
}

const vehicleInfo = '';

const copartImageUrl = 'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1225/8e326c7f6f5b42a0b7b9aa6a59a3263e_hrs.jpg';

// const outputImagePath = path.resolve(__dirname, './repaired-silverado-grok.png');

export default async function callXAiRepairSalvage(imageUrl: string) {
	const { images } = await generateImage({
		model: xai.image('grok-imagine-image'),
		prompt: {
			text: prompt(vehicleInfo),
			images: [imageUrl], // Pass URL directly instead of buffer
		},
		aspectRatio: '4:3',
		providerOptions: {
			xai: {
				quality: 'low',
			},
		},
	});

	const resultImage = images[0];

	if (!resultImage?.uint8Array) {
		throw new Error('xAI did not return an edited image');
	}
}
