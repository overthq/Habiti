import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface TypographyProps extends TextProps {
	children: React.ReactNode;
	style?: TextStyle;
	variant?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'error';
	size?: 'small' | 'regular' | 'medium' | 'large' | 'xlarge';
	weight?: 'regular' | 'medium' | 'bold';
}

const Typography: React.FC<TypographyProps> = ({
	children,
	variant = 'primary',
	style,
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Text style={[{ color: theme.text[variant] }, style]} {...props}>
			{children}
		</Text>
	);
};

export default Typography;
