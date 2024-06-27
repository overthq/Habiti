import { PixelRatio, Platform } from 'react-native';

const FONT_SCALE = PixelRatio.getFontScale();

const normalizeFontSize = (size: number) => size / FONT_SCALE;

const size = {
	xsmall: normalizeFontSize(12),
	small: normalizeFontSize(14),
	regular: normalizeFontSize(
		Platform.select({ ios: 15, android: 16, default: 15 })
	),
	large: normalizeFontSize(17),
	xlarge: normalizeFontSize(20),
	xxlarge: normalizeFontSize(24),
	xxxlarge: normalizeFontSize(32)
} as const;

const weight = {
	regular: 'normal',
	medium: '500',
	bold: 'bold'
} as const;

const preset = {
	sectionHeader: {
		size: 'large',
		weight: 'medium',
		variant: 'label'
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
