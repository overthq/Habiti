import Constants from 'expo-constants';

const localhostString = (port: string) =>
	`http://${Constants.manifest?.debuggerHost
		?.split(':')
		.shift()
		?.concat(`:${port}`)}`;

const ENV = {
	dev: {
		apiUrl: localhostString('4000')
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
