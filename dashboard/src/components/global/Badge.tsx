import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';
import useTheme from '../../hooks/useTheme';
import { ThemeObject } from '../../styles/theme';

interface BadgeProps {
	text: string;
	variant: ThemeObject['badge'];
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
