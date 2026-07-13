import type { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
	if (IS_DEV) {
		return 'app.habiti.app.dev';
	}

	if (IS_PREVIEW) {
		return 'app.habiti.app.preview';
	}

	return 'app.habiti.app';
};

const getAppName = () => {
	if (IS_DEV) {
		return 'Habiti (Dev)';
	}

	if (IS_PREVIEW) {
		return 'Habiti (Preview)';
	}

	return 'Habiti';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: getAppName(),
	slug: 'habiti',
	owner: 'overthq',
	version: '1.0.0',
	scheme: 'habiti',
	orientation: 'portrait',
	icon: './assets/icon.png',
	updates: {
		url: 'https://u.expo.dev/f09782f6-8048-4ad4-8ff1-3fb7a65fbe48',
		fallbackToCacheTimeout: 0
	},
	runtimeVersion: {
		policy: 'appVersion'
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		...config.ios,
		supportsTablet: true,
		bundleIdentifier: getUniqueIdentifier(),
		associatedDomains: ['applinks:habiti.app'],
		usesAppleSignIn: true,
		config: {
			usesNonExemptEncryption: false
		}
	},
	android: {
		...config.android,
		package: getUniqueIdentifier(),
		googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#FFFFFF'
		},
		softwareKeyboardLayoutMode: 'pan',
		intentFilters: [
			{
				action: 'VIEW',
				autoVerify: true,
				data: [
					{
						scheme: 'https',
						host: 'habiti.app',
						pathPrefix: '/store'
					},
					{
						scheme: 'https',
						host: 'habiti.app',
						pathPrefix: '/product'
					}
				],
				category: ['BROWSABLE', 'DEFAULT']
			}
		]
	},
	web: {
		favicon: './assets/favicon.png'
	},
	extra: {
		eas: {
			projectId: 'f09782f6-8048-4ad4-8ff1-3fb7a65fbe48'
		}
	},
	plugins: [
		'expo-apple-authentication',
		'expo-notifications',
		[
			'@sentry/react-native',
			{
				url: 'https://sentry.io/',
				note: 'Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.',
				project: 'habiti-app',
				organization: 'habiti'
			}
		],
		'expo-secure-store',
		[
			'expo-splash-screen',
			{
				backgroundColor: '#000000',
				image: './assets/habiti-logo-white.png',
				dark: {
					image: './assets/habiti-logo-black.png',
					backgroundColor: '#FFFFFF'
				},
				imageWidth: 200
			}
		]
	]
});
