import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import prompt from './prompt';

const vehicleInfo = `Make CHEVROLET Model SILVERADO Year 2020 Trim — Body Style Crew Cab Pickup Vehicle Type Automobile Color Blue`;

const imagePath = path.resolve(__dirname, '../../../public/lot-images/copart/95914435/img-005.jpg');
const imageBuffer = fs.readFileSync(imagePath);
const imageFile = await OpenAI.toFile(imageBuffer, 'img-005.png', { type: 'image/jpeg' });

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_REPAIR_KEY,
});

const response = await openai.images.edit({
	model: 'gpt-image-1',
	image: imageFile,
	prompt: prompt(vehicleInfo),
	size: 'auto',
	quality: 'low',
});

const imageBase64 = response.data?.[0]?.b64_json;
if (imageBase64) {
	fs.writeFileSync('repaired-silverado.png', Buffer.from(imageBase64, 'base64'));
} else {
	console.log(response);
}
