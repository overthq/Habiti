import Constants from 'expo-constants';

const ENV = {
	dev: {
		authUrl: 'http://localhost:5000',
		hasuraUrl: 'http://localhost:8080'
	},
	staging: {
		authUrl: '',
		hasuraUrl: ''
	},
	prod: {
		authUrl: '',
		hasuraUrl: ''
	}
};

const getEnvVars = (env?: keyof typeof ENV) =>
	env ? ENV[env] : ENV.staging || ENV.dev;

export default getEnvVars(
	Constants.manifest.releaseChannel as keyof typeof ENV | undefined
);
