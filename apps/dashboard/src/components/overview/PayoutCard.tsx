import { Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const PayoutCard = () => {
	return (
		<View style={styles.container}>
			<Typography>Revenue</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8
	}
});

export default PayoutCard;
