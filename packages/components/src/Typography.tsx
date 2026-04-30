import React from 'react';
import {
	Text,
	Platform,
	PixelRatio,
	type TextProps,
	type TextStyle,
	type StyleProp
} from 'react-native';

import { useTheme } from './Theme';
import { ThemeObject } from './styles/theme';

export interface TypographyProps extends TextProps {
	children: React.ReactNode;
	style?: StyleProp<TextStyle>;
	variant?: keyof ThemeObject['text'];
	size?: keyof typeof sizes;
	weight?: 'regular' | 'medium' | 'semibold' | 'bold';
	ellipsize?: boolean;
	number?: boolean;
	italic?: boolean;
}

const Typography: React.FC<TypographyProps> = props => {
	const { children, variant, size, weight, style, ellipsize, number, ...rest } =
		props;
	const { theme } = useTheme();

	return (
		<Text
			{...(ellipsize ? { numberOfLines: 1 } : {})}
			{...rest}
			style={[
				generateTextStyles({ size, weight, variant, number, theme }),
				style
			]}
		>
			{children}
		</Text>
	);
};

const generateTextStyles = ({
	size = 'regular',
	weight = 'regular',
	variant = 'primary',
	italic = false,
	number,
	theme
}: Pick<
	TypographyProps,
	'size' | 'weight' | 'variant' | 'number' | 'italic'
> & { theme: ThemeObject }): TextStyle => {
	let fontFamily: string;

	if (Platform.OS === 'android') {
		fontFamily =
			{
				regular: 'Inter-Regular',
				medium: 'Inter-Medium',
				semibold: 'Inter-SemiBold',
				bold: 'Inter-Bold'
			}[weight] || 'Inter-Regular';

		if (italic) {
			if (fontFamily === 'Inter-Regular') {
				fontFamily = 'Inter-Italic';
			} else {
				fontFamily += 'Italic';
			}
		}
	} else {
		fontFamily = 'InterVariable';

		if (italic) {
			fontFamily += 'Italic';
		}
	}

	return {
		color: theme.text[variant],
		fontFamily,
		fontSize: sizes[size],
		// fontWeight: typography.weight[weight],
		...(number ? { fontVariant: ['tabular-nums'] } : {})
	};
};

const FONT_SCALE = PixelRatio.getFontScale();

const normalizeFontSize = (size: number) => size / FONT_SCALE;

const sizes = {
	xsmall: normalizeFontSize(12),
	small: normalizeFontSize(14),
	regular: normalizeFontSize(
		Platform.select({ ios: 17, android: 16, default: 15 })
	),
	large: normalizeFontSize(17),
	xlarge: normalizeFontSize(20),
	xxlarge: normalizeFontSize(24),
	xxxlarge: normalizeFontSize(32)
} as const;

const iOSFontSizes = {
	largeTitle: {
		size: 34,
		weight: 'regular',
		leading: 41
	},
	title1: {
		size: 28,
		weight: 'regular',
		leading: 34
	},
	title2: {
		size: 22,
		weight: 'regular',
		leading: 28
	},
	title3: {
		size: 20,
		weight: 'regular',
		leading: 24
	},
	headline: {
		size: 17,
		weight: 'regular',
		leading: 22
	},
	subheadline: {
		size: 15,
		weight: 'regular',
		leading: 20
	},
	body: {
		size: 17,
		weight: 'regular',
		leading: 22
	},
	callout: {
		size: 16,
		weight: 'regular',
		leading: 20
	},
	caption1: {
		size: 12,
		weight: 'regular',
		leading: 16
	},
	caption2: {
		size: 11,
		weight: 'regular',
		leading: 15
	}
};

const androidFontSizes = {};

export default Typography;
