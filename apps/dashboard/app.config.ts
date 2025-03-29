import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'Habiti Dashboard',
	slug: 'habiti-dashboard',
	owner: 'overthq',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.png',
	newArchEnabled: true,
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff'
	},
	updates: {
		fallbackToCacheTimeout: 0
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
		softwareKeyboardLayoutMode: 'pan',
		// FIXME: We should not need this in SDK 52, but maybe we can remove it after one build works.
		blockedPermissions: [
			'android.permission.READ_MEDIA_IMAGES',
			'android.permission.READ_MEDIA_VIDEO'
		]
	},
	web: {
		favicon: './assets/favicon.png'
	},
	extra: {
		eas: {
			projectId: 'dc06d296-cd6f-4950-85d3-1483d3a394df'
		}
	}
});
