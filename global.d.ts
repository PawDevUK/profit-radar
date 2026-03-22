/// <reference types="google.maps" />

declare module '*.css' {
	const content: { [className: string]: string };
	export default content;
}

interface Window {
	google: typeof google;
}
