import { Typography } from '@habiti/components';
import React from 'react';
import { View, Pressable } from 'react-native';

import { UserOrdersQuery } from '../../types/api';

interface OrdersListItemProps {
	order: UserOrdersQuery['currentUser']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Pressable onPress={onPress}>
			<View>
				<Typography>{order.store.name}</Typography>
			</View>
		</Pressable>
	);
};

export default OrdersListItem;
