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
}

const Typography: React.FC<TypographyProps> = React.forwardRef<
	Text,
	TypographyProps
>((props, forwardedRef) => {
	const {
		children,
		variant = 'primary',
		size = 'regular',
		weight = 'regular',
		style,
		ellipsize,
		number,
		preset,
		...rest
	} = props;
	const { theme } = useTheme();

	return (
		<Text
			ref={forwardedRef}
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
});

const generateStyles = ({
	size = 'regular',
	weight = 'regular',
	preset,
	variant,
	number,
	theme
}: Pick<
	TypographyProps,
	'size' | 'weight' | 'preset' | 'variant' | 'number'
> & { theme: ThemeObject }): TextStyle => {
	if (preset) {
		size = typography.preset[preset].size;
		weight = typography.preset[preset].weight;
		variant = typography.preset[preset].variant;
	}

	return {
		color: theme.text[variant],
		fontSize: typography.size[size],
		fontWeight: typography.weight[weight],
		...(number ? { fontVariant: ['tabular-nums'] } : {})
	};
};

export default Typography;
