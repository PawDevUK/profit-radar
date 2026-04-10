import fs from 'fs';
import callOpenAI from '../../openai/callOpenAI.js';



export default async function getElementAI(elementsToScrape) {
    const html = await fs.readFile('./body-snapshot.html', 'utf-8');

}


