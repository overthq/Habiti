import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { typography, ThemeObject } from '../../styles/theme';

interface TypographyProps extends TextProps {
	children: React.ReactNode;
	style?: StyleProp<TextStyle>;
	variant?: keyof ThemeObject['text'];
	size?: keyof typeof typography['size'];
	weight?: keyof typeof typography['weight'];
	ellipsize?: boolean;
}

const Typography: React.FC<TypographyProps> = ({
	children,
	variant = 'primary',
	size = 'regular',
	weight = 'regular',
	style,
	ellipsize,
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Text
			{...(ellipsize ? { numberOfLines: 1 } : {})}
			{...props}
			style={[
				{
					color: theme.text[variant],
					fontSize: typography.size[size],
					fontWeight: typography.weight[weight]
				},
				style
			]}
		>
			{children}
		</Text>
	);
};

export default Typography;
