import type { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'Habiti',
	slug: 'habiti',
	owner: 'overthq',
	version: '1.0.0',
	scheme: 'habiti',
	orientation: 'portrait',
	icon: './assets/icon.png',
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
		bundleIdentifier: 'app.habiti.app',
		associatedDomains: ['applinks:habiti.app']
	},
	android: {
		package: 'app.habiti.app',
		googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#FFFFFF'
		},
		intentFilters: [
			{
				action: 'VIEW',
				autoVerify: true,
				data: [
					{
						scheme: 'https',
						host: 'habiti.app',
						pathPrefix: '/store'
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
	}
});
