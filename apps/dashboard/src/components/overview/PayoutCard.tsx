import React from 'react';
import { View, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import Typography from '../global/Typography';
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
