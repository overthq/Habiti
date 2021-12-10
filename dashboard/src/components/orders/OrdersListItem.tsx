import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';
import { Icon } from '../icons';

interface OrdersListItemProps {
	order: OrdersQuery['store']['orders'][-1];
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order }) => {
	const amount = order.products
		.reduce(
			(acc, { unitPrice, quantity }) => acc + (unitPrice || 0) * quantity,
			0
		)
		.toFixed(2);

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.name}>{order.user.name}</Text>
				{/*<Text>{order.status}</Text> */}
				<Text>{order.createdAt}</Text>
			</View>
			<Text>{amount} NGN</Text>
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
