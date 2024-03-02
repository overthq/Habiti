export enum ThemeMap {
	light = 'Light',
	dark = 'Dark',
	auto = 'Auto'
}

export const spacing = {
	small: 4,
	regular: 8,
	medium: 16,
	large: 24,
	xlarge: 32
};

export const typography = {
	size: {
		xsmall: 12,
		small: 14,
		regular: 16,
		large: 18,
		xlarge: 20,
		xxlarge: 24,
		xxxlarge: 32
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
		n90: '#1C1C1C',
		n100: '#000000'
	},
	red: {
		r1: ''
	},
	yellow: {
		y1: ''
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
			background: palette.neutral.n50,
			text: palette.neutral.n10
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
		background: palette.neutral.n90,
		text: palette.neutral.n1
	},
	icon: {
		default: { color: palette.neutral.n1 }
	},
	border: {
		color: palette.neutral.n90
	},
	image: {
		placeholder: palette.neutral.n50
	},
	badge: {
		success: {
			backgroundColor: '#B8EDAD',
			color: '#1A6E2B'
		},
		danger: {
			backgroundColor: '#EDB7AD',
			color: '#6E2B1A'
		},
		warning: {
			backgroundColor: '#ECEDAD',
			color: '#696E1A'
		},
		neutral: {
			backgroundColor: '#505050',
			color: '#D3D3D3'
		}
	}
} as const;

const light = {
	text: {
		primary: palette.neutral.n100,
		secondary: palette.neutral.n50,
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
			background: palette.neutral.n50,
			text: palette.neutral.n10
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
		text: palette.neutral.n100
	},
	icon: {
		default: { color: palette.neutral.n100 }
	},
	border: {
		color: palette.neutral.n5
	},
	image: {
		placeholder: palette.neutral.n10
	},
	badge: {
		success: {
			backgroundColor: '#B8EDAD',
			color: '#1A6E2B'
		},
		danger: {
			backgroundColor: '#EDB7AD',
			color: '#6E2B1A'
		},
		warning: {
			backgroundColor: '#ECEDAD',
			color: '#696E1A'
		},
		neutral: {
			backgroundColor: '#505050',
			color: '#D3D3D3'
		}
	}
} as const;

export type ThemeObject = typeof light;

export const themes = { light, dark };
