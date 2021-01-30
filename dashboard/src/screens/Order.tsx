import React from 'react';
import { View, StyleSheet } from 'react-native';

// What is on this screen?
// Order ID/number,
// Order Status, and easy way to update
// Order Information (items, prices etc.)
// Customer information

// Fun question (logic-related): What happens if the price of an item changes before the order is fulfilled?

const Order: React.FC = () => {
	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
