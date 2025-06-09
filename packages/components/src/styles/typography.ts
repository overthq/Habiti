import { PixelRatio, Platform } from 'react-native';

const FONT_SCALE = PixelRatio.getFontScale();

const normalizeFontSize = (size: number) => size / FONT_SCALE;

const size = {
	xsmall: normalizeFontSize(12),
	small: normalizeFontSize(14),
	regular: normalizeFontSize(
		Platform.select({ ios: 16, android: 16, default: 15 })
	),
	large: normalizeFontSize(17),
	xlarge: normalizeFontSize(20),
	xxlarge: normalizeFontSize(24),
	xxxlarge: normalizeFontSize(32)
} as const;

const weight = {
	regular: 'normal',
	medium: '500',
	semibold: '600',
	bold: 'bold'
} as const;

const preset = {
	sectionHeader: {
		size: 'large',
		weight: 'medium',
		variant: 'primary'
	},
	body: {
		size: 'regular',
		weight: 'regular',
		variant: 'primary'
	}
} as const;

export const typography = {
	size,
	weight,
	preset
} as const;

// Duplicated from react-navigation
const WEB_FONT_STACK =
	'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const fonts = Platform.select({
	web: {
		regular: {
			fontFamily: WEB_FONT_STACK,
			fontWeight: '400'
		},
		medium: {
			fontFamily: WEB_FONT_STACK,
			fontWeight: '500'
		},
		bold: {
			fontFamily: WEB_FONT_STACK,
			fontWeight: '600'
		},
		heavy: {
			fontFamily: WEB_FONT_STACK,
			fontWeight: '700'
		}
	},
	ios: {
		regular: {
			fontFamily: 'System',
			fontWeight: '400'
		},
		medium: {
			fontFamily: 'System',
			fontWeight: '500'
		},
		bold: {
			fontFamily: 'System',
			fontWeight: '600'
		},
		heavy: {
			fontFamily: 'System',
			fontWeight: '700'
		}
	},
	default: {
		regular: {
			fontFamily: 'sans-serif',
			fontWeight: 'normal'
		},
		medium: {
			fontFamily: 'sans-serif-medium',
			fontWeight: 'normal'
		},
		bold: {
			fontFamily: 'sans-serif',
			fontWeight: '600'
		},
		heavy: {
			fontFamily: 'sans-serif',
			fontWeight: '700'
		}
	}
} as const);
