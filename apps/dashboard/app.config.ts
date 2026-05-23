import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
	if (IS_DEV) {
		return 'app.habiti.dashboard.dev';
	}

	if (IS_PREVIEW) {
		return 'app.habiti.dashboard.preview';
	}

	return 'app.habiti.dashboard';
};

const getAppName = () => {
	if (IS_DEV) {
		return 'Habiti Dashboard (Dev)';
	}

	if (IS_PREVIEW) {
		return 'Habiti Dashboard (Preview)';
	}

	return 'Habiti Dashboard';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: getAppName(),
	slug: 'habiti-dashboard',
	scheme: 'habiti-dashboard',
	owner: 'overthq',
	version: '1.0.1',
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
		...config.ios,
		supportsTablet: true,
		bundleIdentifier: getUniqueIdentifier(),
		config: {
			usesNonExemptEncryption: false
		}
	},
	android: {
		...config.android,
		package: getUniqueIdentifier(),
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
