import Constants from 'expo-constants';

const ENV = {
	dev: {
		authUrl: `http://${Constants.manifest.debuggerHost
			?.split(':')
			.shift()
			?.concat(':5000')}`,
		hasuraUrl: `http://${Constants.manifest.debuggerHost
			?.split(':')
			.shift()
			?.concat(':8080/v1/graphql')}`
	},
	staging: {
		authUrl: 'https://',
		hasuraUrl: 'https://'
	},
	prod: {
		authUrl: 'https://',
		hasuraUrl: 'https://'
	}
};

const getEnvVars = (env?: keyof typeof ENV) =>
	env ? ENV[env] : ENV.dev || ENV.staging;

export default getEnvVars(
	Constants.manifest.releaseChannel as keyof typeof ENV | undefined
);
