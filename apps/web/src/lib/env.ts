const env = {
	apiUrl: import.meta.env?.VITE_API_URL || 'http://localhost:4000',
	iosAppStoreId: import.meta.env?.VITE_IOS_APP_STORE_ID as string | undefined,
	appBannerOrigin:
		(import.meta.env?.VITE_APP_BANNER_ORIGIN as string | undefined) ??
		'https://habiti.app',
	appleClientId: import.meta.env?.VITE_APPLE_CLIENT_ID as string | undefined,
	appleRedirectUri: import.meta.env?.VITE_APPLE_REDIRECT_URI as
		| string
		| undefined
};

export default env;
