import { fonts } from './typography';

export const spacing = {
	small: 4,
	regular: 8,
	medium: 16,
	large: 24,
	xlarge: 32
};

// Maybe in the future:
// - https://matthewstrom.com/writing/generating-color-palettes/
// - Potential: https://bottosson.github.io/posts/colorpicker/
//
// For now, Tailwind CSS colors work well: https://ui.shadcn.com/colors

export const palette = {
	neutral: {
		n50: 'hsl(0 0% 98%)',
		n100: 'hsl(0 0% 96.1%)',
		n200: 'hsl( 0 0% 89.8%)',
		n300: 'hsl(0 0% 83.1%)',
		n400: 'hsl(0 0% 63.9%)',
		n500: 'hsl(0 0% 45.1%)',
		n600: 'hsl(0 0% 32.2%)',
		n700: 'hsl(0 0% 25.1%)',
		n800: 'hsl(0 0% 14.9%)',
		n900: 'hsl(0 0% 9%)',
		n950: 'hsl(0 0% 3.9%)'
	},
	red: {
		r50: 'hsl(0 85.7% 97.3%)',
		r100: 'hsl(0 93.3% 94.1%)',
		r200: 'hsl(0 96.3% 89.4%)',
		r300: 'hsl(0 93.5% 81.8%)',
		r400: 'hsl(0 90.6% 70.8%)',
		r500: 'hsl(0 84.2% 60.2%)',
		r600: 'hsl(0 72.2% 50.6%)',
		r700: 'hsl(0 73.7% 41.8%)',
		r800: 'hsl(0 70% 35.3%)',
		r900: 'hsl(0 62.8% 30.6%)',
		r950: 'hsl(0 74.7% 15.5%)'
	},
	yellow: {
		y50: 'hsl(54.5 91.7% 95.3%)',
		y100: 'hsl(54.9 96.7% 88%)',
		y200: 'hsl(52.8 98.3% 76.9%)',
		y300: 'hsl(50.4 97.8% 63.5%)',
		y400: 'hsl(47.9 95.8% 53.1%)',
		y500: 'hsl(45.4 93.4% 47.5%)',
		y600: 'hsl(40.6 96.1% 40.4%)',
		y700: 'hsl(35.5 91.7% 32.9%)',
		y800: 'hsl(28.4 72.5% 25.7%)',
		y900: 'hsl(26 83.3% 14.1%)',
		y950: 'hsl(26 83.3% 14.1%)'
	},
	green: {
		g50: 'hsl(138.5 76.5% 96.7%)',
		g100: 'hsl(140.6 84.2% 92.5%)',
		g200: 'hsl(141 78.9% 85.1%)',
		g300: 'hsl(141.7 76.6% 73.1%)',
		g400: 'hsl(141.9 69.2% 58%)',
		g500: 'hsl(142.1 70.6% 45.3%)',
		g600: 'hsl(142.1 76.2% 36.3%)',
		g700: 'hsl(142.4 71.8% 29.2%)',
		g800: 'hsl(142.8 64.2% 24.1%)',
		g900: 'hsl(143.8 61.2% 20.2%)',
		g950: 'hsl(144.9 80.4% 10%)'
	}
};

const dark = {
	text: {
		primary: palette.neutral.n50,
		secondary: palette.neutral.n200,
		tertiary: palette.neutral.n500,
		disabled: palette.neutral.n500,
		error: palette.red.r500,
		label: palette.neutral.n100,
		invert: palette.neutral.n950,
		inactive: palette.neutral.n600
	},
	button: {
		primary: {
			background: palette.neutral.n50,
			text: palette.neutral.n900
		},
		secondary: {
			background: palette.neutral.n800,
			text: palette.neutral.n100
		},
		tertiary: {
			background: '',
			text: ''
		},
		disabled: {
			background: palette.neutral.n700,
			text: palette.neutral.n200
		},
		destructive: {
			background: palette.red.r200,
			text: palette.red.r800
		}
	},
	screen: {
		background: palette.neutral.n950
	},
	input: {
		placeholder: palette.neutral.n300,
		label: palette.neutral.n100,
		background: palette.neutral.n900,
		text: palette.neutral.n50
	},
	icon: {
		default: { color: palette.neutral.n50 }
	},
	border: {
		color: palette.neutral.n800
	},
	image: {
		placeholder: palette.neutral.n800
	},
	badge: {
		success: {
			backgroundColor: palette.green.g100,
			color: palette.green.g700
		},
		danger: {
			backgroundColor: palette.red.r100,
			color: palette.red.r700
		},
		warning: {
			backgroundColor: palette.yellow.y100,
			color: palette.yellow.y700
		},
		neutral: {
			backgroundColor: palette.neutral.n100,
			color: palette.neutral.n700
		}
	},
	navigation: {
		colors: {
			background: palette.neutral.n950,
			border: palette.neutral.n800,
			card: palette.neutral.n950,
			notification: 'rgb(255, 69, 58)',
			primary: 'rgb(10, 132, 255)',
			text: palette.neutral.n50
		},
		dark: true,
		fonts
	},
	statusBar: 'light',
	row: {
		focus: palette.neutral.n900
	},
	modal: {
		background: palette.neutral.n900
	},
	card: {
		background: palette.neutral.n900
	}
} as const;

const light = {
	text: {
		primary: palette.neutral.n800,
		secondary: palette.neutral.n600,
		tertiary: palette.neutral.n400,
		disabled: palette.neutral.n400,
		error: palette.red.r700,
		label: palette.neutral.n600,
		invert: palette.neutral.n50,
		inactive: palette.neutral.n500
	},
	button: {
		primary: {
			background: palette.neutral.n800,
			text: palette.neutral.n50
		},
		secondary: {
			background: palette.neutral.n300,
			text: palette.neutral.n100
		},
		tertiary: {
			background: '',
			text: ''
		},
		disabled: {
			background: palette.neutral.n200,
			text: palette.neutral.n700
		},
		destructive: {
			background: palette.red.r200,
			text: palette.red.r700
		}
	},
	screen: {
		background: palette.neutral.n50
	},
	input: {
		placeholder: palette.neutral.n400,
		label: palette.neutral.n600,
		background: palette.neutral.n200,
		text: palette.neutral.n950
	},
	icon: {
		default: { color: palette.neutral.n950 }
	},
	border: {
		color: palette.neutral.n300
	},
	image: {
		placeholder: palette.neutral.n300
	},
	badge: {
		success: {
			backgroundColor: palette.green.g100,
			color: palette.green.g700
		},
		danger: {
			backgroundColor: palette.red.r100,
			color: palette.red.r700
		},
		warning: {
			backgroundColor: palette.yellow.y100,
			color: palette.yellow.y700
		},
		neutral: {
			backgroundColor: palette.neutral.n100,
			color: palette.neutral.n700
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
		dark: false,
		fonts
	},
	statusBar: 'dark',
	row: {
		focus: palette.neutral.n200
	},
	modal: {
		background: palette.neutral.n200
	},
	card: {
		background: palette.neutral.n200
	}
} as const;

export type ThemeObject = typeof light | typeof dark;

export const themes = { light, dark };
