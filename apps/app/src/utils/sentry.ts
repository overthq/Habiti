import * as Sentry from '@sentry/react-native';

export const navigationIntegration = Sentry.reactNavigationIntegration({
	enableTimeToInitialDisplay: true
});

Sentry.init({
	dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
	integrations: [navigationIntegration]
});
