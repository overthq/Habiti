import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'Habiti Dashboard',
	slug: 'habiti-dashboard',
	scheme: 'habiti-dashboard',
	owner: 'overthq',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.png',
	updates: {
		url: 'https://u.expo.dev/dc06d296-cd6f-4950-85d3-1483d3a394df',
		fallbackToCacheTimeout: 0
	},
	runtimeVersion: {
		policy: 'appVersion'
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
		bundleIdentifier: 'app.habiti.dashboard',
		config: {
			usesNonExemptEncryption: false
		}
	},
	android: {
		package: 'app.habiti.dashboard',
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#000000'
		},
		softwareKeyboardLayoutMode: 'pan'
	},
	web: {
		favicon: './assets/favicon.png'
	},
	extra: {
		eas: {
			projectId: 'dc06d296-cd6f-4950-85d3-1483d3a394df'
		}
	},
	plugins: [
		'expo-notifications',
		[
			'@sentry/react-native',
			{
				url: 'https://sentry.io/',
				note: 'Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.',
				project: 'habiti-dashboard',
				organization: 'habiti'
			}
		],
		'expo-secure-store',
		[
			'expo-splash-screen',
			{
				backgroundColor: '#FFFFFF',
				image: './assets/habiti-logo-black.png',
				dark: {
					image: './assets/habiti-logo-white.png',
					backgroundColor: '#000000'
				},
				imageWidth: 200
			}
		],
		'expo-image',
		[
			// Basically the Bluesky social-app setup (except ttf)
			'expo-font',
			{
				fonts: [
					'./assets/fonts/inter/InterVariable.ttf',
					'./assets/fonts/inter/InterVariable-Italic.ttf',
					// Android only
					'./assets/fonts/inter/Inter-Regular.otf',
					'./assets/fonts/inter/Inter-Italic.otf',
					'./assets/fonts/inter/Inter-Medium.otf',
					'./assets/fonts/inter/Inter-MediumItalic.otf',
					'./assets/fonts/inter/Inter-SemiBold.otf',
					'./assets/fonts/inter/Inter-SemiBoldItalic.otf',
					'./assets/fonts/inter/Inter-Bold.otf',
					'./assets/fonts/inter/Inter-BoldItalic.otf'
				]
			}
		]
	]
});
