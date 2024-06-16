// TODO: Spend a significant amount of time building out novel designs
// based on a green accent color.

export const spacing = {
	small: 4,
	regular: 8,
	medium: 16,
	large: 24,
	xlarge: 32
};

// https://matthewstrom.com/writing/generating-color-palettes/
// Potential: https://bottosson.github.io/posts/colorpicker/

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
		r10: '#F9D1D6',
		r20: '#F1B5B7',
		r30: '#F7838C',
		r40: '#FA405E',
		r50: '#DD0042',
		r60: '#AE0F33',
		r70: '#7E1A28',
		r80: '#4E1B1E',
		r90: '#221111'
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
		g60: '#227021',
		g70: '#255125',
		g80: '#1C351C',
		g90: '#101910'
	}
};

const dark = {
	text: {
		primary: palette.neutral.n1,
		secondary: palette.neutral.n20,
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
			background: palette.neutral.n70,
			text: palette.neutral.n20
		},
		destructive: {
			background: palette.red.r20,
			text: palette.red.r80
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
		color: palette.neutral.n80
	},
	image: {
		placeholder: palette.neutral.n90
	},
	badge: {
		success: {
			backgroundColor: palette.green.g10,
			color: palette.green.g70
		},
		danger: {
			backgroundColor: palette.red.r10,
			color: palette.red.r70
		},
		warning: {
			backgroundColor: palette.yellow.y10,
			color: palette.yellow.y70
		},
		neutral: {
			backgroundColor: palette.neutral.n10,
			color: palette.neutral.n70
		}
	},
	navigation: {
		// Default theme from react-navigation
		colors: {
			background: 'rgb(1, 1, 1)',
			border: 'rgb(39, 39, 41)',
			card: 'rgb(18, 18, 18)',
			notification: 'rgb(255, 69, 58)',
			primary: 'rgb(10, 132, 255)',
			text: 'rgb(229, 229, 231)'
		},
		dark: true
	},
	statusBar: 'light'
} as const;

const light = {
	text: {
		primary: palette.neutral.n100,
		secondary: palette.neutral.n50,
		tertiary: palette.neutral.n10,
		disabled: palette.neutral.n50,
		error: palette.red.r50,
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
			background: palette.neutral.n20,
			text: palette.neutral.n70
		},
		destructive: {
			background: palette.red.r10,
			text: palette.red.r60
		}
	},
	screen: {
		background: palette.neutral.n1
	},
	input: {
		placeholder: palette.neutral.n40,
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
			backgroundColor: palette.green.g10,
			color: palette.green.g70
		},
		danger: {
			backgroundColor: palette.red.r10,
			color: palette.red.r70
		},
		warning: {
			backgroundColor: palette.yellow.y10,
			color: palette.yellow.y70
		},
		neutral: {
			backgroundColor: palette.neutral.n10,
			color: palette.neutral.n70
		}
	},
	navigation: {
		// Default theme from react-navigation
		colors: {
			background: 'rgb(242, 242, 242)',
			border: 'rgb(216, 216, 216)',
			card: 'rgb(255, 255, 255)',
			notification: 'rgb(255, 59, 48)',
			primary: 'rgb(0, 122, 255)',
			text: 'rgb(28, 28, 30)'
		},
		dark: false
	},
	statusBar: 'dark'
} as const;

export type ThemeObject = typeof light;

export const themes = { light, dark };
