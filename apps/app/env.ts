import Constants from 'expo-constants';

const localhostString = (port: string) =>
	`http://${Constants.manifest?.extra?.expoGo?.debuggerHost
		?.split(':')
		.shift()
		?.concat(`:${port}`)}`;

const ENV = {
	dev: {
		apiUrl: localhostString('4000')
	},
	staging: {
		apiUrl: ''
	},
	prod: {
		apiUrl: ''
	}
};

const getEnvVars = (env?: keyof typeof ENV) =>
	env ? ENV[env] : ENV.dev || ENV.staging;

export default getEnvVars(
	Constants.manifest?.releaseChannel as keyof typeof ENV | undefined
);
