const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

const SCRIPT_ID = 'google-maps-script';
let googleMapsPromise: Promise<{ status: number; ok: boolean }> | null = null;

export const loadMap = async (): Promise<{ status: number; ok: boolean }> => {
	if (!GOOGLE_MAP_KEY) {
		return { status: 500, ok: false };
	}

	if (typeof window === 'undefined') {
		return { status: 500, ok: false };
	}

	if (window.google?.maps) {
		return { status: 200, ok: true };
	}

	if (googleMapsPromise) return googleMapsPromise;

	googleMapsPromise = new Promise<{ status: number; ok: boolean }>((resolve) => {
		const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

		if (existingScript) {
			existingScript.addEventListener('load', () => resolve({ status: window.google?.maps ? 200 : 500, ok: !!window.google?.maps }), { once: true });
			existingScript.addEventListener(
				'error',
				() => {
					googleMapsPromise = null;
					resolve({ status: 500, ok: false });
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
		script.onload = () => resolve({ status: window.google?.maps ? 200 : 500, ok: !!window.google?.maps });
		script.onerror = () => {
			googleMapsPromise = null;
			resolve({ status: 500, ok: false });
		};

		document.head.appendChild(script);
	});

	return googleMapsPromise;
};
