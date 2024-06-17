import Constants from 'expo-constants';

const localhostString = (port: string) =>
	`http://${Constants.expoGoConfig?.debuggerHost
		?.split(':')
		.shift()
		?.concat(`:${port}`)}`;

const env = {
	apiUrl: process.env.API_URL || localhostString('4000')
};

export default env;
