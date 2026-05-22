// iOS Smart App Banner ("Open in Habiti app").
// Shown by Safari on iOS only — there is no Android/Chrome equivalent.
// Docs: https://developer.apple.com/documentation/webkit/promoting-apps-with-smart-app-banners

// TODO: replace with the consumer app's real numeric App Store ID once published.
export const APP_STORE_ID = '000000000';

const SITE_ORIGIN = 'https://habiti.app';

/**
 * Builds the `apple-itunes-app` meta tag content for a Smart App Banner.
 *
 * `path` becomes the `app-argument` deep link handed to the app when opened.
 * The iOS app declares `applinks:habiti.app`, so the universal link resolves
 * to the matching in-app screen.
 */
export const smartAppBannerMeta = (path: string) => ({
	name: 'apple-itunes-app',
	content: `app-id=${APP_STORE_ID}, app-argument=${SITE_ORIGIN}${path}`
});
