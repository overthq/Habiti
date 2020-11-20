import Constants from 'expo-constants';

const ENV = {
	dev: {
		authUrl: `http://${Constants.manifest.debuggerHost
			?.split(':')
			.shift()
			?.concat(':5000/v1/graphql')}`,
		hasuraUrl: 'http://localhost:8080'
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
	env ? ENV[env] : ENV.staging || ENV.dev;

export default getEnvVars(
	Constants.manifest.releaseChannel as keyof typeof ENV | undefined
);
