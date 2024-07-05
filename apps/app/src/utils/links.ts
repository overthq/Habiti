import { Linking } from 'react-native';

export const openLink = async (link?: string | null) => {
	if (link) {
		const supported = await Linking.canOpenURL(link);
		if (supported) await Linking.openURL(link);
	}
};

export type LinkType = 'twitter' | 'instagram';

export const getLink = (type: LinkType, value: string) => {
	switch (type) {
		case 'twitter':
			return `https://twitter.com/${value}`;
		case 'instagram':
			return `https://instagram.com/${value}`;
	}
};

export const config = {
	screens: {
		Home: '',
		Product: ''
	}
};
