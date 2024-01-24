import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { typography } from '../../styles/theme';

interface TypographyProps extends TextProps {
	children: React.ReactNode;
	style?: StyleProp<TextStyle>;
	variant?:
		| 'primary'
		| 'secondary'
		| 'tertiary'
		| 'disabled'
		| 'error'
		| 'label';
	size?: 'xsmall' | 'small' | 'regular' | 'large' | 'xlarge' | 'xxlarge';
	weight?: 'regular' | 'medium' | 'bold';
}

const Typography: React.FC<TypographyProps> = ({
	children,
	variant = 'primary',
	size = 'regular',
	weight = 'regular',
	style,
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Text
			style={[
				{
					color: theme.text[variant],
					fontSize: typography.size[size],
					fontWeight: typography.weight[weight]
				},
				style
			]}
			{...props}
		>
			{children}
		</Text>
	);
};

export default Typography;
