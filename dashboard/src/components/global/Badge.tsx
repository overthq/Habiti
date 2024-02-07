import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';
import useTheme from '../../hooks/useTheme';

interface BadgeProps {
	text: string;
	variant: 'success' | 'danger' | 'warning' | 'neutral';
}

const Badge: React.FC<BadgeProps> = ({ text }) => {
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			<Typography>{text}</Typography>
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
