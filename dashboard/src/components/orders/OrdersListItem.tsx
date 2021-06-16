import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';
import { Icon } from '../icons';

interface OrdersListItemProps {
	order: OrdersQuery['orders'][-1];
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order }) => {
	const amount = order.order_items.reduce(
		(acc, { unit_price, quantity }) => acc + (unit_price || 0) * quantity,
		0
	);

	return (
		<View style={styles.container}>
			<View>
				<Text>{order.user.name}</Text>
				<Text>{order.status}</Text>
				<Text>{order.created_at}</Text>
				<Text>{amount} NGN</Text>
			</View>
			<Icon name='chevronRight' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: 4,
		paddingHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
	name: {
		fontSize: 18,
		fontWeight: '500'
	}
});

export default OrdersListItem;
