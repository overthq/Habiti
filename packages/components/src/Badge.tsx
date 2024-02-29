import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';
import { ThemeObject } from './styles/theme';

interface BadgeProps {
	text: string;
	variant: keyof ThemeObject['badge'];
}

const Badge: React.FC<BadgeProps> = ({ text, variant }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.badge[variant].backgroundColor }
			]}
		>
			<Typography
				size='small'
				weight='medium'
				style={{ color: theme.badge[variant].color }}
			>
				{text}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignSelf: 'flex-start',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4
	}
});

export default Badge;
