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

// Only apply custom font on Android for now
const USE_DEFAULT_FONT = Platform.OS === 'ios';

const Typography: React.FC<TypographyProps> = props => {
	const {
		children,
		variant = 'primary',
		size = 'regular',
		weight = 'regular',
		style,
		ellipsize,
		number,
		italic,
		...rest
	} = props;
	const { theme } = useTheme();

	return (
		<Text
			{...(ellipsize ? { numberOfLines: 1 } : {})}
			{...rest}
			style={[
				{ color: theme.text[variant] },
				applyFontStyles({
					fontSize: normalizeFontSize(sizes[size]),
					fontWeight: weightMap[weight],
					fontStyle: italic ? 'italic' : 'normal',
					...(number ? { fontVariant: ['tabular-nums'] } : {})
				}),
				style
			]}
		>
			{children}
		</Text>
	);
};

// H/T: Bluesky social-app
export const applyFontStyles = (style: TextStyle = {}) => {
	if (USE_DEFAULT_FONT) return style;

	if (Platform.OS === 'android') {
		style.fontFamily =
			{
				400: 'Inter-Regular',
				500: 'Inter-Medium',
				600: 'Inter-SemiBold',
				700: 'Inter-Bold',
				800: 'Inter-Bold',
				900: 'Inter-Bold'
			}[String(style.fontWeight || '400')] || 'Inter-Regular';

		style.fontVariant = ['no-contextual'];

		if (style.fontStyle === 'italic') {
			if (style.fontFamily === 'Inter-Regular') {
				style.fontFamily = 'Inter-Italic';
			} else {
				style.fontFamily += 'Italic';
			}
		}

		delete style.fontWeight;
		delete style.fontStyle;
	} else {
		style.fontFamily = 'InterVariable';

		if (style.fontStyle === 'italic') {
			style.fontFamily += 'Italic';
		}
	}

	return style;
};

const weightMap = {
	regular: '400',
	medium: '500',
	semibold: '600',
	bold: '700'
} as const;

const FONT_SCALE = PixelRatio.getFontScale();

const normalizeFontSize = (size: number) => size / FONT_SCALE;

const sizes = {
	xsmall: 12,
	small: 14,
	regular: Platform.select({ ios: 17, android: 16, default: 15 }),
	large: 17,
	xlarge: 20,
	xxlarge: 24,
	xxxlarge: 32
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
