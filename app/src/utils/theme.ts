import { PreferencesSlice } from '../state/types';

export enum ThemeMap {
	light = 'Light',
	dark = 'Dark',
	auto = 'Auto'
}

export const getStatusBarStyle = (theme: PreferencesSlice['theme']) => {
	return { light: 'dark', dark: 'light', auto: 'light' }[theme];
};

export const spacing = {
	small: 4,
	regular: 8,
	medium: 16,
	large: 24
};

export const typography = {
	size: {
		small: 12,
		regular: 14,
		medium: 16,
		large: 18
	},
	weight: {
		regular: {},
		medium: {}
	},
	family: {
		regular: {},
		medium: {}
	}
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
