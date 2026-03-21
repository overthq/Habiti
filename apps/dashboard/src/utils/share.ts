import { Linking, Share } from 'react-native';
import env from '../../env';

export const getFrontendUrl = (route: string) => {
	return `${env.webFrontendUrl}${route.startsWith('/') ? route : `/${route}`}`;
};

export const viewProductInBrowser = async (productId: string) => {
	Linking.openURL(getFrontendUrl(`/product/${productId}`));
};

export const shareProduct = async (productId: string, productName: string) => {
	const url = getFrontendUrl(`/product/${productId}`);

	await Share.share({
		title: productName,
		url
	});
};
