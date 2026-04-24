export default function convertLotImgURL(images) {

    function parseImgUrls(imgUrl) {
        return imgUrl.replace(/_thb(\.[a-z0-9]+)$/i, '_ful$1');

    }
    console.log('Starting parser...');
    if (!images || !Array.isArray(images.copart)) {
        console.error('No images found');
        return null;
    }
    console.log('Converting URLs...');
    return images.copart.map(parseImgUrls).filter((url) => !url.includes('vthb'));
}
