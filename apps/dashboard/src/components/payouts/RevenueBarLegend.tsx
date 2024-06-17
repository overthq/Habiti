import { Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const RevenueBarLegend = () => {
	return (
		<View style={styles.container}>
			<View style={styles.unit}>
				<View style={[styles.square, { backgroundColor: 'green' }]} />
				<Typography size='xsmall'>Available</Typography>
			</View>
			<View style={styles.unit}>
				<View style={[styles.square, { backgroundColor: 'yellow' }]} />
				<Typography size='xsmall'>Unrealized</Typography>
			</View>
			<View style={styles.unit}>
				<View style={[styles.square, { backgroundColor: 'grey' }]} />
				<Typography size='xsmall'>Total</Typography>
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
