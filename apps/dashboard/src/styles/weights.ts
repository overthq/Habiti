// This was copied from a Gist. I can't find the link, because I only saved a screenshot.
// Maybe more info here: https://github.com/Mo0x/LifeTime

import { Platform, StyleSheet } from 'react-native';

export const weightStyles = StyleSheet.create({
	weight100:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-thin', fontWeight: '100' }
			: { fontWeight: '100' },
	weight200:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-light', fontWeight: '200' }
			: { fontWeight: '200' },
	weight300:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-light', fontWeight: '300' }
			: { fontWeight: '300' },
	weight400:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif', fontWeight: '400' }
			: { fontWeight: '400' },
	weight500:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-medium', fontWeight: '500' }
			: { fontWeight: '500' },
	weight600:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-medium', fontWeight: '600' }
			: { fontWeight: '600' },
	weight700:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-regular', fontWeight: '700' }
			: { fontWeight: '700' },
	weight800:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-bold', fontWeight: '700' }
			: { fontWeight: '800' },
	weight900:
		Platform.OS === 'android'
			? { fontFamily: 'sans-serif-black', fontWeight: '900' }
			: { fontWeight: '900' }
});
