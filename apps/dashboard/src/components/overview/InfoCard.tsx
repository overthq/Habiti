import { useTheme } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const InfoCard = () => {
	const { theme } = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.text.secondary }]}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		padding: 8
	}
});

export default InfoCard;
