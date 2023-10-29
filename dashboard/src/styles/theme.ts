import { PreferencesSlice } from '../state/types';

export enum ThemeMap {
	light = 'Light',
	dark = 'Dark',
	auto = 'Auto'
}

export const getStatusBarStyle = (theme: PreferencesSlice['theme']) => {
	return ({ light: 'dark', dark: 'light', auto: 'light' } as const)[theme];
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

// TODO: Move palette, typography, spacing to separate files
// Set up a file for individual theme items like buttons, text etc.

const dark = {
	text: {
		primary: palette.neutral.n1,
		secondary: '',
		tertiary: ''
	},
	button: {
		primary: {
			background: palette.neutral.n1,
			text: palette.neutral.n100
		},
		secondary: {
			background: '',
			text: ''
		},
		tertiary: {
			background: '',
			text: ''
		}
	},
	screen: {
		background: palette.neutral.n100
	},
	input: {}
} as const;

const light = {
	text: {
		primary: palette.neutral.n100,
		secondary: '',
		tertiary: ''
	},
	button: {
		primary: {
			background: palette.neutral.n100,
			text: palette.neutral.n1
		},
		secondary: {
			background: '',
			text: ''
		},
		tertiary: {
			background: '',
			text: ''
		}
	},
	screen: {
		background: palette.neutral.n1
	},
	input: {}
} as const;

export type ThemeObject = typeof light;

export const themes = { light, dark };
