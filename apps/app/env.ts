import Constants from 'expo-constants';

const localhostString = (port: string) =>
	`http://${Constants.expoGoConfig?.debuggerHost
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

export default getEnvVars('dev');
