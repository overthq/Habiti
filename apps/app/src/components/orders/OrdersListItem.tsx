import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { UserOrdersQuery } from '../../types/api';

interface OrdersListItemProps {
	order: UserOrdersQuery['currentUser']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Pressable onPress={onPress}>
			<View>
				<Text>{order.store.name}</Text>
			</View>
		</Pressable>
	);
};

export default OrdersListItem;
