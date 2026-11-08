import env from '../../env';

export const getFrontendUrl = (route: string) => {
	return `${env.webFrontendUrl}${route.startsWith('/') ? route : `/${route}`}`;
};
