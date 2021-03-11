import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';

interface OrdersListItemProps {
	order: OrdersQuery['orders'][-1];
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<Text>2 items</Text>
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
