import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { useTheme } from './Theme';
import { ThemeObject } from './styles/theme';
import { typography } from './styles/typography';

interface TypographyProps extends TextProps {
	children: React.ReactNode;
	style?: StyleProp<TextStyle>;
	variant?: keyof ThemeObject['text'];
	size?: keyof (typeof typography)['size'];
	weight?: keyof (typeof typography)['weight'];
	preset?: keyof (typeof typography)['preset'];
	ellipsize?: boolean;
	number?: boolean;
	// ref?: React.Ref<Text>;
}

const Typography: React.FC<TypographyProps> = props => {
	const {
		children,
		variant,
		size,
		weight,
		style,
		ellipsize,
		number,
		preset,
		...rest
	} = props;
	const { theme } = useTheme();

	return (
		<Text
			{...(ellipsize ? { numberOfLines: 1 } : {})}
			{...rest}
			style={[
				generateStyles({ size, weight, preset, variant, number, theme }),
				style
			]}
		>
			{children}
		</Text>
	);
};

const generateStyles = ({
	size = 'regular',
	weight = 'regular',
	preset,
	variant = 'primary',
	number,
	theme
}: Pick<
	TypographyProps,
	'size' | 'weight' | 'preset' | 'variant' | 'number'
> & { theme: ThemeObject }): TextStyle => {
	if (preset) {
		({ size, weight, variant } = typography.preset[preset]);
	}

	return {
		color: theme.text[variant],
		fontSize: typography.size[size],
		fontWeight: typography.weight[weight],
		...(number ? { fontVariant: ['tabular-nums'] } : {})
	};
};

export default Typography;
