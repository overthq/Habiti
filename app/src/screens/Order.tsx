import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useOrderQuery } from '../types/api';

const Order = () => {
	const { params } = useRoute<any>();
	const { orderId } = params;

	const [{ data }] = useOrderQuery({ variables: { orderId } });

	const order = data?.orders[0];

	return (
		<View style={styles.container}>
			<Text>Order Details:</Text>
			<Text>{order?.id}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
