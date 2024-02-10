import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';
import useTheme from '../../hooks/useTheme';
import { ThemeObject } from '../../styles/theme';

interface BadgeProps {
	text: string;
	variant: keyof ThemeObject['badge'];
}

const Badge: React.FC<BadgeProps> = ({ text, variant }) => {
	const { theme } = useTheme();

	return (
		<View style={[styles.container, theme.badge[variant]]}>
			<Typography size='small' weight='medium'>
				{text}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 4,
		borderRadius: 4
	}
});

export default Badge;
