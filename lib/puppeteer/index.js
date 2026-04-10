import puppeteer from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import results from './results.json' with {type: 'json'};

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

const imagesElements = ['img', 'zoomImgElement p-image-item-box img-responsive ng-star-inserted', 'src']
const elementsToScrape = ['lot-details-information-label', 'lot-details-information-value'];

(async function launch(options) {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(pageUrl, pageOptions);
    console.log('Launching page:', pageUrl);
    await page.content();
    await page.waitForSelector('.img-responsive.p-galleria-img-thumbnail');
    const imageUrls = await page.$$eval(
        '.img-responsive.p-galleria-img-thumbnail',
        (images) => images.map((img) => img.getAttribute('src') || '').filter(Boolean)
    );
    console.log('List of images links', imageUrls);
    const lotDetails = await page.evaluate(() => {
        let lotListing = {};

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

        return lotListing;
    });

    console.log('Created new lot object', lotDetails);
    fs.writeFileSync('results.json', JSON.stringify({ ...lotDetails, images: [...convertLotImgURL(imageUrls)] }, null, 2));
    await browser.close();
    console.log('----Scrapper closed!----');
})(options);    