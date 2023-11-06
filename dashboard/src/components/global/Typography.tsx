import React from 'react';
import { Text, TextStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface TypographyProps {
	children: React.ReactNode;
	style?: TextStyle;
}

const Typography: React.FC<TypographyProps> = ({ children, style }) => {
	const { theme } = useTheme();

	return <Text style={[{ color: theme.text.primary }, style]}>{children}</Text>;
};

export default Typography;
