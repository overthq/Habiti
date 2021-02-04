import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useOrderQuery } from '../types/api';

// What is on this screen?
// Order ID/number,
// Order Status, and easy way to update
// Order Information (items, prices etc.)
// Customer information

// Fun question (logic-related): What happens if the price of an item changes before the order is fulfilled?

const Order: React.FC = () => {
	const { params } = useRoute<any>();
	const { orderId } = params;

	const [{ data }] = useOrderQuery({ variables: { orderId } });

	// Always handle query errors correctly
	// Use skeleton view for loading state.

	const order = data?.orders[0];

	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
