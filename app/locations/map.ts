const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

const SCRIPT_ID = 'google-maps-script';
let googleMapsPromise: Promise<void> | null = null;

export const loadMap = async () => {
	if (!GOOGLE_MAP_KEY) {
		throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAP_KEY');
	}

	if (typeof window === 'undefined') return;
	if (window.google?.maps) return;
	if (googleMapsPromise) return googleMapsPromise;

	googleMapsPromise = new Promise<void>((resolve, reject) => {
		const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

		if (existingScript) {
			existingScript.addEventListener('load', () => resolve(), { once: true });
			existingScript.addEventListener(
				'error',
				() => {
					googleMapsPromise = null;
					reject(new Error('Failed to load Google Maps script'));
				},
				{ once: true },
			);
			return;
		}

		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=maps`;
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = () => {
			googleMapsPromise = null;
			reject(new Error('Failed to load Google Maps script'));
		};

		document.head.appendChild(script);
	});

	return googleMapsPromise;
};
