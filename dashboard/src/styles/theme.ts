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
		xsmall: 12,
		small: 14,
		regular: 16,
		large: 18,
		xlarge: 20
	},
	weight: {
		regular: 'normal',
		medium: '500',
		bold: 'bold'
	},
	family: {
		regular: {},
		medium: {}
	}
} as const;

const palette = {
	neutral: {
		n1: '#FFFFFF',
		n5: '#EDEDED',
		n10: '#D3D3D3',
		n50: '#505050',
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
		secondary: palette.neutral.n10,
		tertiary: '',
		disabled: '',
		error: '',
		label: palette.neutral.n10
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
	input: {
		placeholder: '',
		label: palette.neutral.n10,
		background: palette.neutral.n50,
		text: palette.neutral.n1
	},
	icon: {
		default: { color: palette.neutral.n1 }
	},
	border: {
		color: palette.neutral.n50
	},
	image: {
		placeholder: palette.neutral.n50
	}
} as const;

const light = {
	text: {
		primary: palette.neutral.n100,
		secondary: palette.neutral.n10,
		tertiary: '',
		disabled: '',
		error: '',
		label: palette.neutral.n50
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
	input: {
		placeholder: '',
		label: palette.neutral.n50,
		background: palette.neutral.n5,
		text: palette.neutral.n50
	},
	icon: {
		default: { color: palette.neutral.n100 }
	},
	border: {
		color: palette.neutral.n5
	},
	image: {
		placeholder: palette.neutral.n10
	}
} as const;

export type ThemeObject = typeof light;

export const themes = { light, dark };
