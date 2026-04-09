export default function convertLotImgURL(images) {

    function parseImgUrls(imgUrl) {
        return imgUrl.replace(/_thb(\.[a-z0-9]+)$/i, '_ful$1');

    }
    console.log('Starting parser...');
    if (!images || !Array.isArray(images)) {
        console.error('No images found');
        return [];
    }
    console.log('Converting URLs...');
    return images.map(parseImgUrls).filter((url) => !url.includes('vthb'));
}
