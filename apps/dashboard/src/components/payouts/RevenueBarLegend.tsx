import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, useTheme } from '@habiti/components';
import { palette } from '@habiti/components/src/styles/theme';

const RevenueBarLegend = () => {
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			<View style={styles.unit}>
				<View
					style={[styles.square, { backgroundColor: palette.green.g400 }]}
				/>
				<Typography size='small'>Available</Typography>
			</View>
			<View style={styles.unit}>
				<View
					style={[styles.square, { backgroundColor: palette.yellow.y400 }]}
				/>
				<Typography size='small'>Realized</Typography>
			</View>
			<View style={styles.unit}>
				<View
					style={[styles.square, { backgroundColor: theme.input.background }]}
				/>
				<Typography size='small'>Unrealized</Typography>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
		flexDirection: 'row',
		alignItems: 'center'
	},
	unit: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 16
	},
	square: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 4
	}
});

export default RevenueBarLegend;
