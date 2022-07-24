import Constants from 'expo-constants';

const localHostString = (extension: string) =>
	`http://${Constants.manifest?.debuggerHost
		?.split(':')
		.shift()
		?.concat(`:${extension}`)}`;

const ENV = {
	dev: {
		apiUrl: localHostString('4000')
	},
	staging: {
		apiUrl: 'https://'
	},
	prod: {
		apiUrl: 'https://'
	}
};

const getEnvVars = (env?: keyof typeof ENV) =>
	env ? ENV[env] : ENV.dev || ENV.staging;

export default getEnvVars(
	Constants.manifest?.releaseChannel as keyof typeof ENV | undefined
);
