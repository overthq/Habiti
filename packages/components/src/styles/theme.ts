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

const palette = {
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
		y1: ''
	},
	green: {
		g1: ''
	}
};

const dark = {
	text: {
		primary: palette.neutral.n1,
		secondary: palette.neutral.n40,
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
	}
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
	}
} as const;

export type ThemeObject = typeof light;

export const themes = { light, dark };
