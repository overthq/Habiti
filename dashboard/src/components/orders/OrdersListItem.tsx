import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OrdersListItemProps {
	order: any;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order }) => {
	// Find a way to use date-fns and not have memory leaks. Maybe useMemo?
	// Also calculate order total from items in the order and the quantities ordered.

	return (
		<View style={styles.container}>
			<Text>2 items</Text>
			<Text>{order.price}</Text>
			<Text>{order.status}</Text>
			<Text>{order.created_at}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: 4,
		paddingHorizontal: 8
	}
});

export default OrdersListItem;
