import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Row, Typography } from '@habiti/components';

import { UserOrdersQuery } from '../../types/api';

interface OrdersListItemProps {
	order: UserOrdersQuery['currentUser']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Row onPress={onPress}>
			<View style={styles.container}>
				<Avatar
					uri={order.store.image?.path}
					fallbackText={order.store.name}
					size={40}
				/>
				<Typography>{order.store.name}</Typography>
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	}
});

export default OrdersListItem;
