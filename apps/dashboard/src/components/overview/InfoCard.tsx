import React from 'react';
import { View, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';

const InfoCard = () => {
	const { theme } = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.text.secondary }]}
		></View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		padding: 8
	}
});

export default InfoCard;
