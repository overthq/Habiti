import { Linking } from 'react-native';

export const openLink = async (link?: string | null) => {
	if (link) {
		const supported = await Linking.canOpenURL(link);
		if (supported) await Linking.openURL(link);
	}
};
