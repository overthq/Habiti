import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrdersQuery } from '../../types/api';
import { Icon } from '../icons';

interface OrdersListItemProps {
	order: OrdersQuery['orders'][-1];
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order }) => {
	return (
		<View style={styles.container}>
			<Text>{order.status}</Text>
			<Text>{order.created_at}</Text>
			<Text>50.00 NGN</Text>
			<Icon name='chevronRight' />
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
