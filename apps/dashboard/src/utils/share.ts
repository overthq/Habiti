import { Linking, Platform, Share } from 'react-native';
import env from '../../env';

export const getFrontendUrl = (route: string) => {
	return `${env.webFrontendUrl}${route.startsWith('/') ? route : `/${route}`}`;
};

export const viewProductInBrowser = async (productId: string) => {
	Linking.openURL(getFrontendUrl(`/product/${productId}`));
};

export const shareProduct = async (productId: string, productName: string) => {
	const url = getFrontendUrl(`/product/${productId}`);

	// On iOS, passing both `message` and `url` causes the link to appear twice.
	// iOS handles `url` separately, while Android only includes the `message`,
	// so the URL must be embedded in the message there.
	await Share.share(
		Platform.OS === 'ios'
			? {
					title: productName,
					message: `Check out ${productName} on Habiti`,
					url
				}
			: {
					title: productName,
					message: `Check out ${productName} on Habiti: ${url}`
				}
	);
};
