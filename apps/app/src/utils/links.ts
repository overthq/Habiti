import { Linking } from 'react-native';
import env from '../../env';

export const getFrontendUrl = (route: string) => {
	return `${env.webFrontendUrl}${route.startsWith('/') ? route : `/${route}`}`;
};

export const openLink = async (link?: string | null) => {
	if (link) {
		const supported = await Linking.canOpenURL(link);
		if (supported) await Linking.openURL(link);
	}
};

export type LinkType = 'twitter' | 'instagram' | 'whatsapp';

export const getLink = (type: LinkType, value: string, message?: string) => {
	switch (type) {
		case 'twitter':
			return `https://twitter.com/${value}`;
		case 'instagram':
			return `https://instagram.com/${value}`;
		case 'whatsapp':
			return `https://wa.me/${value}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
	}
};

export const config = {
	screens: {
		Home: '',
		Product: ''
	}
};
