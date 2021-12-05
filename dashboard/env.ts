import Constants from 'expo-constants';

const localHostString = (extension: string) =>
	`http://${Constants.manifest?.debuggerHost
		?.split(':')
		.shift()
		?.concat(`:${extension}`)}`;

const ENV = {
	dev: {
		authUrl: localHostString('5000'),
		hasuraUrl: localHostString('8080/v1/graphql'),
		storageUrl: localHostString('5100')
	},
	staging: {
		authUrl: 'https://',
		hasuraUrl: 'https://',
		storageUrl: 'https://'
	},
	prod: {
		authUrl: 'https://',
		hasuraUrl: 'https://',
		storageUrl: 'https://'
	}
};

const getEnvVars = (env?: keyof typeof ENV) =>
	env ? ENV[env] : ENV.dev || ENV.staging;

export default getEnvVars(
	Constants.manifest?.releaseChannel as keyof typeof ENV | undefined
);
