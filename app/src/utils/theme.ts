import { StatusBarStyle } from 'expo-status-bar';
import { PreferencesSlice } from '../state/types';

export const ThemeMap: Record<PreferencesSlice['theme'], string> = {
	light: 'Light',
	dark: 'Dark',
	auto: 'Auto'
};

export const getStatusBarStyle = (theme: PreferencesSlice['theme']) => {
	return (
		{ light: 'dark', dark: 'light' } as Record<
			PreferencesSlice['theme'],
			StatusBarStyle
		>
	)[theme];
};

const palette = {
	neutral: {
		n1: '#FFFFFF',
		n100: '#000000'
	},
	green: {
		g1: ''
	}
};

export const dark = {
	text: {
		primary: palette.neutral.n1,
		secondary: '',
		tertiary: ''
	},
	button: {}
};

export const light = {
	text: {
		primary: palette.neutral.n100,
		secondary: '',
		tertiary: ''
	},
	button: {}
};
