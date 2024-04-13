import { PixelRatio } from 'react-native';

const FONT_SCALE = PixelRatio.getFontScale();

const normalizeFontSize = (size: number) => size / FONT_SCALE;

const size = {
	xsmall: normalizeFontSize(12),
	small: normalizeFontSize(14),
	regular: normalizeFontSize(16),
	large: normalizeFontSize(18),
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
		size: 'regular',
		weight: 'medium',
		variant: 'primary'
	},
	body: {
		size: 'regular',
		weight: 'regular',
		variant: 'label'
	}
} as const;

export const typography = {
	size,
	weight,
	preset
} as const;
