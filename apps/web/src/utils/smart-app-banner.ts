// iOS Smart App Banner

import env from '@/lib/env';

export const smartAppBannerMeta = (path: string) => {
	if (!env.iosAppStoreId) return null;

	return {
		name: 'apple-itunes-app',
		content: `app-id=${env.iosAppStoreId}, app-argument=${env.appBannerOrigin}${path}`
	};
};
