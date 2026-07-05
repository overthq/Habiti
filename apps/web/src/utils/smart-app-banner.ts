// iOS Smart App Banner

const APP_STORE_ID = import.meta.env?.VITE_IOS_APP_STORE_ID;

const SITE_ORIGIN =
	import.meta.env?.VITE_APP_BANNER_ORIGIN ?? 'https://habiti.app';

export const smartAppBannerMeta = (path: string) => {
	if (!APP_STORE_ID) return null;

	return {
		name: 'apple-itunes-app',
		content: `app-id=${APP_STORE_ID}, app-argument=${SITE_ORIGIN}${path}`
	};
};
