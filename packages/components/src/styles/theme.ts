// TODO: Spend a significant amount of time building out novel designs
// based on a green accent color.

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

// https://matthewstrom.com/writing/generating-color-palettes/

export const palette = {
	neutral: {
		n1: '#FFFFFF',
		n10: '#E0E3E6',
		n20: '#BFC8D1',
		n30: '#9FADBD',
		n40: '#8193A6',
		n50: '#67798C',
		n60: '#506070',
		n70: '#3C4752',
		n80: '#292F35',
		n90: '#141619',
		n100: '#000000'
	},
	red: {
		r1: ''
	},
	yellow: {
		y10: '#F7E9A3',
		y20: '#EBBE83',
		y30: '#E09C34',
		y40: '#C3810A',
		y50: '#A26900',
		y60: '#815304',
		y70: '#5F3E0B',
		y80: '#3E290F',
		y90: '#1D150B'
	},
	green: {
		g10: '#D8E8D4',
		g20: '#9ADB90',
		g30: '#67C55B',
		g40: '#39AC30',
		g50: '#009100',
		g60: '#AE0F33',
		g70: '#7E1A28',
		g80: '#4E1B1E',
		g90: '#221111'
	}
};

const dark = {
	text: {
		primary: palette.neutral.n1,
		secondary: palette.neutral.n30,
		tertiary: palette.neutral.n50,
		disabled: palette.neutral.n10,
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
		},
		disabled: {
			background: '',
			text: ''
		}
	},
	screen: {
		background: palette.neutral.n100
	},
	input: {
		placeholder: palette.neutral.n30,
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
		placeholder: palette.neutral.n90
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
	},
	navigation: {}
} as const;

const light = {
	text: {
		primary: palette.neutral.n100,
		secondary: palette.neutral.n50,
		tertiary: palette.neutral.n10,
		disabled: palette.neutral.n50,
		error: '',
		label: palette.neutral.n60
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
		},
		disabled: {
			background: '',
			text: ''
		}
	},
	screen: {
		background: palette.neutral.n1
	},
	input: {
		placeholder: palette.neutral.n30,
		label: palette.neutral.n60,
		background: palette.neutral.n10,
		text: palette.neutral.n100
	},
	icon: {
		default: { color: palette.neutral.n100 }
	},
	border: {
		color: palette.neutral.n10
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
	},
	navigation: {}
} as const;

export type ThemeObject = typeof light;

export const themes = { light, dark };
