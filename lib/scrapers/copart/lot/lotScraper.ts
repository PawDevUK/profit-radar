import puppeteer from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import response from './AI_HTML_extract/response.json' with {type: 'json'};

import fs from 'fs';
// import { lotDetails as lotDetailsTypes } from '@/lib/types/lotDetails-type.ts';
const pageUrl = 'https://www.copart.com/lot/99763515/salvage-2017-subaru-wrx-dc-washington-dc';
const options = {
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
};
const pageOptions = {
    waitUntil: 'networkidle0',
    timeout: 0
};

(async function launch(options) {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(pageUrl, pageOptions);
    console.log('Launching page:', pageUrl);
    await page.content();
    await page.waitForSelector('.img-responsive.p-galleria-img-thumbnail');

    const Title = await page.$eval(response.fields.title.selector, el => el.innerText);
    const Year = await page.$eval(response.fields.year.selector, el => el.innerText);

    // extract image URLs
    const imageUrls = await page.$$eval(
        '.img-responsive.p-galleria-img-thumbnail',
        (images) => images.map((img) => img.getAttribute('src') || '').filter(Boolean)
    );
    if (imageUrls.length > 0) {
        console.log('Image URLs extracted successfully');
    }
    // extract lot title
    const title = await page.$eval('.ldp-header-title', el => {
        return { Title: el.innerText }
    });
    const vin = await page.$eval('.ng-star-inserted', el => {
        return { VIN: el.innerText }
    });

    const lotDetails = await page.evaluate(() => {
        let lotListing = {};

        // Extract lot details by matching labels and values
        Array.from(document.getElementsByClassName('lot-details-information-label')).map(el => {
            lotListing = {
                ...lotListing, [el.innerText]: ''
            }
        });

        Array.from(document.getElementsByClassName('lot-details-information-value')).map((el, i) => {
            const prevEl = el.previousElementSibling;
            lotListing = {
                ...lotListing, [prevEl ? prevEl.innerText : i]: el.innerText
            }
        });

        return {
            ...lotListing
        };
    });

    if (lotDetails) {
        console.log('Created new lot object');
    } else { console.log('Failed to create lot object!!!') }

    fs.writeFileSync('results.json', JSON.stringify({ ...lotDetails, Title, Year, images: [...convertLotImgURL(imageUrls)], ...title, ...vin }, null, 2));
    await browser.close();
    console.log('----Scrapper closed!----');
})(options);