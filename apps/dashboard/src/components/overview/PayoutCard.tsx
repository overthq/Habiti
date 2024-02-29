import { useTheme, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useStoreQuery } from '../../types/api';

const PayoutCard = () => {
	const { theme } = useTheme();
	const [{ data }] = useStoreQuery();

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
